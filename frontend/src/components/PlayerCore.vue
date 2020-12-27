<template>
  <div class="player-core">
    <audio
        :ref="setAudioRef"
        :src="source" controls></audio>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, onBeforeUnmount, computed } from 'vue'
import {MusicItem} from "@/enum";
import bus, {ACTION_TOGGLE_PLAY} from "@/utils/bus";
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

      if (!audio) {
        return
      }
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

    onMounted(() => {
      bus.on(ACTION_TOGGLE_PLAY, togglePlay)
      audio.addEventListener('play', () => {
        paused.value = false
      })

      audio.addEventListener('pause', () => {
        paused.value = true
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
    })
    onBeforeUnmount(() => {
      bus.off(ACTION_TOGGLE_PLAY, togglePlay)
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
  bottom: 60px;
}
</style>
