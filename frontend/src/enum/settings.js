import {LoopModeType, NavbarTabsType} from '@/enum'

export const LS_KEY_SETTINGS = 'LS_KEY_LOCWEB_SETTINGS'

export const SettingsType = {
  SWITCH: 'SWITCH',
  CHECKBOX: 'CHECKBOX',
  TEXT: 'TEXT',
  TEXTAREA: 'TEXTAREA',
  COLOR: 'COLOR',
  SELECT: 'SELECT',
}

const isSystemDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

export const settingsList = [
  {
    title: 'UI',
    children: [
      {
        id: 'useSystemTheme',
        title: '使用系统主题',
        type: SettingsType.CHECKBOX,
        icon: 'nights_stay',
        default: true,
        desc: '根据系统设置自动调整明暗主题。'
      },
      {id: 'isDarkTheme', type: SettingsType.SWITCH, icon: 'nights_stay', default: isSystemDarkMode},
      {id: 'themeColor', type: SettingsType.COLOR, icon: 'color_lens', default: '#72bb8d'},
      {id: 'fxEnabled', type: SettingsType.SWITCH, icon: '', desc: '', default: false},
      {id: 'backgroundStyle', type: SettingsType.SWITCH, icon: '', desc: '', disabled: true},
    ]
  },
  {
    title: 'Network',
    children: [
      {id: 'ncmApi', type: SettingsType.TEXT, icon: '', desc: '', placeholder: '', disabled: true},
      {id: 'serverApi', type: SettingsType.TEXT, icon: '', desc: '', placeholder: '', disabled: true},
    ]
  },
  {
    title: 'Client',
    children: [
      {id: 'windowTransparent', type: '', desc: '', default: false, disabled: true},
      {id: 'windowBordered', type: '', desc: '', default: true, disabled: true},
    ]
  },
  {
    title: 'Misc',
    children: [
      {id: 'navbarTab', type: '', desc: '', default: NavbarTabsType.MAIN},
      // music playing loop mode
      {id: 'loopMode', type: '', desc: '', default: LoopModeType.LOOP_SEQUENCE},
    ]
  }
]
