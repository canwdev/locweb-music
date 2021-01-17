<template>
  <div class="player-core">
    <audio
        v-show="false"
        :ref="setAudioRef"
        :src="source" controls></audio>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, onBeforeUnmount, computed } from 'vue'
import {MusicItem} from "@/enum";
import bus, {
  ACTION_TOGGLE_PLAY,
  ACTION_PLAY_ENDED,
  ACTION_CHANGE_CURRENT_TIME
} from "@/utils/bus";
import store from '@/store'

export default defineComponent({
  name: "PlayerCore",
  setup() {
    let audio

    const musicItem = computed((): MusicItem => {
      return store.getters.musicItem
    })

    const source = computed((): string | null => {
      return musicItem.value.getSource() || null
    })

    const paused = computed({
      get(): boolean {
        return store.getters.paused
      },
      set(value: boolean) {
        store.commit('setPaused', value)
      }
    })

    const setAudioRef = (el) => {
      audio = el
    }
    const play = () => {
      audio.play()
    }
    const pause = () => {
      audio.pause()
    }
    const togglePlay = () => {
      if (!audio) {
        return
      }
      if (audio.paused) {
        play()
      } else {
        pause()
      }
    }
    const registerAudioEvents = (audio) => {
      audio.addEventListener('play', () => {
        paused.value = false
      })

      audio.addEventListener('pause', () => {
        paused.value = true
      })

      audio.addEventListener('ended', () => {
        bus.emit(ACTION_PLAY_ENDED)
      })

      audio.addEventListener('canplay', (evt) => {
        // console.log('canplay', audio)
        store.commit('setDuration', evt.target.duration)
      })

      audio.addEventListener('timeupdate', (evt) => {
        // console.log('timeupdate', evt.target.currentTime)
        store.commit('setCurrentTime', evt.target.currentTime)
      })

      audio.addEventListener('error', (error) => {
        window.$swal.fire({
          toast: true,
          timer: 1500,
          icon: 'error',
          title: 'Load fail or no supported source',
          showConfirmButton: false,
        })
        console.error(error)
      })
    }
    const changeCurrentTime = (newTime) => {
      audio && (audio.currentTime = newTime)
    }

    onMounted(() => {
      bus.on(ACTION_TOGGLE_PLAY, togglePlay)
      bus.on(ACTION_CHANGE_CURRENT_TIME, changeCurrentTime)

      registerAudioEvents(audio)
    })
    onBeforeUnmount(() => {
      bus.off(ACTION_TOGGLE_PLAY, togglePlay)
      bus.off(ACTION_CHANGE_CURRENT_TIME, changeCurrentTime)
    })

    return {
      audio,
      musicItem,
      source,
      paused,
      setAudioRef,
      togglePlay,
      play,
      pause
    }
  }
})
</script>

<style lang="scss" scoped>
.player-core {
  position: fixed;
  z-index: 90;
  right: 10px;
  bottom: 80px;
}
</style>
