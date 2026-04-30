import { create } from 'zustand'
import type { Beacon } from '@/types/beacon'

interface BeaconStore {
  beacons: Map<string, Beacon>
  scanning: boolean
  error: string | null
  upsertBeacon: (beacon: Beacon) => void
  removeStaleBeacons: (threshold: number) => void
  setScanning: (value: boolean) => void
  setError: (message: string | null) => void
  clearBeacons: () => void
}

export const useBeaconStore = create<BeaconStore>((set) => ({
  beacons: new Map(),
  scanning: false,
  error: null,

  upsertBeacon: (beacon) =>
    set((state) => {
      const next = new Map(state.beacons)
      next.set(beacon.id, beacon)
      return { beacons: next }
    }),

  removeStaleBeacons: (threshold) =>
    set((state) => {
      const now = Date.now()
      const next = new Map(state.beacons)
      for (const [id, b] of next) {
        if (now - b.lastSeen > threshold) next.delete(id)
      }
      return { beacons: next }
    }),

  setScanning: (value) => set({ scanning: value }),
  setError: (message) => set({ error: message }),
  clearBeacons: () => set({ beacons: new Map() }),
}))

export function sortedBeacons(beacons: Map<string, Beacon>): Beacon[] {
  return Array.from(beacons.values()).sort((a, b) => {
    if (a.distance < 0) return 1
    if (b.distance < 0) return -1
    return a.distance - b.distance
  })
}
