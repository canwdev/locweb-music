export const formatTimeMS = (ms: number): string => {
  ms = Math.floor(ms)
  const minute = Math.floor(ms / 60)
  const second = (ms % 60).toString().padStart(2, '0')
  return minute + ':' + second
}

/**
 * 打乱数组并返回新数组
 * @param orgArr 原数组
 * @returns array
 */
export const shuffleArray = (orgArr) => {
  if (orgArr.length == 0) return orgArr
  const arr = orgArr.slice(0)

  let rand
  const len = arr.length

  for (let i = 0; i < len; i++) {
    rand = Math.floor(Math.random() * i);
    const t = arr[i];
    arr[i] = arr[rand];
    arr[rand] = t;
  }
  return arr;
}
