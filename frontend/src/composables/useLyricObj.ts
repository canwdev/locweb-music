import {watch, ref, computed} from 'vue'
import LyricParser from '@/utils/lyric-parser'
import {MusicItem} from "@/enum";
import store from "@/store";

export default function () {
  const lyricObj = ref<null | LyricParser>(null)
  const lyricCurrentLine = ref(0)

  const lyric = computed((): MusicItem => {
    return store.getters.musicItem.lyric
  })
  const paused = computed(() => {
    return store.getters.paused
  })

  const handleLyric = ({lineNum, txt}) => {
    // console.log('handleLyric', lineNum, txt)
    lyricCurrentLine.value = lineNum
  }

  watch(paused, (val) => {
    if (!lyricObj.value) {
      return
    }
    lyricObj.value.togglePlay()
  })

  watch(lyric, (val) => {
    if (!val && lyricObj.value) {
      // @ts-ignore
      lyricObj.value.stop()
      lyricObj.value = null
      return
    }
    lyricObj.value = new LyricParser(val, handleLyric)
    lyricCurrentLine.value = 0
    if (!paused.value) {
      // @ts-ignore
      lyricObj.value.play()
    }
  })

  return {
    lyricObj,
    lyricCurrentLine
  }
}
