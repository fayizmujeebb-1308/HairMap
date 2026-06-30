import Link from 'next/link'

const LAST_UPDATED = 'June 24, 2025'
const CONTACT_EMAIL = 'support@hair-map.com'
const APP_NAME = 'HairMap'
const COMPANY = 'HairMap'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <div className="max-w-2xl mx-auto px-5 py-12">

        {/* Header */}
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 mb-8 hover:text-gray-600 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <p className="text-[10px] text-primary uppercase tracking-widest font-semibold mb-2">Legal</p>
          <h1 className="font-serif text-3xl text-gray-900 mb-3">Privacy Policy</h1>
          <p className="text-sm text-gray-400">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-8 text-sm text-gray-600 leading-relaxed">

          <div className="bg-primary/5 border border-primary/10 rounded-2xl px-5 py-4" style={{ borderWidth: '0.5px' }}>
            <p className="text-sm text-primary font-medium leading-relaxed">
              {APP_NAME} is a personal health tracking tool. We take your privacy seriously. This policy explains what data we collect, why we collect it, and how we protect it. We do not sell your data.
            </p>
          </div>

          <Section title="1. Who we are">
            <p>{COMPANY} operates the {APP_NAME} application available at hair-map.vercel.app. If you have questions about this policy, contact us at <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline underline-offset-2">{CONTACT_EMAIL}</a>.</p>
          </Section>

          <Section title="2. What data we collect">
            <p className="font-medium text-gray-800 mb-2">Account data</p>
            <p>When you create an account, we collect your name and email address. If you sign up with Google, we receive your name and email from Google — we do not receive your Google password.</p>

            <p className="font-medium text-gray-800 mb-2 mt-4">Health and tracking data</p>
            <p>To provide the service, we store the data you enter: your Norwood stage, treatment stack, daily dose logs, progress photos, reminder preferences, and any notes or side effects you record. This data is stored on Supabase (a secure cloud database hosted on AWS) and is accessible only to you.</p>

            <p className="font-medium text-gray-800 mb-2 mt-4">Usage data</p>
            <p>We collect basic usage information through Vercel (our hosting provider) including page views and error logs. This does not include personally identifiable information and is used solely for debugging and improving the service.</p>

            <p className="font-medium text-gray-800 mb-2 mt-4">Payment data</p>
            <p>Payments are processed by Paddle. We do not store your card number, CVV, or full payment details. Paddle shares only your email address and subscription status with us to activate your account.</p>
          </Section>

          <Section title="3. How we use your data">
            <ul className="list-none space-y-2">
              {[
                'To provide and operate the HairMap service',
                'To send treatment reminders you have configured',
                'To generate AI-powered progress analysis of your photos and logs',
                'To process your subscription and manage billing via Paddle',
                'To respond to support requests',
                'To improve the product (using aggregated, anonymised data only)',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4">We do not use your personal health data for advertising, profiling, or sale to third parties.</p>
          </Section>

          <Section title="4. AI analysis and your photos">
            <p>When you run an AI analysis, your progress photos and treatment data are sent to OpenRouter (an AI API aggregator) which routes them to OpenAI&apos;s GPT-4o model. This data is used solely to generate your analysis response and is not stored by OpenRouter or OpenAI beyond the duration of the API call, per their data processing terms.</p>
            <p className="mt-3">AI analysis results are stored in your {APP_NAME} account so you can refer back to them. You can delete your account at any time to remove all stored data.</p>
          </Section>

          <Section title="5. Data storage and security">
            <p>Your data is stored in Supabase (PostgreSQL on AWS). Your photos are stored in Supabase Storage. Both use encryption at rest and in transit (TLS). Row-level security policies ensure your data is accessible only to your account.</p>
            <p className="mt-3">We use Vercel for hosting, which provides DDoS protection and secure infrastructure. No system is 100% secure, but we take reasonable technical and organisational measures to protect your information.</p>
          </Section>

          <Section title="6. Third-party services">
            <p>We use the following third-party services, each with their own privacy policies:</p>
            <div className="mt-3 space-y-2">
              {[
                { name: 'Supabase', purpose: 'Database, authentication, and file storage' },
                { name: 'Vercel', purpose: 'Hosting and deployment infrastructure' },
                { name: 'Paddle', purpose: 'Payment processing and subscription management' },
                { name: 'OpenRouter / OpenAI', purpose: 'AI analysis of your progress data' },
                { name: 'Resend', purpose: 'Transactional email (reminders, account emails)' },
                { name: 'Upstash QStash', purpose: 'Scheduled reminder delivery' },
              ].map(s => (
                <div key={s.name} className="flex items-start gap-3">
                  <span className="font-medium text-gray-800 w-36 shrink-0">{s.name}</span>
                  <span className="text-gray-500">{s.purpose}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="7. Your rights">
            <p>You have the right to:</p>
            <ul className="list-none space-y-2 mt-3">
              {[
                'Access a copy of all data we hold about you',
                'Correct inaccurate data',
                'Delete your account and all associated data',
                'Export your tracking data',
                'Withdraw consent for AI analysis at any time',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4">To exercise any of these rights, email us at <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline underline-offset-2">{CONTACT_EMAIL}</a>. We will respond within 30 days.</p>
          </Section>

          <Section title="8. Data retention">
            <p>We retain your data for as long as your account is active. If you delete your account, we permanently delete your profile, treatment logs, photos, and analysis data within 30 days. Anonymised, aggregated usage statistics may be retained indefinitely.</p>
          </Section>

          <Section title="9. Children">
            <p>{APP_NAME} is not intended for use by anyone under the age of 18. We do not knowingly collect personal data from minors. If you believe a minor has created an account, contact us and we will delete it.</p>
          </Section>

          <Section title="10. Changes to this policy">
            <p>We may update this policy from time to time. We will notify you of material changes by email or by a prominent notice in the app. Continued use of {APP_NAME} after changes constitutes acceptance of the updated policy.</p>
          </Section>

          <Section title="11. Contact">
            <p>Questions or concerns about your privacy? Contact us at <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline underline-offset-2">{CONTACT_EMAIL}</a>.</p>
          </Section>

        </div>

        <div className="mt-12 pt-6 border-t border-gray-100 flex items-center justify-between" style={{ borderTopWidth: '0.5px' }}>
          <Link href="/terms" className="text-xs text-primary">Terms of Service →</Link>
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600">← Back to HairMap</Link>
        </div>

      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-lg text-gray-900 mb-3">{title}</h2>
      <div className="space-y-0">{children}</div>
    </div>
  )
}
