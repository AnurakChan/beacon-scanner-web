interface Props {
  scanning: boolean
  disabled?: boolean
  onStart: () => void
  onStop: () => void
}

export function ScanButton({ scanning, disabled, onStart, onStop }: Props) {
  return (
    <button
      onClick={scanning ? onStop : onStart}
      disabled={disabled}
      className={`
        w-full py-4 px-6 rounded-2xl text-white text-lg font-bold
        transition-all active:scale-95 select-none
        ${disabled
          ? 'bg-gray-300 cursor-not-allowed'
          : scanning
            ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200'
            : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
        }
      `}
    >
      {disabled ? (
        '⚠️ ไม่รองรับการสแกน'
      ) : scanning ? (
        <span className="flex items-center justify-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-white animate-pulse" />
          หยุดสแกน
        </span>
      ) : (
        '📡 เริ่มสแกน'
      )}
    </button>
  )
}
