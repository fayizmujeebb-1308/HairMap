import Link from 'next/link'

const LAST_UPDATED = 'June 24, 2025'
const CONTACT_EMAIL = 'support@hair-map.com'
const APP_NAME = 'HairMap'
const COMPANY = 'HairMap'

export default function TermsPage() {
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
          <h1 className="font-serif text-3xl text-gray-900 mb-3">Terms of Service</h1>
          <p className="text-sm text-gray-400">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-8 text-sm text-gray-600 leading-relaxed">

          <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4" style={{ borderWidth: '0.5px' }}>
            <p className="text-sm text-amber-700 font-medium leading-relaxed">
              {APP_NAME} is a personal tracking tool, not a medical service. Nothing in this app — including AI analysis, articles, or progress data — constitutes medical advice. Always consult a qualified healthcare professional before making any decisions about your treatment.
            </p>
          </div>

          <Section title="1. Acceptance of terms">
            <p>By creating an account and using {APP_NAME}, you agree to these Terms of Service and our <Link href="/privacy" className="text-primary underline underline-offset-2">Privacy Policy</Link>. If you do not agree, please do not use the service. These terms form a binding agreement between you and {COMPANY}.</p>
          </Section>

          <Section title="2. What HairMap is — and is not">
            <p>{APP_NAME} is a personal health tracking application that helps you log treatments, track adherence, upload progress photos, and receive AI-generated observations about your data.</p>
            <p className="mt-3 font-medium text-gray-800">{APP_NAME} is not:</p>
            <ul className="list-none space-y-2 mt-2">
              {[
                'A medical device or clinical tool',
                'A substitute for professional medical advice, diagnosis, or treatment',
                'A licensed healthcare provider',
                'A pharmacy or treatment provider',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-red-400 shrink-0 mt-0.5">✕</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4">AI analysis provided by {APP_NAME} reflects observations based on your tracking data. It is not a clinical assessment. Always consult a dermatologist or qualified doctor for medical decisions.</p>
          </Section>

          <Section title="3. Eligibility">
            <p>You must be at least 18 years old to use {APP_NAME}. By using the service, you confirm that you are 18 or older and have the legal capacity to enter into this agreement.</p>
          </Section>

          <Section title="4. Your account">
            <p>You are responsible for maintaining the security of your account and password. {COMPANY} is not liable for any loss resulting from unauthorised access to your account. You agree to:</p>
            <ul className="list-none space-y-2 mt-3">
              {[
                'Provide accurate information when creating your account',
                'Keep your login credentials confidential',
                'Notify us immediately of any unauthorised use of your account',
                'Not share your account with others or create accounts on behalf of others',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="5. Subscriptions and billing">
            <p className="font-medium text-gray-800 mb-2">Free plan</p>
            <p>The free plan is available without charge and includes limited features. We reserve the right to modify the features included in the free plan at any time.</p>

            <p className="font-medium text-gray-800 mb-2 mt-4">Pro plan</p>
            <p>The Pro plan is available for $12/month (billed monthly) or $99/year (billed annually). A 7-day free trial is available for new subscribers. Your card will be charged on day 8 unless you cancel before then.</p>

            <p className="font-medium text-gray-800 mb-2 mt-4">Billing</p>
            <p>Payments are processed by Paddle. Subscriptions renew automatically at the end of each billing period. You may cancel at any time through your account settings — cancellation takes effect at the end of the current billing period and you retain access until then.</p>

            <p className="font-medium text-gray-800 mb-2 mt-4">Refunds</p>
            <p>We offer refunds within 14 days of your first charge if you are not satisfied with the service. Contact us at <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline underline-offset-2">{CONTACT_EMAIL}</a> to request a refund. Refunds are at our discretion after the 14-day window.</p>
          </Section>

          <Section title="6. Your content">
            <p>You retain full ownership of all content you upload to {APP_NAME} — including photos, treatment notes, and tracking data. By uploading content, you grant {COMPANY} a limited licence to store and process it solely for the purpose of providing the service to you.</p>
            <p className="mt-3">You agree not to upload content that is illegal, infringes third-party rights, or is misleading. We reserve the right to remove content that violates these terms.</p>
          </Section>

          <Section title="7. Acceptable use">
            <p>You agree not to:</p>
            <ul className="list-none space-y-2 mt-3">
              {[
                'Use the service for any unlawful purpose',
                'Attempt to gain unauthorised access to any part of the service or its infrastructure',
                'Reverse engineer, decompile, or disassemble any part of the application',
                'Use the service to store or transmit malicious code',
                'Scrape, crawl, or systematically extract data from the service',
                'Impersonate any person or entity',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-red-400 shrink-0 font-medium">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="8. Service availability">
            <p>We aim to keep {APP_NAME} available at all times but do not guarantee uninterrupted access. The service may be unavailable during maintenance, updates, or due to circumstances beyond our control. We are not liable for any loss arising from service downtime.</p>
          </Section>

          <Section title="9. Disclaimers">
            <p>The service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, express or implied. To the fullest extent permitted by law, {COMPANY} disclaims all warranties including implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
            <p className="mt-3">We do not warrant that AI-generated analysis is accurate, complete, or suitable for any purpose. Hair loss treatment outcomes vary significantly between individuals. {APP_NAME} does not guarantee any specific results.</p>
          </Section>

          <Section title="10. Limitation of liability">
            <p>To the maximum extent permitted by law, {COMPANY} shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service — including but not limited to health outcomes, treatment decisions, or data loss.</p>
            <p className="mt-3">Our total liability to you for any claim arising from these terms or your use of the service shall not exceed the amount you paid to us in the 12 months preceding the claim.</p>
          </Section>

          <Section title="11. Changes to the service">
            <p>We reserve the right to modify, suspend, or discontinue any part of {APP_NAME} at any time. We will give reasonable notice of material changes where possible. Continued use of the service after changes constitutes your acceptance of the updated terms.</p>
          </Section>

          <Section title="12. Termination">
            <p>You may delete your account at any time. We reserve the right to suspend or terminate your account for violation of these terms. On termination, your right to use the service ends immediately. Data deletion follows our Privacy Policy.</p>
          </Section>

          <Section title="13. Governing law">
            <p>These terms are governed by applicable law. Any disputes shall be resolved through good-faith negotiation in the first instance. If unresolved, disputes shall be subject to binding arbitration or the courts of the applicable jurisdiction.</p>
          </Section>

          <Section title="14. Contact">
            <p>Questions about these terms? Contact us at <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary underline underline-offset-2">{CONTACT_EMAIL}</a>.</p>
          </Section>

        </div>

        <div className="mt-12 pt-6 border-t border-gray-100 flex items-center justify-between" style={{ borderTopWidth: '0.5px' }}>
          <Link href="/privacy" className="text-xs text-primary">Privacy Policy →</Link>
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
