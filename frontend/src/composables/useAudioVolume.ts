import bus, {ACTION_CHANGE_VOLUME} from "@/utils/bus";
import {computed, onMounted, ref} from "vue";

const LS_KEY_VOLUME = 'LOCWEB_AUDIO_VOLUME'
const getLsVolume = (): number => {
  const volume = localStorage.getItem(LS_KEY_VOLUME)

  if (volume !== null) {
    return 100
  }

  return Number(volume)
}
const setLsVolume = (volume: number) => {
  localStorage.setItem(LS_KEY_VOLUME, String(volume))
}

export default () => {
  const isSeeking = ref(false)
  const initVolume = getLsVolume()
  const audioVolume = ref(initVolume)

  const setVolume = (value, isSaveLs = false) => {
    value = Number(value)

    if (value > 100) {
      value = 100
    }
    if (value < 0) {
      value = 0
    }
    if (audioVolume.value === value) {
      return
    }

    // console.log(value)

    audioVolume.value = value
    bus.emit(ACTION_CHANGE_VOLUME, value)

    if (isSaveLs) {
      setLsVolume(value)
    }
  }

  onMounted(() => {
    setVolume(initVolume, true)
  })

  const volumeIcon = computed(() => {
    if (audioVolume.value > 50) {
      return 'volume_up'
    }
    if (audioVolume.value < 50) {
      if (audioVolume.value == 0) {
        return 'volume_off'
      }
      if (audioVolume.value < 10) {
        return 'volume_mute'
      }
    }
    return 'volume_down'
  })


  return {
    audioVolume,
    volumeIcon,
    volumeUp(step = 2) {
      const volume = audioVolume.value + step
      setVolume(volume)
    },
    volumeDown(step = 2) {
      const volume = audioVolume.value - step
      setVolume(volume)
    },
    volumeSeeking(evt) {
      isSeeking.value = true
      setVolume(evt.target.value)
    },
    volumeChange(evt) {
      isSeeking.value = false
      setVolume(evt.target.value, true)
    },
  }
}
