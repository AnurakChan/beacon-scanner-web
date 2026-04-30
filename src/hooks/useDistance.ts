import { distanceCategory, distanceCategoryLabel } from '@/lib/distance'
import type { Beacon, DistanceCategory } from '@/types/beacon'

interface DistanceInfo {
  distance: number
  category: DistanceCategory
  label: string
  displayText: string
}

export function useDistance(beacon: Beacon): DistanceInfo {
  const cat = distanceCategory(beacon.distance)
  const label = distanceCategoryLabel(cat)
  const displayText = beacon.distance < 0 ? 'ไม่ทราบระยะ' : `${beacon.distance.toFixed(1)} ม.`
  return { distance: beacon.distance, category: cat, label, displayText }
}
