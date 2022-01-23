<template>
  <div class="player-core">
    <audio
      v-show="false"
      ref="audioRef"
      :src="source"
    ></audio>
  </div>
</template>

<script>
import bus, {
  ACTION_CHANGE_CURRENT_TIME,
  ACTION_CHANGE_SPEED,
  ACTION_CHANGE_VOLUME,
  ACTION_NEXT,
  ACTION_PLAY_ENDED,
  ACTION_PREV,
  ACTION_TOGGLE_PLAY
} from '@/utils/bus'
import store from '@/store'
import {getDetail} from '@/api/music'
import {mapState} from 'vuex'

const originalTitle = document.title
const updateTitle = (title, isPaused) => {
  if (!title) {
    document.title = originalTitle
  } else {
    document.title = `${isPaused ? '⏸️' : '▶️'} ${title}`
  }
}

export default {
  name: 'PlayerCore',
  computed: {
    ...mapState([
      'musicItem'
    ]),
    source() {
      return this.musicItem.getSource() || null
    },
    paused: {
      get() {
        return this.$store.state.paused
      },
      set(val) {
        return this.$store.commit('setPaused', val)
      }
    },
    playbackRate: {
      get() {
        return this.$store.state.playbackRate
      },
      set(val) {
        this.$store.commit('setPlaybackRate', val)
      }
    }
  },
  watch: {
    async musicItem(item) {
      if (!item || !item.filename) {
        updateTitle('', true)
        return
      }
      updateTitle(item.filenameDisplay)

      if (!item.isOutSource) {
        const params = {
          path: item.path,
          filename: item.filename,
          updatePlayStat: true
        }
        if (!item.isDetailLoaded) {
          const detail = await getDetail(params)
          // console.log('detail', detail)

          const {
            metadata,
            cover,
            lyric
          } = detail
          item.setMetadata(metadata, cover, lyric)
          updateTitle(item.filenameDisplay)
        } else {
          // only update play status
          await getDetail({
            ...params,
            updateStatOnly: true
          })
        }
      }
      // https://developers.google.com/web/updates/2017/02/media-session
      if ('mediaSession' in navigator) {
        let artwork = [{src: require('@/assets/images/default-cover.jpg'), sizes: '512x512'}]
        if (item.cover) {
          artwork = [
            {src: item.cover, sizes: '512x512'},
          ]
        }

        /* eslint-disable no-undef */
        navigator.mediaSession.metadata = new MediaMetadata({
          /* eslint-enable no-undef */
          title: item.title,
          artist: item.artist,
          album: item.album,
          artwork
        })
      }
    },
    paused(val) {
      updateTitle(this.musicItem.filenameDisplay, val)
    }
  },
  mounted() {
    this.audio = this.$refs.audioRef

    bus.$on(ACTION_TOGGLE_PLAY, this.togglePlay)
    bus.$on(ACTION_CHANGE_CURRENT_TIME, this.changeCurrentTime)
    bus.$on(ACTION_CHANGE_VOLUME, this.changeVolume)
    bus.$on(ACTION_CHANGE_SPEED, this.changeSpeed)
    this.registerAudioEvents(this.audio)
  },
  beforeDestroy() {
    bus.$off(ACTION_TOGGLE_PLAY, this.togglePlay)
    bus.$off(ACTION_CHANGE_CURRENT_TIME, this.changeCurrentTime)
    bus.$off(ACTION_CHANGE_VOLUME, this.changeVolume)
    bus.$off(ACTION_CHANGE_SPEED, this.changeSpeed)
  },
  methods: {
    play() {
      this.audio.play()
    },
    pause() {
      this.audio.pause()
    },
    previous() {
      bus.$emit(ACTION_PREV)
    },
    next() {
      bus.$emit(ACTION_NEXT)
    },
    togglePlay({isPlay = false, isPause = false} = {}) {
      if (!this.audio || !this.audio.src) {
        return
      }
      if ((this.audio.paused || isPlay) && !isPause) {
        this.play()
      } else {
        this.pause()
      }
    },
    registerAudioEvents(audio) {
      if ('mediaSession' in navigator) {
        navigator.mediaSession.setActionHandler('play', this.play)
        navigator.mediaSession.setActionHandler('pause', this.pause)
        // navigator.mediaSession.setActionHandler('seekbackward', this.previous)
        // navigator.mediaSession.setActionHandler('seekforward', this.next)
        navigator.mediaSession.setActionHandler('previoustrack', this.previous)
        navigator.mediaSession.setActionHandler('nexttrack', this.next)
      }

      audio.addEventListener('play', () => {
        this.paused = false
      })

      audio.addEventListener('pause', () => {
        this.paused = true
      })

      audio.addEventListener('ended', () => {
        bus.$emit(ACTION_PLAY_ENDED)
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
        this.$toast.error(this.$t('msg.load-fail-or-no-supported-source'))
        console.error(error)
      })
    },
    changeCurrentTime(newTime) {
      this.audio && (this.audio.currentTime = newTime)
    },
    changeVolume(val) {
      this.audio && (this.audio.volume = val / 100)
    },
    changeSpeed(val = 1) {
      if (!this.audio) {
        return
      }
      try {
        this.audio.playbackRate = val
        this.playbackRate = val
      } catch (e) {
        this.$toast.error({
          message: e.message
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.player-core {
  position: fixed;
  z-index: 90;
  right: 10px;
  bottom: 80px;
}
</style>
