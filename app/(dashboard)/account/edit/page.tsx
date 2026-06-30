import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { updateProfile } from '@/app/actions/profile'

const GENDERS    = ['Male', 'Female', 'Non-binary', 'Prefer not to say']
const ETHNICITIES = ['White', 'Black / African American', 'Hispanic / Latino', 'East Asian', 'South Asian', 'Middle Eastern', 'Mixed', 'Other']
const TREATMENTS = ['Finasteride', 'Minoxidil', 'Both', 'Dutasteride', 'None', 'Other']
const NORWOOD    = [1, 2, 3, 4, 5, 6, 7]

export default async function EditProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: p } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center gap-3 pt-2">
        <Link href="/account"
          className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center active:scale-95 transition-transform shrink-0">
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="font-serif text-2xl text-gray-900">Edit Profile</h1>
      </div>

      <form action={updateProfile} className="space-y-4">

        {/* Name */}
        <div className="bg-white rounded-2xl shadow-card px-5 py-5 space-y-4" >
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-gray-400 mb-1.5">First name</label>
              <input name="first_name" defaultValue={p?.first_name ?? ''} placeholder="First"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                style={{ borderWidth: '0.5px' }} />
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 mb-1.5">Last name</label>
              <input name="last_name" defaultValue={p?.last_name ?? ''} placeholder="Last"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                style={{ borderWidth: '0.5px' }} />
            </div>
          </div>
        </div>

        {/* Demographics */}
        <div className="bg-white rounded-2xl shadow-card px-5 py-5 space-y-4" >
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Demographics</p>

          <div>
            <label className="block text-[10px] text-gray-400 mb-1.5">Gender</label>
            <div className="grid grid-cols-2 gap-2">
              {GENDERS.map(g => (
                <label key={g} className="flex items-center gap-2 px-3 py-2.5 shadow-card rounded-xl cursor-pointer has-[:checked]:border-primary/20 has-[:checked]:bg-primary/5 transition-colors" >
                  <input type="radio" name="gender" value={g} defaultChecked={p?.gender === g} className="accent-primary w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs font-medium text-gray-700">{g}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-gray-400 mb-1.5">Country</label>
            <input name="country" defaultValue={p?.country ?? ''} placeholder="e.g. United States"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              style={{ borderWidth: '0.5px' }} />
          </div>

          <div>
            <label className="block text-[10px] text-gray-400 mb-1.5">Ethnicity</label>
            <select name="ethnicity" defaultValue={p?.ethnicity ?? ''}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              style={{ borderWidth: '0.5px' }}>
              <option value="">Select…</option>
              {ETHNICITIES.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>

        {/* Hair profile */}
        <div className="bg-white rounded-2xl shadow-card px-5 py-5 space-y-4" >
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Hair Profile</p>

          <div>
            <label className="block text-[10px] text-gray-400 mb-1.5">Norwood Stage</label>
            <div className="flex gap-2">
              {NORWOOD.map(n => (
                <label key={n} className="flex-1 flex flex-col items-center gap-1 cursor-pointer">
                  <input type="radio" name="norwood_stage" value={n} defaultChecked={p?.norwood_stage === n} className="sr-only" />
                  <div className={`w-full py-2 rounded-xl border text-xs font-semibold text-center transition-all
                    ${p?.norwood_stage === n ? 'bg-primary text-white border-primary' : 'bg-gray-50 text-gray-500 border-gray-100'}`}
                    style={{ borderWidth: '0.5px' }}>
                    {n}
                  </div>
                </label>
              ))}
            </div>
            <p className="text-[10px] text-gray-300 mt-1.5">NW1 = minimal loss · NW7 = advanced</p>
          </div>

          <div>
            <label className="block text-[10px] text-gray-400 mb-1.5">Primary treatment</label>
            <div className="grid grid-cols-2 gap-2">
              {TREATMENTS.map(t => (
                <label key={t} className="flex items-center gap-2 px-3 py-2.5 shadow-card rounded-xl cursor-pointer has-[:checked]:border-primary/20 has-[:checked]:bg-primary/5 transition-colors" >
                  <input type="radio" name="treatment_status" value={t} defaultChecked={p?.treatment_status === t} className="accent-primary w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs font-medium text-gray-700">{t}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button type="submit"
          className="w-full bg-primary text-white text-sm font-semibold py-3.5 rounded-2xl active:scale-95 transition-transform">
          Save changes
        </button>

      </form>
    </div>
  )
}
