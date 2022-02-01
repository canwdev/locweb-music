import {
  getLoopModeMap,
  HOST_URL_DEFAULT,
  LoopModeType,
  LoopModeTypeArray,
  NavbarTabs,
  NavbarTabsType,
  NCM_API_URL_DEFAULT
} from '@/enum'
import {getSystemDarkMode} from '@/utils/color'
import {isClient} from '@/utils/client'
import languages from '@/lang/languages'
import {LS_KEY_LOCATE} from '@/lang/i18n'
import {LS_KEY_API_HOST, LS_KEY_NCM_API_URL} from '@/enum/service'

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
        id: 'language',
        title: 'settings.language',
        i18n: true,
        type: SettingsType.SELECT,
        options() {
          return languages.map(item => ({
            label: item.name,
            value: item.locate
          }))
        },
        manualUpdate(value) {
          this.$i18n.locale = value
          localStorage.setItem(LS_KEY_LOCATE, value)
          return false
        },
        value() {
          return this.$i18n.locale
        },
        icon: 'translate',
        default: null,
      },
      {
        id: 'useSystemTheme',
        title: '使用系统主题',
        type: SettingsType.CHECKBOX,
        icon: 'brightness_auto',
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
        i18n: true,
        type: SettingsType.COLOR,
        icon: 'color_lens',
        default: '#72bb8d'
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
        title: '网易云第三方 API 地址',
        desc: '用于下载歌曲、搜索歌词（NeteaseCloudMusicApi）',
        type: SettingsType.TEXT,
        icon: 'album',
        placeholder: NCM_API_URL_DEFAULT,
        manualUpdate(value) {
          localStorage.setItem(LS_KEY_NCM_API_URL, value)
          this.updateCurrentValue()
          this.$toast.info('刷新頁面后生效！')
          return false
        },
        value() {
          return localStorage.getItem(LS_KEY_NCM_API_URL)
        },
      },
      {
        id: 'serverApi',
        title: '服务器 API 地址',
        desc: 'Locweb Music 服务器',
        type: SettingsType.TEXT,
        icon: 'dns',
        placeholder: HOST_URL_DEFAULT,
        manualUpdate(value) {
          localStorage.setItem(LS_KEY_API_HOST, value)
          this.updateCurrentValue()
          this.$toast.info('刷新頁面后生效！')
          return false
        },
        value() {
          return localStorage.getItem(LS_KEY_API_HOST)
        },
      },
    ]
  },
  {
    hidden: !isClient,
    title: 'Client',
    children: [
      {
        id: 'windowTransparent', type: '', default: false, disabled: true,
        manualUpdate(value) {
        }
      },
      {
        id: 'windowBordered', type: '', default: true, disabled: true,
        manualUpdate(value) {
        }
      },
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
        hidden: true
      },
      // music playing loop mode
      {
        id: 'loopMode',
        title: '播放模式',
        type: SettingsType.SELECT,
        icon(settings) {
          const loopModeMap = getLoopModeMap.call(this)
          return loopModeMap[settings.loopMode].icon
        },
        options() {
          const loopModeMap = getLoopModeMap.call(this)
          return LoopModeTypeArray.map(option => {
            return {
              label: loopModeMap[option].label,
              value: option
            }
          })
        },
        resultFormatter(value) {
          return Number(value)
        },
        default: LoopModeType.LOOP_SEQUENCE
      },
    ]
  }
]
