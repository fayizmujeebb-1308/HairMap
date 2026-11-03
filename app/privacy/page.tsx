import Link from 'next/link'

const glassCard = {
  background: 'var(--bg-card)',
  backdropFilter: 'blur(20px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
  border: '1px solid var(--bg-card-border)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  borderRadius: 24,
} as const

const LAST_UPDATED = 'November 2, 2026'

export default function PrivacyPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: 'var(--bg-page)' }}
    >
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3" fill="white" />
              <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.2" fill="none" opacity="0.5" />
            </svg>
          </div>
          <span className="font-serif text-gray-900 font-semibold">HairMap</span>
        </Link>
        <Link href="/terms" className="text-sm font-semibold" style={{ color: 'var(--color-primary-dark)' }}>
          Terms of Service
        </Link>
      </nav>

      <div className="px-4 pb-24 max-w-3xl mx-auto">

        {/* Header */}
        <div className="pt-8 pb-10">
          <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="font-serif text-4xl text-gray-900 mb-4 leading-tight">Privacy Policy</h1>
          <p className="text-sm text-gray-400">Last updated: {LAST_UPDATED}</p>
        </div>

        {/* Medical disclaimer banner */}
        <div
          className="flex gap-3 rounded-2xl px-5 py-4 mb-8"
          style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)' }}
        >
          <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-700 mb-1">Medical Disclaimer</p>
            <p className="text-xs text-amber-600 leading-relaxed">
              HairMap is a personal health tracking tool, not a medical device. Content, AI analysis, and educational articles are for informational purposes only and do not constitute medical advice, diagnosis, or treatment. Always consult a qualified dermatologist or licensed healthcare professional before starting, stopping, or changing any treatment protocol.
            </p>
          </div>
        </div>

        {/* Content */}
        <div style={{ ...glassCard, padding: '32px 28px' }} className="space-y-10">

          <Section title="1. Who we are">
            <p>HairMap (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is a personal hair health tracking application operated by its founder. Our app is available at hair-map.vercel.app and through our mobile progressive web app.</p>
            <p>For privacy questions, contact us at: <a href="mailto:fayizmujeebb@gmail.com" className="text-primary underline">fayizmujeebb@gmail.com</a></p>
          </Section>

          <Section title="2. What data we collect">
            <p>We collect only what is necessary to provide the service:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Account information:</strong> Email address and authentication credentials when you create an account.</li>
              <li><strong>Profile data:</strong> Norwood stage, treatment start date, and other hair health information you choose to provide.</li>
              <li><strong>Progress photos:</strong> Images you upload for tracking. Photos are stored using anonymous UUIDs in file paths — your name never appears in a file path.</li>
              <li><strong>Treatment logs:</strong> Records of when you log your treatments, including timestamps.</li>
              <li><strong>Usage data:</strong> Basic analytics about how you use the app (pages visited, features used) to help us improve the product.</li>
              <li><strong>Payment information:</strong> We use Paddle as our payment processor. We do not store your card details — Paddle handles all payment data directly.</li>
            </ul>
          </Section>

          <Section title="3. How we use your data">
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide, maintain, and improve HairMap&apos;s features.</li>
              <li>To generate AI hair analysis when you explicitly request it.</li>
              <li>To send account-related notifications (streak reminders, important updates).</li>
              <li>To process payments and manage your subscription.</li>
              <li>To respond to your support requests.</li>
            </ul>
            <p>We do not sell your personal data to third parties. We do not use your health data to train AI models without your explicit consent.</p>
          </Section>

          <Section title="4. AI analysis">
            <p>When you tap &quot;Analyse my hair,&quot; your most recent photo is sent to our AI provider (via OpenRouter) for analysis. This analysis runs on our server — your photo is never sent directly from your device to an AI service.</p>
            <p>AI analysis results are stored in your account so you can reference them later. You can delete your photos and analysis history at any time from your account settings.</p>
            <p><strong>Important:</strong> AI analysis is not a medical diagnosis. Results are for informational purposes only.</p>
          </Section>

          <Section title="5. Photos and health data">
            <p>Your progress photos are stored securely using anonymous identifiers. File paths use your account UUID and photo UUID — never your name, email, or any other identifying information.</p>
            <p>Access to your photos is strictly limited to you and the HairMap service. If you are on a Clinic plan, your assigned clinician may view your progress with your explicit consent.</p>
            <p>You may delete any or all of your photos at any time. Deleted photos are permanently removed from our systems within 30 days.</p>
          </Section>

          <Section title="6. Data retention">
            <p>We retain your data for as long as your account is active. If you delete your account:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Your personal data and photos are deleted within 30 days.</li>
              <li>Anonymized, aggregated usage statistics (with no personal identifiers) may be retained for analytics.</li>
              <li>Payment records are retained for the period required by law.</li>
            </ul>
          </Section>

          <Section title="7. Third-party services">
            <p>We use the following third-party services:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Supabase:</strong> Database and authentication. Data is stored in the US. <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">Supabase Privacy Policy</a></li>
              <li><strong>Vercel:</strong> Hosting and serverless functions. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary underline">Vercel Privacy Policy</a></li>
              <li><strong>Paddle:</strong> Payment processing. We never receive your full card details. <a href="https://www.paddle.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">Paddle Privacy Policy</a></li>
              <li><strong>OpenRouter:</strong> AI model access for hair analysis. Photos sent for analysis are not retained by OpenRouter beyond the API call. <a href="https://openrouter.ai/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline">OpenRouter Privacy Policy</a></li>
            </ul>
          </Section>

          <Section title="8. Your rights">
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Access:</strong> Request a copy of all personal data we hold about you.</li>
              <li><strong>Correction:</strong> Ask us to correct inaccurate data.</li>
              <li><strong>Deletion:</strong> Request deletion of your account and all associated data.</li>
              <li><strong>Export:</strong> Download all your data in a portable format (available in Pro plan).</li>
              <li><strong>Opt-out:</strong> Unsubscribe from non-essential communications at any time.</li>
            </ul>
            <p>To exercise any of these rights, contact us at <a href="mailto:fayizmujeebb@gmail.com" className="text-primary underline">fayizmujeebb@gmail.com</a>. We will respond within 30 days.</p>
          </Section>

          <Section title="9. Cookies and tracking">
            <p>We use minimal cookies necessary for authentication and session management. We do not use advertising cookies or cross-site tracking.</p>
            <p>We use privacy-respecting analytics that do not fingerprint individual users or sell data to advertisers.</p>
          </Section>

          <Section title="10. Children's privacy">
            <p>HairMap is not intended for use by individuals under the age of 18. We do not knowingly collect personal data from children. If you believe a child has created an account, contact us and we will delete it promptly.</p>
          </Section>

          <Section title="11. Changes to this policy">
            <p>We may update this privacy policy from time to time. When we do, we will update the &quot;Last updated&quot; date at the top of this page and notify you via email if the changes are material.</p>
            <p>Your continued use of HairMap after changes become effective constitutes your acceptance of the updated policy.</p>
          </Section>

          <Section title="12. Contact">
            <p>Questions or concerns about your privacy? We&apos;re here to help.</p>
            <p>Email: <a href="mailto:fayizmujeebb@gmail.com" className="text-primary underline">fayizmujeebb@gmail.com</a></p>
            <p>We aim to respond to all privacy requests within 5 business days.</p>
          </Section>

        </div>

        {/* Footer links */}
        <div className="flex gap-4 justify-center mt-10">
          <Link href="/terms" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Terms of Service</Link>
          <span className="text-gray-200">·</span>
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Back to HairMap</Link>
        </div>

      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="font-serif text-xl text-gray-900">{title}</h2>
      <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
        {children}
      </div>
    </div>
  )
}
