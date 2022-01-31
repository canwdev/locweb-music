import {getLoopModeMap, LoopModeType, LoopModeTypeArray, NavbarTabs, NavbarTabsType} from '@/enum'
import {getSystemDarkMode} from '@/utils/color'
import {isClient} from '@/utils/client'

export const LS_KEY_SETTINGS = 'LS_KEY_LOCWEB_SETTINGS'

export const SettingsType = {
  SWITCH: 'SWITCH',
  CHECKBOX: 'CHECKBOX',
  TEXT: 'TEXT',
  TEXTAREA: 'TEXTAREA',
  COLOR: 'COLOR',
  SELECT: 'SELECT',
}

export const settingsList = [
  {
    title: 'UI',
    children: [
      {
        id: 'useSystemTheme',
        title: '使用系统主题',
        type: SettingsType.CHECKBOX,
        default: true,
        desc: '根据系统设置自动调整明暗主题。'
      },
      {
        id: 'isDarkTheme',
        title: 'settings.dark-theme',
        i18n: true,
        type: SettingsType.SWITCH,
        icon: 'nights_stay',
        default: getSystemDarkMode(),
        disabled(settings) {
          return settings.useSystemTheme
        }
      },
      {
        id: 'themeColor',
        title: 'settings.theme-color',
        i18n: true, type: SettingsType.COLOR, icon: 'color_lens', default: '#72bb8d'
      },
      {id: 'fxEnabled', type: SettingsType.SWITCH, icon: '', default: false, hidden: true},
      {id: 'backgroundStyle', type: SettingsType.SWITCH, icon: '', hidden: true},
    ]
  },
  {
    title: 'Network',
    children: [
      {
        id: 'ncmApi',
        title: '网易云第三方 Node.js API地址',
        desc: '用于下载歌曲、搜索歌词',
        type: SettingsType.TEXT,
        icon: '',
        placeholder: '',
        disabled: true
      },
      {
        id: 'serverApi',
        title: '服务器API地址',
        desc: 'Locweb Music 服务器',
        type: SettingsType.TEXT,
        icon: '',
        placeholder: '',
        disabled: true
      },
    ]
  },
  {
    hidden: !isClient,
    title: 'Client',
    children: [
      {id: 'windowTransparent', type: '', default: false, disabled: true},
      {id: 'windowBordered', type: '', default: true, disabled: true},
    ]
  },
  {
    title: 'Misc',
    children: [
      {
        id: 'navbarTab',
        type: SettingsType.SELECT, default: NavbarTabsType.MAIN,
        options() {
          return Object.values(NavbarTabs).map(item => ({
            label: item.label_i18n ? this.$t(item.label_i18n) : item.label,
            value: item.value
          }))
        },
        hidden: false
      },
      // music playing loop mode
      {
        id: 'loopMode',
        title: '播放模式',
        type: SettingsType.SELECT,
        options() {
          const loopModeMap = getLoopModeMap.call(this)
          return LoopModeTypeArray.map(option => {
            return {
              label: loopModeMap[option].label,
              value: option
            }
          })
        },
        default: LoopModeType.LOOP_SEQUENCE
      },
    ]
  }
]
