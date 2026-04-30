import type { Beacon } from '@/types/beacon'
import { distanceCategory, distanceCategoryLabel } from '@/lib/distance'

interface Props {
  beacon: Beacon
  onClose: () => void
}

export function BeaconDetailModal({ beacon, onClose }: Props) {
  const cat = distanceCategory(beacon.distance)
  const label = distanceCategoryLabel(cat)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50" onClick={onClose}>
      <div
        className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">{beacon.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">✕</button>
        </div>

        <div className="space-y-3">
          <Row label="UUID" value={beacon.uuid} mono />
          <Row label="Major" value={`${beacon.major} (0x${beacon.major.toString(16).toUpperCase().padStart(4, '0')})`} />
          <Row label="Minor" value={`${beacon.minor} (0x${beacon.minor.toString(16).toUpperCase().padStart(4, '0')})`} />
          <Row label="RSSI" value={`${beacon.rssi} dBm`} />
          <Row label="TX Power" value={`${beacon.txPower} dBm`} />
          <Row
            label="ระยะห่าง"
            value={beacon.distance < 0 ? 'ไม่ทราบ' : `${beacon.distance.toFixed(2)} ม. (${label})`}
          />
          <Row
            label="อัปเดตล่าสุด"
            value={new Date(beacon.lastSeen).toLocaleTimeString('th-TH')}
          />
        </div>
      </div>
    </div>
  )
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-start gap-4 py-2 border-b border-gray-100">
      <span className="text-sm text-gray-500 flex-shrink-0">{label}</span>
      <span className={`text-sm text-gray-800 text-right ${mono ? 'font-mono break-all' : 'font-medium'}`}>
        {value}
      </span>
    </div>
  )
}
