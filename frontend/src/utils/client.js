const {electronAPI} = window

export const openInBrowser = (url) => {
  if (electronAPI) {
    electronAPI.openExternal(url)
  } else {
    window.open(url, '_blank')
  }
}
