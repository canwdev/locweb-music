export const formatTimeHMS = (ms) => {
  const h = Math.round(ms / (60 * 60))
    .toString()
    .padStart(2, '0')
  const m = Math.round((ms / 60) % 60)
    .toString()
    .padStart(2, '0')
  const s = Math.round(ms % 60)
    .toString()
    .padStart(2, '0')
  return h + ':' + m + ':' + s
}
