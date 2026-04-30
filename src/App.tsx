import { useEffect, useState } from 'react'
import { checkBrowserSupport } from '@/lib/capability'
import { useBeaconStore } from '@/store/beacon.store'
import { useBleScan } from '@/hooks/useBleScan'
import { BrowserNotSupported } from '@/components/BrowserNotSupported'
import { OnboardingModal } from '@/components/OnboardingModal'
import { StatusBar } from '@/components/StatusBar'
import { ScanButton } from '@/components/ScanButton'
import { BeaconList } from '@/components/BeaconList'
import { SettingsPanel } from '@/components/SettingsPanel'
import { ExportButton } from '@/components/ExportButton'

type Screen = 'not-supported' | 'onboarding' | 'main'

const ONBOARDING_KEY = 'bcn_onboarding_done'

export default function App() {
  const [screen, setScreen] = useState<Screen>('main')
  const [showSettings, setShowSettings] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const scanning = useBeaconStore((s) => s.scanning)
  const error = useBeaconStore((s) => s.error)
  const setError = useBeaconStore((s) => s.setError)
  const { start, stop } = useBleScan()

  useEffect(() => {
    const up = () => setIsOnline(true)
    const down = () => setIsOnline(false)
    window.addEventListener('online', up)
    window.addEventListener('offline', down)
    return () => { window.removeEventListener('online', up); window.removeEventListener('offline', down) }
  }, [])

  useEffect(() => {
    const cap = checkBrowserSupport()
    if (!cap.bluetooth) {
      setScreen('not-supported')
    } else if (!cap.leScan) {
      const done = localStorage.getItem(ONBOARDING_KEY)
      if (!done) setScreen('onboarding')
    }
  }, [])

  const handleOnboardingDismiss = () => {
    localStorage.setItem(ONBOARDING_KEY, '1')
    setScreen('main')
  }

  if (screen === 'not-supported') return <BrowserNotSupported />
  if (screen === 'onboarding') return <OnboardingModal onDismiss={handleOnboardingDismiss} />

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-blue-600 text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-xl">📡</span>
          <h1 className="text-lg font-bold">DX-CP27 Scanner</h1>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton />
          <button
            onClick={() => setShowSettings((v) => !v)}
            className="text-white/80 hover:text-white p-1 rounded-lg transition-colors"
            aria-label="Settings"
          >
            ⚙️
          </button>
        </div>
      </header>

      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}

      {error && (
        <div className="bg-red-100 border-b border-red-200 px-4 py-2 flex items-center justify-between">
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 ml-2 font-bold">✕</button>
        </div>
      )}

      <main className="flex-1 flex flex-col p-4 gap-3 max-w-lg mx-auto w-full">
        <StatusBar />
        {!isOnline && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 text-sm text-amber-700 text-center">
            ⚠️ ไม่มีการเชื่อมต่ออินเทอร์เน็ต (สแกน Bluetooth ยังทำงานได้)
          </div>
        )}
        <ScanButton scanning={scanning} onStart={start} onStop={stop} />
        <BeaconList />
      </main>
    </div>
  )
}
