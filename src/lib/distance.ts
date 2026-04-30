import type { DistanceCategory } from '@/types/beacon'

export function calculateDistance(
  rssi: number,
  txPower: number,
  pathLossExponent = 2.5,
): number {
  if (rssi >= 0 || rssi === 127) return -1
  const ratio = (txPower - rssi) / (10 * pathLossExponent)
  return Math.pow(10, ratio)
}

export function distanceCategory(d: number): DistanceCategory {
  if (d < 0) return 'edge'
  if (d < 3) return 'immediate'
  if (d < 10) return 'near'
  if (d < 30) return 'far'
  return 'edge'
}

export function distanceCategoryLabel(cat: DistanceCategory): string {
  const labels: Record<DistanceCategory, string> = {
    immediate: 'ใกล้มาก',
    near: 'ใกล้',
    far: 'ไกล',
    edge: 'ขอบเขต',
  }
  return labels[cat]
}
