import { useBeaconStore, sortedBeacons } from '@/store/beacon.store'

export function ExportButton() {
  const beacons = useBeaconStore((s) => sortedBeacons(s.beacons))

  if (beacons.length === 0) return null

  const handleExport = () => {
    const header = 'name,uuid,major,minor,rssi,distance_m,lastSeen\n'
    const rows = beacons
      .map((b) =>
        [
          b.name,
          b.uuid,
          b.major,
          b.minor,
          b.rssi,
          b.distance < 0 ? '' : b.distance.toFixed(2),
          new Date(b.lastSeen).toISOString(),
        ].join(','),
      )
      .join('\n')

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const now = new Date()
    const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}`
    a.href = url
    a.download = `beacon-scan-${ts}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      className="text-white/80 hover:text-white text-sm flex items-center gap-1 transition-colors"
      title="Export CSV"
    >
      ⬇️ CSV
    </button>
  )
}
