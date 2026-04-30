import { useCallback, useEffect, useRef } from 'react'
import { parseIBeacon } from '@/lib/ibeacon-parser'
import { calculateDistance } from '@/lib/distance'
import { MovingAverage } from '@/lib/rssi-filter'
import { useBeaconStore } from '@/store/beacon.store'
import { getPathLossN, getUuidFilter } from '@/components/SettingsPanel'

type BluetoothLEScan = { stop: () => void }

type BtExtended = {
  requestLEScan: (opts: object) => Promise<BluetoothLEScan>
  addEventListener: (type: string, handler: (e: Event) => void) => void
  removeEventListener: (type: string, handler: (e: Event) => void) => void
}

function bt(): BtExtended {
  return (navigator as unknown as { bluetooth: BtExtended }).bluetooth
}

const rssiFilters = new Map<string, MovingAverage>()

function getFilter(id: string): MovingAverage {
  if (!rssiFilters.has(id)) rssiFilters.set(id, new MovingAverage(5))
  return rssiFilters.get(id)!
}

export function useBleScan() {
  const { setScanning, setError, upsertBeacon, removeStaleBeacons } = useBeaconStore()
  const scanRef = useRef<BluetoothLEScan | null>(null)
  const handlerRef = useRef<((e: Event) => void) | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const visibilityRef = useRef<(() => void) | null>(null)

  const stopInternal = useCallback(() => {
    scanRef.current?.stop()
    scanRef.current = null
    if (handlerRef.current) {
      bt().removeEventListener('advertisementreceived', handlerRef.current)
      handlerRef.current = null
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (visibilityRef.current) {
      document.removeEventListener('visibilitychange', visibilityRef.current)
      visibilityRef.current = null
    }
    rssiFilters.clear()
    setScanning(false)
  }, [setScanning])

  const startScan = useCallback(async () => {
    try {
      setError(null)
      const pathLossN = getPathLossN()
      const uuidFilter = getUuidFilter().toLowerCase().trim()
      const scan = await bt().requestLEScan({
        filters: [{ namePrefix: 'CP27' }],
        keepRepeatedDevices: true,
      })
      scanRef.current = scan

      const handler = (event: Event) => {
        const e = event as unknown as {
          device: { id: string; name?: string }
          rssi: number
          manufacturerData: Map<number, { buffer: ArrayBuffer }>
        }

        const rssi = e.rssi
        if (rssi >= 0 || rssi === 127) return

        const appleData = e.manufacturerData.get(0x004c)
        if (!appleData) return

        const ibeacon = parseIBeacon(new Uint8Array(appleData.buffer))
        if (!ibeacon) return

        if (uuidFilter && ibeacon.uuid.toLowerCase() !== uuidFilter) return

        const smoothedRssi = getFilter(e.device.id).push(rssi)
        const distance = calculateDistance(smoothedRssi, ibeacon.txPower, pathLossN)

        upsertBeacon({
          id: e.device.id,
          name: e.device.name ?? 'Unknown',
          rssi,
          uuid: ibeacon.uuid,
          major: ibeacon.major,
          minor: ibeacon.minor,
          txPower: ibeacon.txPower,
          distance,
          lastSeen: Date.now(),
        })
      }

      handlerRef.current = handler
      bt().addEventListener('advertisementreceived', handler)

      intervalRef.current = setInterval(() => {
        removeStaleBeacons(5000)
      }, 1000)

      const onVisibility = () => {
        if (document.hidden) {
          scanRef.current?.stop()
        } else {
          bt()
            .requestLEScan({ filters: [{ namePrefix: 'CP27' }], keepRepeatedDevices: true })
            .then((newScan) => {
              scanRef.current = newScan
            })
            .catch(() => { /* resume ไม่ได้ — ปล่อยผ่าน */ })
        }
      }
      visibilityRef.current = onVisibility
      document.addEventListener('visibilitychange', onVisibility)

      setScanning(true)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'เกิดข้อผิดพลาดในการสแกน'
      if (msg.toLowerCase().includes('denied') || msg.toLowerCase().includes('notallowed')) {
        setError('ต้องอนุญาต Bluetooth เพื่อสแกน — แตะปุ่มอีกครั้งเพื่อลอง')
      } else if (msg.toLowerCase().includes('adapter') || msg.toLowerCase().includes('powered')) {
        setError('กรุณาเปิด Bluetooth ในมือถือก่อน')
      } else {
        setError(msg)
      }
    }
  }, [setError, setScanning, upsertBeacon, removeStaleBeacons])

  const stop = useCallback(() => {
    stopInternal()
  }, [stopInternal])

  useEffect(() => {
    return () => {
      stopInternal()
    }
  }, [stopInternal])

  return { start: startScan, stop }
}
