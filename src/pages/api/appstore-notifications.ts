import type { NextApiRequest, NextApiResponse } from 'next'
import { parseNotification, opposeRefund } from '../../utils/appstore'

/**
 * App Store Server Notifications V2 endpoint.
 * Configure this URL in App Store Connect → App → App Information →
 * App Store Server Notifications (Production + Sandbox):
 *   https://bgmobiledev.com/api/appstore-notifications
 *
 * On CONSUMPTION_REQUEST it replies to Apple's Consumption API with
 * refundPreference = PREFER_DECLINE to oppose the refund.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', service: 'appstore-notifications' })
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed' })
  }

  try {
    const signedPayload: string | undefined =
      typeof req.body === 'string' ? JSON.parse(req.body)?.signedPayload : req.body?.signedPayload

    if (!signedPayload) {
      return res.status(400).json({ error: 'missing signedPayload' })
    }

    const n = parseNotification(signedPayload)
    console.log('[ASN] type=%s subtype=%s bundle=%s tx=%s reason=%s env=%s',
      n.notificationType, n.subtype, n.bundleId, n.transactionId, n.consumptionRequestReason, n.environment)

    if (n.notificationType === 'CONSUMPTION_REQUEST') {
      try {
        const result = await opposeRefund(n)
        console.log('[ASN] opposeRefund:', result.detail)
      } catch (e: any) {
        // Never fail the webhook for Apple — log and move on.
        console.error('[ASN] opposeRefund error:', e?.message || e)
      }
    }

    // Always 200 so Apple does not retry endlessly.
    return res.status(200).json({ received: true })
  } catch (e: any) {
    console.error('[ASN] handler error:', e?.message || e)
    return res.status(200).json({ received: true })
  }
}
