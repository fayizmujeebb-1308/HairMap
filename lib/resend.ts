import { Resend } from 'resend'

export function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendReminderEmail({
  to,
  firstName,
  treatmentName,
  streak,
}: {
  to: string
  firstName: string
  treatmentName: string
  streak: number
}) {
  const resend = getResend()
  const streakLine = streak >= 2
    ? `You&apos;re on a <strong>${streak}-day streak</strong> 🔥 Don&apos;t break it now.`
    : `Every dose counts. Keep going 💪`

  await resend.emails.send({
    from: 'HairMap <onboarding@resend.dev>',
    to,
    subject: `💊 Time for your ${treatmentName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
          <tr><td align="center">
            <table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;border:0.5px solid #e5e7eb;">

              <!-- Header -->
              <tr>
                <td style="background:#1D9E75;padding:24px 32px;">
                  <p style="margin:0;color:rgba(255,255,255,0.7);font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">HairMap</p>
                  <h1 style="margin:4px 0 0;color:#fff;font-size:22px;font-weight:600;">Treatment Reminder</h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:32px;">
                  <p style="margin:0 0 8px;color:#374151;font-size:16px;">Hey ${firstName},</p>
                  <p style="margin:0 0 24px;color:#6b7280;font-size:14px;line-height:1.6;">
                    It&apos;s time for your <strong style="color:#111827;">${treatmentName}</strong>.<br/>
                    ${streakLine}
                  </p>

                  <!-- CTA -->
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background:#1D9E75;border-radius:12px;">
                        <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://hair-map.vercel.app'}/log"
                          style="display:inline-block;padding:14px 28px;color:#fff;font-size:14px;font-weight:600;text-decoration:none;">
                          Log dose now →
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:24px 0 0;color:#9ca3af;font-size:12px;line-height:1.6;">
                    Consistency is the #1 predictor of results with hair loss treatments.<br/>
                    Users who log daily see 3× better progress tracking.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:16px 32px;border-top:0.5px solid #f3f4f6;">
                  <p style="margin:0;color:#d1d5db;font-size:11px;">
                    You&apos;re receiving this because you set a reminder in HairMap.<br/>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://hair-map.vercel.app'}/account" style="color:#1D9E75;">Manage reminders</a>
                  </p>
                </td>
              </tr>

            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
  })
}
