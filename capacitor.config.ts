import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.hairmap.app',
  appName: 'HairMap',
  webDir: 'out',
  server: {
    url: 'https://hair-map-fayizmujeebb-1308-fayiz-s-projects.vercel.app',
    cleartext: false,
    androidScheme: 'https',
  },
  android: {
    backgroundColor: '#F4F3EF',
  },
}

export default config
