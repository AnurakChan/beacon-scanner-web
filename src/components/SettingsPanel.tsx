import { useState, useEffect } from 'react'

interface Props {
  onClose: () => void
}

const PATH_LOSS_KEY = 'bcn_path_loss'
const UUID_FILTER_KEY = 'bcn_uuid_filter'

export type PathLossPreset = 'open' | 'indoor' | 'industrial' | 'custom'

const presets: Record<PathLossPreset, number> = {
  open: 2.0,
  indoor: 2.7,
  industrial: 3.5,
  custom: 2.5,
}

const presetLabels: Record<PathLossPreset, string> = {
  open: 'กลางแจ้ง (2.0)',
  indoor: 'ในอาคาร (2.7)',
  industrial: 'โรงงาน (3.5)',
  custom: 'กำหนดเอง',
}

export function getPathLossN(): number {
  try {
    const v = localStorage.getItem(PATH_LOSS_KEY)
    if (v) return parseFloat(v)
  } catch { /* empty */ }
  return 2.5
}

export function getUuidFilter(): string {
  return localStorage.getItem(UUID_FILTER_KEY) ?? ''
}

export function SettingsPanel({ onClose }: Props) {
  const [preset, setPreset] = useState<PathLossPreset>('indoor')
  const [customN, setCustomN] = useState('2.5')
  const [uuidFilter, setUuidFilter] = useState('')

  useEffect(() => {
    setUuidFilter(getUuidFilter())
    const n = getPathLossN()
    const found = (Object.entries(presets) as [PathLossPreset, number][]).find(
      ([k, v]) => k !== 'custom' && Math.abs(v - n) < 0.01,
    )
    if (found) {
      setPreset(found[0])
    } else {
      setPreset('custom')
      setCustomN(String(n))
    }
  }, [])

  const handleSave = () => {
    const n = preset === 'custom' ? parseFloat(customN) || 2.5 : presets[preset]
    localStorage.setItem(PATH_LOSS_KEY, String(n))
    localStorage.setItem(UUID_FILTER_KEY, uuidFilter.trim())
    onClose()
  }

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
      <div className="max-w-lg mx-auto">
        <h2 className="font-bold text-gray-800 mb-4">⚙️ ตั้งค่า</h2>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            สภาพแวดล้อม (Path Loss Exponent n)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(presets) as PathLossPreset[]).map((k) => (
              <button
                key={k}
                onClick={() => setPreset(k)}
                className={`py-2 px-3 rounded-xl text-sm font-medium border transition-colors
                  ${preset === k
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                  }`}
              >
                {presetLabels[k]}
              </button>
            ))}
          </div>
          {preset === 'custom' && (
            <input
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={customN}
              onChange={(e) => setCustomN(e.target.value)}
              className="mt-2 w-full border border-gray-200 rounded-xl px-3 py-2 text-sm"
              placeholder="ค่า n (1.0 – 5.0)"
            />
          )}
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            กรอง UUID (ว่าง = แสดงทั้งหมด)
          </label>
          <input
            type="text"
            value={uuidFilter}
            onChange={(e) => setUuidFilter(e.target.value)}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium"
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  )
}
