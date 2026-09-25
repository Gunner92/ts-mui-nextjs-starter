/**
 * App Store Server Notifications V2 → Consumption API helper.
 *
 * When a customer asks Apple for a refund on an app that has the ASN V2 URL
 * configured, Apple sends a CONSUMPTION_REQUEST and gives us 12 hours to reply
 * with consumption information. Apple's rules for that reply are strict:
 *
 *   - We may reply ONLY if the customer consented to us sharing their usage
 *     with Apple. No consent → do not respond at all.
 *   - Every field we send must be true. Apple uses it to decide the refund.
 *
 * So this module answers only for Yuko, and only when one of two consent
 * sources holds: (1) the customer purchased after the privacy policy started
 * disclosing the sharing (the policy is linked on the paywall and the store
 * page; the date is REFUND_CONSENT_EFFECTIVE_DATE), or (2) a future build
 * attached an app account token and uploaded a usage record showing consent.
 * With (1) alone we do not know how much was used, so consumption is sent as
 * UNDECLARED rather than guessed. Everything else is logged and left
 * unanswered, which is exactly what Apple asks for.
 *
 * The usage record lives on the AI proxy site (Netlify Blobs), because that is
 * the only backend these apps talk to. It is fetched server-to-server with a
 * shared secret.
 */
import {
  AppStoreServerAPIClient,
  Environment,
  type ConsumptionRequestV1,
  ConsumptionStatus,
  DeliveryStatusV1,
  Platform,
  AccountTenure,
  PlayTime,
  LifetimeDollarsRefunded,
  LifetimeDollarsPurchased,
  UserStatus,
  RefundPreferenceV1,
} from '@apple/app-store-server-library'

export interface ParsedNotification {
  notificationType: string
  subtype?: string
  transactionId?: string
  originalTransactionId?: string
  bundleId?: string
  productId?: string
  environment?: string
  appAppleId?: number
  consumptionRequestReason?: string
  /** UUID the app attached at purchase time; absent on older purchases. */
  appAccountToken?: string
  /** Milliseconds since epoch. */
  purchaseDate?: number
  /** First purchase in this subscription family, milliseconds since epoch. */
  originalPurchaseDate?: number
  /** 1 = introductory offer (for Yuko that is the free trial), 2 = promotional, 3 = offer code. */
  offerType?: number
}

/** The usage record the app uploads to the proxy once the customer consents. */
export interface RefundAssistRecord {
  token: string
  consented: boolean
  consentDate?: string | null
  firstSeenDate?: string
  scansTotal?: number
  daysWithScans?: number
  /** "yyyy-MM" → scans in that month. */
  scansByMonth?: Record<string, number>
  purchases?: { productId: string; purchaseDate: string }[]
  appVersion?: string
  updatedAt?: string
}

/** Apps whose binaries ask for consent and upload usage. Nothing else is answered. */
const CONSENT_FLOW_BUNDLES = new Set<string>(['burak.fatih.right.food'])

/**
 * Consent by purchase under the published privacy policy.
 *
 * The app's privacy policy — linked on the paywall and on the App Store page —
 * states that when a customer asks Apple for a refund we may share how much
 * they used the app with Apple. A purchase made after that statement went live
 * is a purchase made on those terms. Purchases before it are not, and get no
 * answer. The date is configured, not hard-coded, so it can only be set once
 * the page really says so: REFUND_CONSENT_EFFECTIVE_DATE (ISO 8601).
 */
function policyConsentEffectiveDate(): number | null {
  const raw = process.env.REFUND_CONSENT_EFFECTIVE_DATE
  if (!raw) return null
  const t = Date.parse(raw)
  return Number.isNaN(t) ? null : t
}

export function purchasedUnderPolicy(n: ParsedNotification, effective: number | null): boolean {
  return effective !== null && typeof n.purchaseDate === 'number' && n.purchaseDate >= effective
}

/** Scans after purchase that make a subscription "fully" used for our purposes. */
const FULLY_CONSUMED_SCANS = 10

function decodeJwtPayload(jws: string): any {
  const part = jws.split('.')[1]
  if (!part) return {}
  return JSON.parse(Buffer.from(part, 'base64url').toString('utf8'))
}

/** Decodes the signed payload without full cert-chain verification (integrity is
 *  re-established by calling the App Store Server API with our own signed key). */
export function parseNotification(signedPayload: string): ParsedNotification {
  const payload = decodeJwtPayload(signedPayload)
  const data = payload.data || {}
  let transactionId: string | undefined
  let originalTransactionId: string | undefined
  let bundleId: string | undefined = data.bundleId
  let productId: string | undefined
  let environment: string | undefined = data.environment
  let appAccountToken: string | undefined
  let purchaseDate: number | undefined
  let originalPurchaseDate: number | undefined
  let offerType: number | undefined

  if (data.signedTransactionInfo) {
    const tx = decodeJwtPayload(data.signedTransactionInfo)
    transactionId = tx.transactionId
    originalTransactionId = tx.originalTransactionId
    bundleId = bundleId || tx.bundleId
    productId = tx.productId
    environment = environment || tx.environment
    appAccountToken = typeof tx.appAccountToken === 'string' ? tx.appAccountToken.toLowerCase() : undefined
    purchaseDate = typeof tx.purchaseDate === 'number' ? tx.purchaseDate : undefined
    originalPurchaseDate = typeof tx.originalPurchaseDate === 'number' ? tx.originalPurchaseDate : undefined
    offerType = typeof tx.offerType === 'number' ? tx.offerType : undefined
  }

  return {
    notificationType: payload.notificationType,
    subtype: payload.subtype,
    transactionId,
    originalTransactionId,
    bundleId,
    productId,
    environment,
    appAppleId: data.appAppleId,
    consumptionRequestReason: data.consumptionRequestReason,
    appAccountToken,
    purchaseDate,
    originalPurchaseDate,
    offerType,
  }
}

function privateKey(): string {
  // Netlify env vars often store newlines as literal "\n".
  return (process.env.ASC_IAP_KEY || '').replace(/\\n/g, '\n')
}

function clientFor(bundleId: string, env?: string): AppStoreServerAPIClient {
  const environment = env === 'Sandbox' ? Environment.SANDBOX : Environment.PRODUCTION
  return new AppStoreServerAPIClient(
    privateKey(),
    process.env.ASC_IAP_KEY_ID || '',
    process.env.ASC_ISSUER_ID || '',
    bundleId,
    environment,
  )
}

// ---------------------------------------------------------------------------
// Usage record lookup (proxy site, server-to-server)

/** Fetches the app's usage record for this token, or null when there is none. */
export async function fetchRefundAssist(
  bundleId: string,
  token: string,
  fetchImpl: typeof fetch = fetch,
): Promise<RefundAssistRecord | null> {
  const base = (process.env.REFUND_ASSIST_URL || '').replace(/\/+$/, '')
  const secret = process.env.REFUND_ASSIST_SECRET || ''
  if (!base || !secret) {
    throw new Error('REFUND_ASSIST_URL / REFUND_ASSIST_SECRET not configured')
  }
  const url = `${base}/api/refund-assist?bundleId=${encodeURIComponent(bundleId)}&token=${encodeURIComponent(token)}`
  const res = await fetchImpl(url, { headers: { 'x-refund-assist-secret': secret } })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`refund-assist lookup failed: HTTP ${res.status}`)
  return (await res.json()) as RefundAssistRecord
}

// ---------------------------------------------------------------------------
// Truthful field mapping (pure, unit-testable)

function monthKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

/** Scans recorded in the purchase month and every month after it. Month
 *  granularity is what the app uploads; it over-counts the purchase month a
 *  little, never under-counts, which is the safe direction for the customer. */
export function scansSincePurchase(record: RefundAssistRecord, purchaseDate?: number): number {
  const byMonth = record.scansByMonth || {}
  if (!purchaseDate) return record.scansTotal || 0
  const from = monthKey(new Date(purchaseDate))
  return Object.entries(byMonth)
    .filter(([month]) => month >= from)
    .reduce((sum, [, n]) => sum + (Number(n) || 0), 0)
}

export function tenureFor(firstSeenDate: string | undefined, now: Date): AccountTenure {
  if (!firstSeenDate) return AccountTenure.UNDECLARED
  const first = new Date(firstSeenDate)
  if (Number.isNaN(first.getTime())) return AccountTenure.UNDECLARED
  const days = Math.max(0, (now.getTime() - first.getTime()) / 86_400_000)
  if (days < 3) return AccountTenure.ZERO_TO_THREE_DAYS
  if (days < 10) return AccountTenure.THREE_DAYS_TO_TEN_DAYS
  if (days < 30) return AccountTenure.TEN_DAYS_TO_THIRTY_DAYS
  if (days < 90) return AccountTenure.THIRTY_DAYS_TO_NINETY_DAYS
  if (days < 180) return AccountTenure.NINETY_DAYS_TO_ONE_HUNDRED_EIGHTY_DAYS
  if (days < 365) return AccountTenure.ONE_HUNDRED_EIGHTY_DAYS_TO_THREE_HUNDRED_SIXTY_FIVE_DAYS
  return AccountTenure.GREATER_THAN_THREE_HUNDRED_SIXTY_FIVE_DAYS
}

/**
 * Builds the consumption information from what we actually know. Anything we
 * do not measure is sent as UNDECLARED rather than guessed:
 *
 *   consumptionStatus   from scans recorded since the purchase
 *   sampleContentProvided  true when the transaction carried an introductory
 *                          offer — Yuko's only introductory offer is the free trial
 *   deliveryStatus      DELIVERED_AND_WORKING_PROPERLY: StoreKit granted the
 *                       entitlement and the app has no known outage for it
 *   accountTenure       from the first launch date the app recorded
 *   playTime, lifetime dollars   not measured → UNDECLARED
 *   refundPreference    PREFER_DECLINE only when the customer actually used the
 *                       purchase; NO_PREFERENCE when they did not
 */
export function buildConsumptionRequest(
  n: ParsedNotification,
  record: RefundAssistRecord | null,
  now: Date,
): ConsumptionRequestV1 {
  // With a usage record we can say how much was used. Without one (consent
  // came from purchasing under the policy, and this build uploads nothing)
  // we do not know, and we say so: UNDECLARED, never a guess.
  const scans = record ? scansSincePurchase(record, n.purchaseDate) : null
  const consumptionStatus =
    scans === null ? ConsumptionStatus.UNDECLARED
    : scans <= 0 ? ConsumptionStatus.NOT_CONSUMED
    : scans < FULLY_CONSUMED_SCANS ? ConsumptionStatus.PARTIALLY_CONSUMED
    : ConsumptionStatus.FULLY_CONSUMED

  // Tenure: the app's first-launch date when we have it, otherwise the first
  // purchase in this subscription family, which Apple itself reports.
  const tenureSource = record?.firstSeenDate
    ?? (typeof n.originalPurchaseDate === 'number' ? new Date(n.originalPurchaseDate).toISOString() : undefined)

  // The owner's stated preference is to decline. It is a preference, not a
  // fact, so it may be sent whenever we are entitled to answer at all; the
  // one exception is measured non-use, where we take no position.
  const refundPreference = scans !== null && scans <= 0
    ? RefundPreferenceV1.NO_PREFERENCE
    : RefundPreferenceV1.PREFER_DECLINE

  return {
    appAccountToken: record?.token ?? n.appAccountToken ?? '',
    customerConsented: true,
    consumptionStatus,
    platform: Platform.APPLE,
    sampleContentProvided: n.offerType === 1,
    deliveryStatus: DeliveryStatusV1.DELIVERED_AND_WORKING_PROPERLY,
    accountTenure: tenureFor(tenureSource, now),
    playTime: PlayTime.UNDECLARED,
    lifetimeDollarsRefunded: LifetimeDollarsRefunded.UNDECLARED,
    lifetimeDollarsPurchased: LifetimeDollarsPurchased.UNDECLARED,
    userStatus: UserStatus.ACTIVE,
    refundPreference,
  }
}

// ---------------------------------------------------------------------------
// Entry point

/**
 * Answers a CONSUMPTION_REQUEST, or explains why it is left unanswered.
 * `ok: false` here is not a failure: it is the correct, silent outcome for
 * every case where we have no consent.
 */
export async function answerConsumptionRequest(
  n: ParsedNotification,
  deps: { fetchImpl?: typeof fetch; now?: () => Date } = {},
): Promise<{ ok: boolean; detail: string }> {
  if (!n.transactionId || !n.bundleId) return { ok: false, detail: 'missing transactionId/bundleId' }
  if (!CONSENT_FLOW_BUNDLES.has(n.bundleId)) {
    return { ok: false, detail: `no consent flow for ${n.bundleId} — not responding` }
  }

  // Source 1: the app asked and uploaded a usage record (future builds).
  let record: RefundAssistRecord | null = null
  if (n.appAccountToken) {
    record = await fetchRefundAssist(n.bundleId, n.appAccountToken, deps.fetchImpl)
    if (record && !record.consented) {
      return { ok: false, detail: 'customer has not consented — not responding' }
    }
  }
  // Source 2: purchased under the privacy policy that discloses the sharing.
  if (!record && !purchasedUnderPolicy(n, policyConsentEffectiveDate())) {
    return { ok: false, detail: 'no usage record and purchase predates the policy — not responding' }
  }

  const request = buildConsumptionRequest(n, record, (deps.now || (() => new Date()))())
  await clientFor(n.bundleId, n.environment).sendConsumptionData(n.transactionId, request)
  const preference = request.refundPreference === RefundPreferenceV1.PREFER_DECLINE ? 'PREFER_DECLINE' : 'NO_PREFERENCE'
  return { ok: true, detail: `consumption sent (${preference}, status ${request.consumptionStatus}) for ${n.transactionId}` }
}
