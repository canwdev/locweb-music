<template>
  <div class="player-core">
    <audio
        v-show="false"
        :ref="setAudioRef"
        :src="source" controls></audio>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, onBeforeUnmount, onMounted, watch} from 'vue'
import {MusicItem} from "@/enum";
import bus, {
  ACTION_CHANGE_CURRENT_TIME,
  ACTION_NEXT,
  ACTION_PLAY_ENDED,
  ACTION_PREV,
  ACTION_TOGGLE_PLAY,
  ACTION_CHANGE_VOLUME
} from "@/utils/bus";
import store from '@/store'
import {getDetail} from "@/api/music.ts";

export default defineComponent({
  name: "PlayerCore",
  setup() {
    let audio
    const setAudioRef = (el) => {
      audio = el
    }

    const musicItem = computed((): MusicItem => {
      return store.getters.musicItem
    })

    const updateTitle = (musicItem: MusicItem, isPaused?: boolean) => {
      document.title = `${isPaused ? '⏸️' : '▶️'} ${musicItem.displayTitle}`
    }

    watch(musicItem, async (val) => {
      // console.log('musicItem changed', val)

      updateTitle(val)

      const params = {
        path: val.path,
        filename: val.filename,
        updatePlayStat: true
      }
      if (!val.isDetailLoaded) {
        const detail = await getDetail(params)
        // console.log('detail', detail)

        const {
          metadata,
          cover,
          lyric
        } = detail
        val.setMetadata(metadata, cover, lyric)
        updateTitle(val)
      } else {
        // only update play status
        await getDetail({
          ...params,
          updateStatOnly: true
        })
      }

      // https://developers.google.com/web/updates/2017/02/media-session
      if ('mediaSession' in navigator) {
        let artwork: Array<any> = [{ src: require('@/assets/images/no-image.jpg'), sizes: '512x512' }]
        if (val.cover) {
          artwork = [
            { src: val.cover, sizes: '512x512' },
          ]
        }

        /* eslint-disable no-undef */
        // @ts-ignore
        navigator.mediaSession.metadata = new MediaMetadata({
          /* eslint-enable no-undef */
          title: val.title,
          artist: val.artist,
          album: val.album,
          artwork
        })
      }

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

    watch(paused, (val) => {
      updateTitle(musicItem.value, val)
    })

    const play = () => {
      audio.play()
    }
    const pause = () => {
      audio.pause()
    }
    const previous = () => {
      bus.emit(ACTION_PREV)
    }
    const next = () => {
      bus.emit(ACTION_NEXT)
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
      if ('mediaSession' in navigator) {
        // @ts-ignore
        navigator.mediaSession.setActionHandler('play', play);
        // @ts-ignore
        navigator.mediaSession.setActionHandler('pause', pause);
        // navigator.mediaSession.setActionHandler('seekbackward', function() {});
        // navigator.mediaSession.setActionHandler('seekforward', function() {});
        // @ts-ignore
        navigator.mediaSession.setActionHandler('previoustrack', previous);
        // @ts-ignore
        navigator.mediaSession.setActionHandler('nexttrack', next);
      }

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
        window.$notify.error('Load fail or no supported source')
        console.error(error)
      })
    }
    const changeCurrentTime = (newTime) => {
      audio && (audio.currentTime = newTime)
    }

    const changeVolume = (val) => {
      audio && (audio.volume = val/100)
    }

    onMounted(() => {
      bus.on(ACTION_TOGGLE_PLAY, togglePlay)
      bus.on(ACTION_CHANGE_CURRENT_TIME, changeCurrentTime)
      bus.on(ACTION_CHANGE_VOLUME, changeVolume)

      registerAudioEvents(audio)
    })
    onBeforeUnmount(() => {
      bus.off(ACTION_TOGGLE_PLAY, togglePlay)
      bus.off(ACTION_CHANGE_CURRENT_TIME, changeCurrentTime)
      bus.off(ACTION_CHANGE_VOLUME, changeVolume)
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
