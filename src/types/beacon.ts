export type DistanceCategory = 'immediate' | 'near' | 'far' | 'edge'

export interface Beacon {
  id: string
  name: string
  rssi: number
  uuid: string
  major: number
  minor: number
  txPower: number
  distance: number
  lastSeen: number
}

export interface ScanError {
  message: string
  code: 'NOT_SUPPORTED' | 'NO_LE_SCAN' | 'PERMISSION_DENIED' | 'BLUETOOTH_OFF' | 'UNKNOWN'
}
