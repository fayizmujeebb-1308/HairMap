import type { CapacitorConfig } from '@capacitor/cli'
const config: CapacitorConfig = {
  appId: 'com.hairmap.app2',
  appName: 'HairMap',
  webDir: 'out',
  server: {
    url: 'https://hair-map.vercel.app',
    cleartext: false,
    androidScheme: 'https',
  },
  android: {
    backgroundColor: '#F4F3EF',
  },
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      backgroundColor: '#F4F3EF',
    },
  },
}
export default config
