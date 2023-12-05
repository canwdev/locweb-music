import {LoopModeType} from '@/enum'
import globalEventBus, {GlobalEvents} from '@/utils/bus'

export enum LdThemeType {
  SYSTEM = 0,
  LIGHT = 1,
  DARK = 2,
}

export const ldThemeOptions = [
  {
    label: 'Follow System',
    value: LdThemeType.SYSTEM,
  },
  {
    label: 'Light Theme',
    value: LdThemeType.LIGHT,
  },
  {
    label: 'Dark Theme',
    value: LdThemeType.DARK,
  },
]

interface IStore {
  ldTheme: LdThemeType
  loopMode: LoopModeType
  audioVolume: number
}

export const useSettingsStore = defineStore('settingsStore', {
  state: (): IStore => {
    return {
      ldTheme: LdThemeType.SYSTEM,
      loopMode: LoopModeType.LOOP_SEQUENCE,
      audioVolume: 100,
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
