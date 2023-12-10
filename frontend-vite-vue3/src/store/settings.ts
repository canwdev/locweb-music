import {CustomThemeType, LdThemeType, LoopModeType} from '@/enum/settings'

interface IStore {
  ldTheme: LdThemeType
  loopMode: LoopModeType
  audioVolume: number
  customTheme: CustomThemeType
  enableRoundedTheme: boolean
  enableAeroTheme: boolean
  // 是否开启窗口模式
  isWindowed: boolean
  // 是否显示任务栏时钟
  isShowClock: boolean
}

export const useSettingsStore = defineStore('settingsStore', {
  state: (): IStore => {
    return {
      ldTheme: LdThemeType.SYSTEM,
      loopMode: LoopModeType.LOOP_SEQUENCE,
      audioVolume: 100,
      customTheme: CustomThemeType.DEFAULT,
      enableRoundedTheme: true,
      enableAeroTheme: false,
      isWindowed: true,
      isShowClock: true,
    }
  },
  actions: {
    setAudioVolume(value) {
      value = Number(value)

      if (value > 100) {
        value = 100
      }
      if (value < 0) {
        value = 0
      }

      // console.log(value)

      this.audioVolume = value
    },
    volumeUp(step = 5) {
      const volume = this.audioVolume + step
      this.setAudioVolume(volume)
    },
    volumeDown(step = 5) {
      const volume = this.audioVolume - step
      this.setAudioVolume(volume)
    },
  },
  persist: {
    key: 'ls_key_localweb_settings',
  },
})
