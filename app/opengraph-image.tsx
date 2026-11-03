import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'HairMap — Track & Restore Your Hair'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #d1fae5 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Logo */}
        <div style={{
          width: 80, height: 80, borderRadius: 20,
          background: 'linear-gradient(135deg, #1D9E75, #157a5a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 24,
          boxShadow: '0 16px 48px rgba(29,158,117,0.35)',
        }}>
          <span style={{ color: 'white', fontSize: 40, fontWeight: 800 }}>H</span>
        </div>

        <h1 style={{ fontSize: 64, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: -2 }}>
          HairMap
        </h1>
        <p style={{ fontSize: 28, color: '#6b7280', margin: '16px 0 0', fontWeight: 400 }}>
          Track, Preserve and Restore Your Hair
        </p>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: 32, marginTop: 48 }}>
          {[['AI Analysis', '📸'], ['Treatment Tracking', '💊'], ['Progress Monitoring', '📈']].map(([label, icon]) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(255,255,255,0.9)',
              borderRadius: 16, padding: '16px 24px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 24 }}>{icon}</span>
              <span style={{ fontSize: 18, color: '#374151', fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
