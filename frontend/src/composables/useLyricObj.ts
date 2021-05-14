import {watch, ref, computed, onBeforeUnmount} from 'vue'
import LyricParser from '@/utils/lyric-parser'
import store from "@/store";

export default function (config: any = {}) {
  const {
    checkAllowUpdate // check if need update lyric before execute
  } = config
  const lyricObj = ref<null | LyricParser>(null)
  const lyricCurrentLine = ref(0)
  const isLyricLock = ref(true)

  const lyric = computed(() => {
    return store.state.musicItem.lyric
  })
  const paused = computed(() => {
    return store.state.paused
  })

  /**
   * Update lyric scroll
   * @param lineNum
   * @param txt
   */
  const updateLyric = ({lineNum, txt}) => {
    if (checkAllowUpdate && !checkAllowUpdate()) {
      return
    }
    // console.log('updateLyric', lineNum, txt)

    lyricCurrentLine.value = lineNum

    if (isLyricLock.value) {
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
  }

  watch(paused, (val) => {
    if (!lyricObj.value) {
      return
    }
    if (val) {
      lyricObj.value.pause()
    } else {
      lyricObj.value.play()
    }
  })

  const destroyLyric = () => {
    // console.log('destroyLyric', lyricObj.value)
    if (lyricObj.value) {
      // @ts-ignore
      lyricObj.value.destroy()
      lyricObj.value = null
    }
  }

  watch(lyric, (val) => {
    if (lyricObj.value) {
      destroyLyric()
    }
    if (!val) {
      return
    }
    lyricObj.value = new LyricParser(val, updateLyric)
    lyricCurrentLine.value = 0
    // console.log('new lrc', lyricObj.value)

    if (!paused.value) {
      // @ts-ignore
      lyricObj.value.play()
    }
  })

  onBeforeUnmount(() => {
    destroyLyric()
  })

  return {
    lyricObj,
    lyricCurrentLine,
    isLyricLock
  }
}
