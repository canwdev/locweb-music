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
  ACTION_NEXT,
  ACTION_PLAY_ENDED,
  ACTION_PREV,
  ACTION_TOGGLE_PLAY,
  ACTION_CHANGE_VOLUME
} from '@/utils/bus'
import store from '@/store'
import {getDetail} from '@/api/music'
import {mapState} from 'vuex'

const updateTitle = (musicItem, isPaused) => {
  document.title = `${isPaused ? '⏸️' : '▶️'} ${musicItem.filenameDisplay}`
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
    }
  },
  watch: {
    async musicItem(val) {
      updateTitle(val)
      if (!val.isOutSource) {
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
      }
      // https://developers.google.com/web/updates/2017/02/media-session
      if ('mediaSession' in navigator) {
        let artwork = [{src: require('@/assets/images/default-cover.jpg'), sizes: '512x512'}]
        if (val.cover) {
          artwork = [
            {src: val.cover, sizes: '512x512'},
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
    },
    paused(val) {
      updateTitle(this.musicItem, val)
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
    togglePlay({isPlay = false} = {}) {
      if (!this.audio || !this.audio.src) {
        return
      }
      if (this.audio.paused || isPlay) {
        this.play()
      } else {
        this.pause()
      }
    },
    registerAudioEvents(audio) {
      if ('mediaSession' in navigator) {
        // @ts-ignore
        navigator.mediaSession.setActionHandler('play', this.play)
        // @ts-ignore
        navigator.mediaSession.setActionHandler('pause', this.pause)
        // navigator.mediaSession.setActionHandler('seekbackward', function() {});
        // navigator.mediaSession.setActionHandler('seekforward', function() {});
        // @ts-ignore
        navigator.mediaSession.setActionHandler('previoustrack', this.previous)
        // @ts-ignore
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
      this.audio && (this.audio.playbackRate = val)
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
