const {electronAPI} = window

export const getClientHostUrl = (fallbackUrl = '') => {
  if (electronAPI) {
    const port = electronAPI.getClientHostPort()
    return `http://127.0.0.1:${port}`
  }
  return localStorage.getItem('LOCWEB_API_HOST') || process.env.VUE_APP_API_HOST || fallbackUrl
}

export const openInBrowser = (url) => {
  if (electronAPI) {
    electronAPI.openExternal(url)
  } else {
    window.open(url, '_blank')
  }
}
