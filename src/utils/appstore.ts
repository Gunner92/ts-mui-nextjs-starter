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
 * sources holds: (1) the customer first bought after the privacy policy started
 * disclosing the sharing (the policy is linked on the paywall and the store
 * page; the date is POLICY_CONSENT_EFFECTIVE_DATE), or (2) a future build
 * attached an app account token and uploaded a usage record showing consent.
 * Neither source tells us a consumption amount, so none is sent rather than a
 * guess. Everything else is logged and left unanswered, which is exactly what
 * Apple asks for.
 *
 * Answers go to Send Consumption Information (V2, /inApps/v2/…), which covers
 * every product type. V1 only covers consumables and auto-renewable
 * subscriptions, so it cannot answer for Yuko's lifetime (non-consumable) plan.
 *
 * The usage record lives on the AI proxy site (Netlify Blobs), because that is
 * the only backend these apps talk to. It is fetched server-to-server with a
 * shared secret.
 */
import {
  AppStoreServerAPIClient,
  Environment,
  type ConsumptionRequest,
  DeliveryStatus,
  RefundPreference,
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

/**
 * Apps whose customers can consent, with the facts we state for each. Nothing
 * else is answered.
 *
 * sampleContentProvided — Apple: true if, before the purchase, you provided a
 * free sample or free trial, or information about the content and how it
 * works. Yuko lets every non-subscriber run three free scans before the
 * paywall (ScanLimitManager.freeScanLimit, gate in AppTabView), and its
 * paywall describes the features and the weekly plan's free trial. This is a
 * fact about the app, not the transaction: the refunded transaction is the
 * paid charge, which never carries the trial's offerType.
 */
const CONSENT_FLOW_APPS = new Map<string, { sampleContentProvided: boolean }>([
  ['burak.fatih.right.food', { sampleContentProvided: true }],
])

/**
 * Consent by purchase under the published privacy policy.
 *
 * The app's privacy policy — linked on the paywall and on the App Store page —
 * states that when a customer asks Apple for a refund we may share how much
 * they used the app with Apple. A purchase made after that statement went live
 * is a purchase made on those terms. Purchases before it are not, and get no
 * answer. For a subscription the purchase that counts is the first one — when
 * the customer went through the paywall — not a later renewal: a subscription
 * started before the policy stays on the old terms when it renews.
 *
 * This is the moment the paragraph was observed live on the page. It lives in
 * code, not in netlify.toml: Netlify does not pass netlify.toml variables to
 * functions, so the earlier env-based date was always unset at runtime and
 * every request was refused as "predates the policy". Never move it earlier.
 */
const POLICY_CONSENT_EFFECTIVE_DATE = '2024-09-25T19:09:03Z'

function policyConsentEffectiveDate(): number {
  return Date.parse(POLICY_CONSENT_EFFECTIVE_DATE)
}

export function purchasedUnderPolicy(n: ParsedNotification, effective: number): boolean {
  return typeof n.originalPurchaseDate === 'number' && n.originalPurchaseDate >= effective
}

function decodeJwtPayload(jws: string): any {
  const part = jws.split('.')[1]
  if (!part) return {}
  return JSON.parse(Buffer.from(part, 'base64url').toString('utf8'))
}

/** Decodes the signed payload without verifying its signature. */
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

/**
 * Builds the consumption information from what we actually know. Anything we
 * do not measure is left out rather than guessed:
 *
 *   customerConsented      true — we only get here with consent
 *   deliveryStatus         DELIVERED: StoreKit granted the entitlement and the
 *                          app has no known outage for it
 *   sampleContentProvided  the app's fact from CONSENT_FLOW_APPS
 *   refundPreference       DECLINE, except for measured non-use, where we take
 *                          no position and leave it out
 *   consumptionPercentage  never sent: we do not measure it, and Apple rejects it
 *                          for auto-renewable subscriptions (it derives the
 *                          percentage from elapsed time itself)
 */
export function buildConsumptionRequest(
  n: ParsedNotification,
  record: RefundAssistRecord | null,
  app: { sampleContentProvided: boolean },
): ConsumptionRequest {
  // With a usage record we know whether the purchase was used. Without one
  // (consent came from purchasing under the policy, and this build uploads
  // nothing) we do not, and we do not pretend to.
  const scans = record ? scansSincePurchase(record, n.purchaseDate) : null
  const measuredNonUse = scans !== null && scans <= 0

  // The owner's stated preference is to decline. It is a preference, not a
  // fact, so it may be sent whenever we are entitled to answer at all.
  return {
    customerConsented: true,
    deliveryStatus: DeliveryStatus.DELIVERED,
    sampleContentProvided: app.sampleContentProvided,
    ...(measuredNonUse ? {} : { refundPreference: RefundPreference.DECLINE }),
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
  deps: { fetchImpl?: typeof fetch } = {},
): Promise<{ ok: boolean; detail: string }> {
  if (!n.transactionId || !n.bundleId) return { ok: false, detail: 'missing transactionId/bundleId' }
  const app = CONSENT_FLOW_APPS.get(n.bundleId)
  if (!app) {
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
  // Source 2: first purchased under the privacy policy that discloses the sharing.
  if (!record && !purchasedUnderPolicy(n, policyConsentEffectiveDate())) {
    return { ok: false, detail: 'no usage record and first purchase predates the policy — not responding' }
  }

  const request = buildConsumptionRequest(n, record, app)
  await clientFor(n.bundleId, n.environment).sendConsumptionInformation(n.transactionId, request)
  return { ok: true, detail: `consumption sent (${request.refundPreference ?? 'no preference'}) for ${n.transactionId}` }
}
