import {LS_KEY_SETTINGS, settingsList} from '@/enum/settings'

const defaultSettings = {}

settingsList.forEach(group => {
  if (group.hidden) {
    return
  }
  const {children} = group

  children.forEach(item => {
    if (!item.id || item.manualUpdate) {
      return
    }

    defaultSettings[item.id] = item.default
  })
})

console.log('>>> defaultSettings', defaultSettings)

export function loadSettings() {
  const settings = JSON.parse(localStorage.getItem(LS_KEY_SETTINGS) || '{}')
  return {...defaultSettings, ...settings}
}

export function saveSettings(obj = {}) {
  localStorage.setItem(LS_KEY_SETTINGS, JSON.stringify(obj))
}
