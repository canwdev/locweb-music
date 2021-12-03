export const guid = () => {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }

  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}

export class IncreaseNumber {
  constructor(seed = 0) {
    this.seed = seed
  }
  get() {
    return ++this.seed
  }
}

export const formatTimeHMS = (ms) => {
  const h = Math.round(ms / (60 * 60)).toString().padStart(2, '0') //精确小时，用去余
  const m = Math.round((ms / 60) % 60).toString().padStart(2, '0') //剩余分钟就是用1小时等于60分钟进行趣余
  const s = Math.round(ms % 60).toString().padStart(2, '0')
  return h + ':' + m + ':' + s
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
    rand = Math.floor(Math.random() * i)
    const t = arr[i]
    arr[i] = arr[rand]
    arr[rand] = t
  }
  return arr
}

export const blobToDataURL = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    // @ts-ignore
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })
}

export function downLoadFile(src, name = '') {
  try {
    if (('download' in document.createElement('a'))) {
      const el = document.createElement('a')
      if (name) {
        el.setAttribute('download', name)
      }
      el.style.display = 'none'
      el.href = src
      document.body.appendChild(el)
      el.click()
      URL.revokeObjectURL(el.href) // 释放 URL 对象
      document.body.removeChild(el)
    } else {
      const elIf = document.createElement('iframe')
      elIf.src = src
      elIf.style.display = 'none'
      document.body.appendChild(elIf)
    }
  } catch (e) {
    console.error(e)
    window.open(src)
  }
}
