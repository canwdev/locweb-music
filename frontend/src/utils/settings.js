import {LoopModeType, NavbarTabsType} from '@/enum'

const LS_KEY_SETTINGS = 'LS_KEY_LOCWEB_SETTINGS'

const isSystemDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

const defaultSettings = {
  isDarkTheme: isSystemDarkMode,
  ncmApi: null,
  navbarTab: NavbarTabsType.MAIN,
  themeColor: null,
  loopMode: LoopModeType.LOOP_SEQUENCE, // music playing loop mode
}

export function loadSettings() {
  const settings = JSON.parse(localStorage.getItem(LS_KEY_SETTINGS) || '{}')
  return {...defaultSettings, ...settings}
}

export function saveSettings(obj = {}) {
  localStorage.setItem(LS_KEY_SETTINGS, JSON.stringify(obj))
}
