import LyricParser from '@/utils/lyric-parser'
import {mapState, mapGetters} from 'vuex'

export default {
  data() {
    return {
      lyricObj: null,
      lyricCurrentLine: 0,
      isLyricLock: true,
    }
  },
  computed: {
    ...mapState([
      'paused',
    ]),
    ...mapGetters([
      'lyric',
    ])
  },
  watch: {
    paused(val) {
      if (!this.lyricObj) {
        return
      }
      if (val) {
        this.lyricObj.pause()
      } else {
        this.lyricObj.play()
      }
    },
    lyric: {
      handler(val) {
        if (this.lyricObj) {
          this.destroyLyric()
        }
        if (!val) {
          return
        }
        this.lyricObj = new LyricParser(val, this.updateLyric)
        this.lyricCurrentLine = 0
        // console.log('new lrc', this.lyricObj)

        if (!this.paused) {
          // @ts-ignore
          this.lyricObj.play()
        }
      },
      immediate: true
    }
  },
  beforeDestroy() {
    this.destroyLyric()
  },
  methods: {
    updateLyric({lineNum, txt}) {
      if (this.checkAllowUpdate && !this.checkAllowUpdate()) {
        return
      }
      // console.log('updateLyric', lineNum, txt)

      this.lyricCurrentLine = lineNum

      if (this.isLyricLock) {
        // console.log('scroll to', lineNum)
        const lrcScrollWrap = document.querySelector('.lrc-scroll-wrap')

        if (!lrcScrollWrap) {
          return
        }
        // @ts-ignore
        const halfTop = lrcScrollWrap.clientHeight / 2
        // @ts-ignore
        lrcScrollWrap.scrollTop = lrcScrollWrap.querySelector(`p[data-index="${lineNum}"]`).offsetTop - halfTop + 9
      }
    },
    destroyLyric() {
      // console.log('destroyLyric', this.lyricObj)
      if (this.lyricObj) {
        // @ts-ignore
        this.lyricObj.destroy()
        this.lyricObj = null
      }
    }
  }
}
