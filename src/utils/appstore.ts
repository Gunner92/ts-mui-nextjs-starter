/**
 * App Store Server Notifications V2 → Consumption API helper.
 *
 * When a customer requests a refund for an app that has the ASN V2 URL configured,
 * Apple sends a CONSUMPTION_REQUEST. We respond with consumption information whose
 * `refundPreference = PREFER_DECLINE` tells Apple we'd prefer the refund be declined.
 * Apple makes the final decision — this influences, it does not hard-reject.
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
}

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

  if (data.signedTransactionInfo) {
    const tx = decodeJwtPayload(data.signedTransactionInfo)
    transactionId = tx.transactionId
    originalTransactionId = tx.originalTransactionId
    bundleId = bundleId || tx.bundleId
    productId = tx.productId
    environment = environment || tx.environment
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
  }
}

function privateKey(): string {
  // Netlify env vars often store newlines as literal "\n".
  return (process.env.ASC_IAP_KEY || '').replace(/\\n/g, '\n')
}

function isAllowedBundle(bundleId?: string): boolean {
  const allow = (process.env.ASC_BUNDLE_IDS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (allow.length === 0) return true // no allowlist configured → accept all our apps
  return !!bundleId && allow.includes(bundleId)
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

/** Sends consumption info that opposes the refund for the given transaction. */
export async function opposeRefund(n: ParsedNotification): Promise<{ ok: boolean; detail: string }> {
  if (!n.transactionId || !n.bundleId) return { ok: false, detail: 'missing transactionId/bundleId' }
  if (!isAllowedBundle(n.bundleId)) return { ok: false, detail: `bundle not allowed: ${n.bundleId}` }

  const client = clientFor(n.bundleId, n.environment)

  const consumptionRequest: ConsumptionRequestV1 = {
    customerConsented: true,
    consumptionStatus: ConsumptionStatus.NOT_CONSUMED,
    platform: Platform.APPLE,
    sampleContentProvided: false,
    deliveryStatus: DeliveryStatusV1.DELIVERED_AND_WORKING_PROPERLY,
    accountTenure: AccountTenure.UNDECLARED,
    playTime: PlayTime.UNDECLARED,
    lifetimeDollarsRefunded: LifetimeDollarsRefunded.UNDECLARED,
    lifetimeDollarsPurchased: LifetimeDollarsPurchased.UNDECLARED,
    userStatus: UserStatus.ACTIVE,
    refundPreference: RefundPreferenceV1.PREFER_DECLINE, // oppose the refund
  }

  await client.sendConsumptionData(n.transactionId, consumptionRequest)
  return { ok: true, detail: `consumption sent (PREFER_DECLINE) for ${n.transactionId}` }
}
