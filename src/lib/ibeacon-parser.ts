export interface IBeaconData {
  uuid: string
  major: number
  minor: number
  txPower: number
}

// manufacturerData จาก Web Bluetooth ตัด company ID (0x004C) ออกแล้ว
// layout: [type(2)][UUID(16)][Major(2)][Minor(2)][TXPower(1)] = 23 bytes
export function parseIBeacon(data: Uint8Array): IBeaconData | null {
  if (data.length < 23) return null
  if (data[0] !== 0x02 || data[1] !== 0x15) return null

  const uuid = bytesToUuid(data.slice(2, 18))
  const major = (data[18] << 8) | data[19]
  const minor = (data[20] << 8) | data[21]
  const txPower = data[22] > 127 ? data[22] - 256 : data[22]

  return { uuid, major, minor, txPower }
}

function bytesToUuid(b: Uint8Array): string {
  const hex = Array.from(b)
    .map((x) => x.toString(16).padStart(2, '0'))
    .join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}
