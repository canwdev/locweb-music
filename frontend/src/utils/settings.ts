import {LoopModeType, NavbarTabsType} from "@/enum";

const LS_KEY_LOCWEB_SETTINGS = 'LS_KEY_LOCWEB_SETTINGS'

const defaultSettings = {
  isDarkTheme: true,
  ncmApi: null,
  navbarTab: NavbarTabsType.MAIN,
  themeColor: null,
  loopMode: LoopModeType.LOOP_SEQUENCE, // music playing loop mode
}

export function loadSettings() {
  const settings = JSON.parse(localStorage.getItem(LS_KEY_LOCWEB_SETTINGS) || '{}')
  return {...defaultSettings, ...settings}
}

export function saveSettings(obj = {}) {
  localStorage.setItem(LS_KEY_LOCWEB_SETTINGS, JSON.stringify(obj))
}
