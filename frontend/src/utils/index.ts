export const formatTimeMS = (ms: number): string => {
  ms = Math.floor(ms)
  const minute = Math.floor(ms / 60)
  const second = (ms % 60).toString().padStart(2, '0')
  return minute + ':' + second
}
