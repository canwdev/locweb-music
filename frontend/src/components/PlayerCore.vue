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

    const source = computed((): string => {
      return musicItem.value.getSource()
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
      audio.addEventListener('play', () => {
        paused.value = false
      })

      audio.addEventListener('pause', () => {
        paused.value = true
      })
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
      console.log('ACTION_TOGGLE_PLAY')
      bus.on(ACTION_TOGGLE_PLAY, togglePlay)
    })
    onBeforeUnmount(() => {
      bus.off(ACTION_TOGGLE_PLAY, togglePlay)
      if (audio) {
        audio.removeEventListener('play')
        audio.removeEventListener('pause')
      }
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
  right: 0;
  top: 50px;
}
</style>
