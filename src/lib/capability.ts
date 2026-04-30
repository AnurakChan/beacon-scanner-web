export interface BrowserCapability {
  bluetooth: boolean
  leScan: boolean
  reason?: string
}

export function checkBrowserSupport(): BrowserCapability {
  if (!('bluetooth' in navigator)) {
    return {
      bluetooth: false,
      leScan: false,
      reason: 'Browser ไม่รองรับ Web Bluetooth',
    }
  }
  if (typeof (navigator.bluetooth as unknown as Record<string, unknown>)['requestLEScan'] !== 'function') {
    return {
      bluetooth: true,
      leScan: false,
      reason: 'requestLEScan ไม่พร้อมใช้งาน — กรุณาเปิด chrome://flags/#enable-experimental-web-platform-features',
    }
  }
  return { bluetooth: true, leScan: true }
}
