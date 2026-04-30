export function BrowserNotSupported() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
      <div className="text-6xl mb-6">📵</div>
      <h1 className="text-2xl font-bold text-gray-800 mb-3">Browser ไม่รองรับ</h1>
      <p className="text-gray-600 mb-6 leading-relaxed max-w-sm">
        Browser นี้ไม่รองรับ Web Bluetooth<br />
        กรุณาใช้ <strong>Chrome</strong> หรือ <strong>Edge</strong> บน Android
      </p>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-sm w-full text-left">
        <p className="text-sm font-semibold text-blue-800 mb-2">Browser ที่รองรับ:</p>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>✅ Chrome Android (เวอร์ชัน 120+)</li>
          <li>✅ Edge Android</li>
          <li>❌ Safari / Firefox / Samsung Internet</li>
        </ul>
      </div>
    </div>
  )
}
