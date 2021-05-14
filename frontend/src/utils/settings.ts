const LS_KEY = 'LS_KEY_LOCWEB_SETTINGS'

const defaultSettings = {
  isDarkTheme: true,
  ncmApi: null
}

export function loadSettings() {
  const settings = JSON.parse(localStorage.getItem(LS_KEY) || '{}')
  return {...defaultSettings, ...settings}
}

export function saveSettings(obj = {}) {
  localStorage.setItem(LS_KEY, JSON.stringify(obj))
}
