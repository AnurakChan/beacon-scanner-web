import { useState } from 'react'

interface Props {
  onDismiss: () => void
}

const FLAG_URL = 'chrome://flags/#enable-experimental-web-platform-features'

const steps = [
  'เปิด tab ใหม่ใน Chrome',
  'พิมพ์ chrome://flags ในแถบ URL',
  'ค้นหา "Experimental Web Platform features"',
  'เลือก "Enabled"',
  'กด "Relaunch" เพื่อรีสตาร์ท Chrome',
]

export function OnboardingModal({ onDismiss }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(FLAG_URL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard ไม่พร้อม — ปล่อยผ่าน
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white px-4 py-4 text-center">
        <div className="text-3xl mb-1">⚙️</div>
        <h1 className="text-xl font-bold">ตั้งค่าก่อนใช้งาน</h1>
      </div>

      <div className="flex-1 p-5 max-w-md mx-auto w-full">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-amber-800 font-medium">
            Chrome ต้องเปิด experimental feature เพื่อสแกน Bluetooth Beacon
          </p>
        </div>

        <h2 className="font-bold text-gray-800 mb-4">ขั้นตอนการตั้งค่า:</h2>
        <ol className="space-y-3 mb-6">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span className="text-gray-700 pt-0.5">{step}</span>
            </li>
          ))}
        </ol>

        <div className="bg-gray-100 rounded-xl p-3 mb-6">
          <p className="text-xs text-gray-500 mb-2">URL สำหรับตั้งค่า:</p>
          <p className="text-sm font-mono text-blue-700 break-all">
            chrome://flags/
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-xl mb-3 transition-colors flex items-center justify-center gap-2"
        >
          {copied ? '✅ คัดลอกแล้ว!' : '📋 คัดลอก URL flags'}
        </button>

        <button
          onClick={onDismiss}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl transition-colors text-lg"
        >
          ✓ ตั้งค่าเรียบร้อยแล้ว
        </button>
      </div>
    </div>
  )
}
