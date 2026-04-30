import { useBeaconStore } from '@/store/beacon.store'

export function StatusBar() {
  const scanning = useBeaconStore((s) => s.scanning)
  const count = useBeaconStore((s) => s.beacons.size)
  const error = useBeaconStore((s) => s.error)

  return (
    <div className={`rounded-xl px-4 py-3 flex items-center justify-between text-sm font-medium
      ${error ? 'bg-red-50 text-red-700' : scanning ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
    >
      <span>
        {error
          ? `⚠️ ${error}`
          : scanning
            ? '🔵 กำลังสแกน...'
            : '⚪ หยุดสแกนแล้ว'}
      </span>
      {count > 0 && (
        <span className="bg-white rounded-full px-2 py-0.5 text-xs font-bold shadow-sm">
          พบ {count} เครื่อง
        </span>
      )}
    </div>
  )
}
