import bus, {ACTION_CHANGE_VOLUME} from '@/utils/bus'

const LS_KEY_VOLUME = 'LOCWEB_AUDIO_VOLUME'

const getLsVolume = () => {
  const volume = localStorage.getItem(LS_KEY_VOLUME)

  if (volume === null) {
    return 100
  }

  return Number(volume)
}
const setLsVolume = (volume) => {
  localStorage.setItem(LS_KEY_VOLUME, String(volume))
}
const initVolume = getLsVolume()

export default {
  data() {
    return {
      isSeeking: false,
      audioVolume: initVolume
    }
  },
  computed: {
    volumeIcon() {
      if (this.audioVolume > 50) {
        return 'volume_up'
      }
      if (this.audioVolume < 50) {
        if (this.audioVolume == 0) {
          return 'volume_off'
        }
        if (this.audioVolume < 10) {
          return 'volume_mute'
        }
      }
      return 'volume_down'
    }
  },
  mounted() {
    this.setVolume(initVolume, true)
  },
  methods: {
    setVolume(value, isSaveLs = false) {
      value = Number(value)

      if (value > 100) {
        value = 100
      }
      if (value < 0) {
        value = 0
      }

      // console.log(value)

      this.audioVolume = value
      bus.$emit(ACTION_CHANGE_VOLUME, value)

      if (isSaveLs) {
        setLsVolume(value)
      }
    },
    volumeUp(step = 5) {
      const volume = this.audioVolume + step
      this.setVolume(volume, true)
    },
    volumeDown(step = 5) {
      const volume = this.audioVolume - step
      this.setVolume(volume, true)
    },
    volumeSeeking(value) {
      this.isSeeking = true
      this.setVolume(value)
    },
    volumeChange(value) {
      this.isSeeking = false
      this.setVolume(value, true)
    },

  }
}
