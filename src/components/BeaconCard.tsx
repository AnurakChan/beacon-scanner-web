import type { Beacon, DistanceCategory } from '@/types/beacon'
import { distanceCategory } from '@/lib/distance'
import { useDistance } from '@/hooks/useDistance'

interface Props {
  beacon: Beacon
  onClick?: () => void
}

const categoryColors: Record<DistanceCategory, string> = {
  immediate: 'bg-green-500',
  near: 'bg-yellow-400',
  far: 'bg-orange-400',
  edge: 'bg-red-500',
}

const categoryBorders: Record<DistanceCategory, string> = {
  immediate: 'border-green-200',
  near: 'border-yellow-200',
  far: 'border-orange-200',
  edge: 'border-red-200',
}

export function BeaconCard({ beacon, onClick }: Props) {
  const { displayText } = useDistance(beacon)
  const cat = distanceCategory(beacon.distance)

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border-2 ${categoryBorders[cat]} p-4 shadow-sm active:scale-[0.98] transition-transform cursor-pointer`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full flex-shrink-0 ${categoryColors[cat]}`} />
          <span className="font-bold text-gray-900 text-lg">{beacon.name}</span>
        </div>
        <span className={`text-base font-bold ${cat === 'immediate' ? 'text-green-600' : cat === 'near' ? 'text-yellow-600' : cat === 'far' ? 'text-orange-600' : 'text-red-600'}`}>
          {displayText}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 text-sm text-gray-500">
        <span>Major: <span className="text-gray-700 font-medium">{beacon.major}</span></span>
        <span>Minor: <span className="text-gray-700 font-medium">{beacon.minor}</span></span>
        <span>RSSI: <span className="text-gray-700 font-medium">{beacon.rssi} dBm</span></span>
        <span>TX: <span className="text-gray-700 font-medium">{beacon.txPower} dBm</span></span>
      </div>
      {beacon.uuid && (
        <p className="text-xs text-gray-400 mt-2 font-mono truncate">{beacon.uuid}</p>
      )}
    </div>
  )
}
