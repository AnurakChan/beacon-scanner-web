import { useState } from 'react'
import { useBeaconStore, sortedBeacons } from '@/store/beacon.store'
import { BeaconCard } from './BeaconCard'
import { BeaconDetailModal } from './BeaconDetailModal'
import type { Beacon } from '@/types/beacon'

export function BeaconList() {
  const beacons = useBeaconStore((s) => sortedBeacons(s.beacons))
  const scanning = useBeaconStore((s) => s.scanning)
  const [selected, setSelected] = useState<Beacon | null>(null)

  if (beacons.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
        <div className="text-5xl mb-4">📡</div>
        {scanning ? (
          <>
            <p className="font-medium text-gray-500">กำลังค้นหา DX-CP27...</p>
            <p className="text-sm mt-1">ลองเข้าใกล้ beacon หรือตรวจสอบแบตเตอรี่</p>
          </>
        ) : (
          <p className="font-medium text-gray-500">กดปุ่มเริ่มสแกนเพื่อค้นหา Beacon</p>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="px-4 pb-4 space-y-3">
        {beacons.map((beacon) => (
          <BeaconCard key={beacon.id} beacon={beacon} onClick={() => setSelected(beacon)} />
        ))}
      </div>

      {selected && (
        <BeaconDetailModal beacon={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}
