<script lang="ts">
import {defineComponent} from 'vue'
import globalEventBus, {GlobalEvents} from '@/utils/bus'
import {useMusicStore} from '@/store/music'
import {useI18n} from 'vue-i18n'
import {MusicItem} from '@/enum/music'
import {useSettingsStore} from '@/store/settings'

export default defineComponent({
  name: 'PlayerCore',
  props: {
    show: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const {t: $t} = useI18n()
    const audioRef = ref()
    const musicStore = useMusicStore()
    const settingsStore = useSettingsStore()
    const audioSrc = ref<string | null>(null)

    watch(
      () => musicStore.musicItem,
      async (item: MusicItem) => {
        if (!item) {
          audioSrc.value = null
        }
        await item.fetchDetail()
        audioSrc.value = item.src
      }
    )

    const play = () => {
      audioRef.value.play()
    }
    const pause = () => {
      audioRef.value.pause()
    }
    const previous = () => {
      globalEventBus.emit(GlobalEvents.ACTION_PREV)
    }
    const next = () => {
      globalEventBus.emit(GlobalEvents.ACTION_NEXT)
    }
    const togglePlay = ({isPlay = false, isPause = false} = {}) => {
      if (!audioRef.value || !audioRef.value.src) {
        return
      }
      if ((audioRef.value.paused || isPlay) && !isPause) {
        play()
      } else {
        pause()
      }
    }
    const registerAudioEvents = (audio) => {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', play)
        navigator.mediaSession.setActionHandler('pause', pause)
        // navigator.mediaSession.setActionHandler('seekbackward', previous)
        // navigator.mediaSession.setActionHandler('seekforward', next)
        navigator.mediaSession.setActionHandler('previoustrack', previous)
        navigator.mediaSession.setActionHandler('nexttrack', next)
      }

      audio.addEventListener('play', () => {
        musicStore.paused = false
      })

      audio.addEventListener('pause', () => {
        musicStore.paused = true
      })

      audio.addEventListener('ended', () => {
        globalEventBus.emit(GlobalEvents.ACTION_PLAY_ENDED)
      })

      audio.addEventListener('canplay', (evt) => {
        // console.log('canplay', audio)
        musicStore.duration = evt.target.duration
      })

      audio.addEventListener('timeupdate', (evt) => {
        // console.log('timeupdate', evt.target.currentTime)
        musicStore.currentTime = evt.target.currentTime
      })

      audio.addEventListener('error', (error) => {
        console.error(error)
        window.$message.error($t('msg.load-fail-or-no-supported-source'))
      })
    }
    const changeCurrentTime = (newTime) => {
      audioRef.value && (audioRef.value.currentTime = newTime)
    }
    const changeVolume = (val) => {
      audioRef.value && (audioRef.value.volume = val / 100)
    }
    const changeSpeed = (val = 1) => {
      if (!audioRef.value) {
        return
      }
      try {
        audioRef.value.playbackRate = val
        musicStore.playbackRate = val
      } catch (e) {
        window.$message.error({
          message: e.message,
        })
      }
    }

    watch(() => settingsStore.audioVolume, changeVolume)

    onMounted(() => {
      globalEventBus.on(GlobalEvents.ACTION_TOGGLE_PLAY, togglePlay)
      globalEventBus.on(GlobalEvents.ACTION_CHANGE_CURRENT_TIME, changeCurrentTime)
      globalEventBus.on(GlobalEvents.ACTION_CHANGE_VOLUME, changeVolume)
      globalEventBus.on(GlobalEvents.ACTION_CHANGE_SPEED, changeSpeed)
      registerAudioEvents(audioRef.value)
    })

    onBeforeUnmount(() => {
      globalEventBus.off(GlobalEvents.ACTION_TOGGLE_PLAY, togglePlay)
      globalEventBus.off(GlobalEvents.ACTION_CHANGE_CURRENT_TIME, changeCurrentTime)
      globalEventBus.off(GlobalEvents.ACTION_CHANGE_VOLUME, changeVolume)
      globalEventBus.off(GlobalEvents.ACTION_CHANGE_SPEED, changeSpeed)
    })

    return {
      audioRef,
      musicStore,
      audioSrc,
    }
  },
})
</script>

<template>
  <div v-show="show" class="player-core">
    <audio ref="audioRef" :src="audioSrc" controls></audio>
  </div>
</template>

<style lang="scss" scoped>
.player-core {
}
</style>
