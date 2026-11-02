import Link from 'next/link'

const glassCard = {
  background: 'rgba(255,255,255,0.92)',
  backdropFilter: 'blur(20px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(20px) saturate(1.8)',
  border: '1px solid rgba(255,255,255,0.75)',
  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
  borderRadius: 24,
} as const

const FEATURES = [
  {
    icon: '👥',
    title: 'Patient management',
    desc: 'Manage up to 50 patient accounts from a single clinic dashboard. Invite patients by email — they get their own private HairMap account.',
  },
  {
    icon: '📊',
    title: 'Progress overview',
    desc: 'See all your patients’ recovery timelines side-by-side. Instantly spot who’s on track and who needs a follow-up.',
  },
  {
    icon: '📸',
    title: 'Photo documentation',
    desc: 'Every patient’s photos are stored securely with anonymous IDs. Generate visual progress reports for consultations with a single tap.',
  },
  {
    icon: '🤖',
    title: 'AI-assisted analysis',
    desc: 'On-demand AI hair density analysis for each patient — triggered only when you choose, never automatic. Supports your clinical judgment.',
  },
  {
    icon: '🎨',
    title: 'Your brand, not ours',
    desc: 'Add your clinic’s logo and brand colors. Patients see a co-branded experience that reinforces your practice’s professionalism.',
  },
  {
    icon: '🔒',
    title: 'HIPAA-ready',
    desc: 'Data stored with encryption at rest and in transit. Patient file paths use anonymous UUIDs — no names in storage paths.',
  },
]

const TESTIMONIALS = [
  {
    quote: 'Our patients love being able to track their recovery on their phone. It’s reduced our no-show rate for follow-ups significantly.',
    name: 'Dr. Ahmed R.',
    title: 'Hair Transplant Surgeon, Dubai',
  },
  {
    quote: 'The treatment adherence tracking alone is worth it. We can now actually verify if a patient was using minoxidil before blaming the graft.',
    name: 'Dr. Sarah K.',
    title: 'Dermatologist, London',
  },
  {
    quote: 'Setup took 20 minutes. We had all 30 of our post-op patients on the platform the same day.',
    name: 'Dr. Marco V.',
    title: 'Hair Restoration Specialist, Milan',
  },
]

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Create your clinic account',
    desc: 'Sign up and choose the Clinic plan. Set up your brand colors and logo — takes 5 minutes.',
  },
  {
    step: '2',
    title: 'Invite your patients',
    desc: 'Send patients a personalized invite link. They create their own HairMap account, connected to your clinic.',
  },
  {
    step: '3',
    title: 'Monitor recovery together',
    desc: 'Your clinic dashboard shows all patients’ progress. Patients track independently — you review when you choose.',
  },
]

export default function ClinicPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(160deg, #f0fdf4 0%, #f8fafb 50%, #ecfdf5 100%)' }}
    >
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3" fill="white" />
              <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.2" fill="none" opacity="0.5" />
            </svg>
          </div>
          <span className="font-serif text-gray-900 font-semibold">HairMap</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm font-semibold text-gray-500 hidden sm:block">
            Pricing
          </Link>
          <Link
            href="mailto:fayizmujeebb@gmail.com?subject=HairMap Clinic Plan"
            className="text-sm font-semibold px-4 py-2 rounded-xl text-white transition-opacity active:opacity-80"
            style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
          >
            Contact us
          </Link>
        </div>
      </nav>

      <div className="px-4 max-w-5xl mx-auto">

        {/* Hero */}
        <div className="text-center pt-12 pb-16">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold mb-6"
            style={{ background: 'rgba(16,185,129,0.10)', color: '#059669' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
            For Hair Transplant Clinics &amp; Dermatologists
          </div>

          <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-6 leading-tight max-w-2xl mx-auto">
            Give your patients a recovery tracker they&apos;ll actually use
          </h1>

          <p className="text-gray-500 text-base max-w-lg mx-auto leading-relaxed mb-10">
            HairMap Clinic gives your practice a branded post-transplant monitoring tool — without building anything. $49/month, up to 50 patients.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="mailto:fayizmujeebb@gmail.com?subject=HairMap Clinic Plan — Demo Request"
              className="px-8 py-4 rounded-2xl text-sm font-semibold text-white transition-opacity active:opacity-80"
              style={{
                background: 'linear-gradient(135deg, #059669, #10b981)',
                boxShadow: '0 8px 28px rgba(16,185,129,0.28)',
              }}
            >
              Request a demo
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 rounded-2xl text-sm font-semibold transition-opacity active:opacity-70"
              style={{
                background: 'rgba(255,255,255,0.80)',
                color: '#374151',
                border: '1px solid rgba(229,231,235,0.8)',
              }}
            >
              See pricing
            </Link>
          </div>
        </div>

        {/* Social proof strip */}
        <div
          className="flex items-center justify-center gap-8 py-4 px-6 rounded-2xl mb-16 flex-wrap"
          style={{ background: 'rgba(255,255,255,0.60)', border: '1px solid rgba(229,231,235,0.5)' }}
        >
          {[
            { value: '50+', label: 'Patients per clinic' },
            { value: '$49', label: 'Per month, flat' },
            { value: '5 min', label: 'Setup time' },
            { value: 'HIPAA', label: 'Ready' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="font-serif text-2xl text-gray-900">{s.value}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Features grid */}
        <div className="mb-16">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold text-center mb-8">
            Everything your clinic needs
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} style={{ ...glassCard, padding: '22px 20px' }}>
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl mb-4"
                  style={{ background: 'rgba(16,185,129,0.08)' }}
                >
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="mb-16">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold text-center mb-8">
            How it works
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((s, i) => (
              <div key={s.step} className="relative text-center">
                {/* Connector line */}
                {i < 2 && (
                  <div
                    className="absolute top-5 left-1/2 w-full h-px hidden md:block"
                    style={{ background: 'linear-gradient(90deg, #10b981, #d1fae5)' }}
                  />
                )}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white mx-auto mb-4 relative z-10"
                  style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
                >
                  {s.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold text-center mb-8">
            Trusted by clinics
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ ...glassCard, padding: '22px 20px' }}>
                <p className="text-xl text-primary mb-4">&ldquo;</p>
                <p className="text-sm text-gray-700 leading-relaxed mb-5">{t.quote}</p>
                <div>
                  <p className="text-xs font-semibold text-gray-900">{t.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{t.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing card */}
        <div
          className="rounded-3xl px-8 py-10 mb-16 text-center"
          style={{
            ...glassCard,
            border: '1.5px solid rgba(16,185,129,0.25)',
            boxShadow: '0 8px 40px rgba(16,185,129,0.12)',
          }}
        >
          <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-4">Clinic Plan</p>
          <div className="flex items-end justify-center gap-1 mb-2">
            <span className="font-serif text-5xl text-gray-900">$49</span>
            <span className="text-gray-400 text-sm mb-2">/month</span>
          </div>
          <p className="text-xs text-gray-400 mb-8">Per clinic · up to 50 patients · cancel anytime</p>

          <ul className="inline-block text-left space-y-2.5 mb-8">
            {[
              'Up to 50 patient accounts',
              'Clinic dashboard & overview',
              'Patient progress reporting',
              'AI-assisted analysis for all patients',
              'Custom branding (logo + colors)',
              'HIPAA-ready data handling',
              'Dedicated account manager',
              'Bulk patient onboarding',
            ].map(f => (
              <li key={f} className="flex items-center gap-2.5">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
                >
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4l1.5 1.5L6.5 2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-sm text-gray-700">{f}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="mailto:fayizmujeebb@gmail.com?subject=HairMap Clinic Plan"
              className="px-8 py-4 rounded-2xl text-sm font-semibold text-white"
              style={{
                background: 'linear-gradient(135deg, #059669, #10b981)',
                boxShadow: '0 8px 28px rgba(16,185,129,0.28)',
              }}
            >
              Get started — $49/mo
            </Link>
            <Link
              href="mailto:fayizmujeebb@gmail.com?subject=HairMap Clinic Plan — Demo Request"
              className="px-8 py-4 rounded-2xl text-sm font-semibold"
              style={{
                background: 'rgba(16,185,129,0.06)',
                color: '#059669',
                border: '1px solid rgba(16,185,129,0.20)',
              }}
            >
              Book a demo first
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-24">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold text-center mb-6">
            Questions
          </p>
          <div className="space-y-3 max-w-2xl mx-auto">
            {[
              {
                q: 'Do patients need their own subscription?',
                a: 'No. When a patient is added to your Clinic plan, they get full Pro-level access at no extra cost. Your $49/month covers all of them.',
              },
              {
                q: 'Can I try it before committing?',
                a: 'Yes — email us for a 14-day trial with up to 5 patients. No credit card required during the trial.',
              },
              {
                q: 'Is patient data kept separate from other clinics?',
                a: 'Completely. Each clinic\'s patient data is isolated. Your patients are visible only to you and to them.',
              },
              {
                q: 'What happens if I need more than 50 patients?',
                a: 'Contact us — we can accommodate larger practices. Enterprise pricing is available for clinics with 50+ active patients.',
              },
              {
                q: 'Is it HIPAA compliant?',
                a: 'HairMap is built with HIPAA-compatible practices: data encrypted at rest and in transit, anonymous file paths, and no PHI in logs. We can sign a BAA on request.',
              },
            ].map((item, i) => (
              <div key={i} style={{ ...glassCard, padding: '18px 20px', borderRadius: 16 }}>
                <p className="text-sm font-semibold text-gray-800 mb-2">{item.q}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer
        className="border-t py-8 px-6"
        style={{ borderColor: 'rgba(229,231,235,0.5)', background: 'rgba(255,255,255,0.40)' }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">© 2026 HairMap. Not medical advice.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Terms</Link>
            <Link href="/pricing" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Pricing</Link>
            <Link href="mailto:fayizmujeebb@gmail.com" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
