import {watch, ref, computed} from 'vue'
import LyricParser from 'lyric-parser'
import {MusicItem} from "@/enum";
import store from "@/store";

export default function () {
  const lyricObj = ref(null)
  const lyricCurrentLine = ref(0)

  const lyric = computed((): MusicItem => {
    return store.getters.musicItem.lyric
  })

  const handleLyric = (...args) => {
    console.log('handleLyric', args)
  }

  watch(lyric, (val) => {
    if (!val) {
      lyricObj.value = null
      return
    }
    lyricObj.value = new LyricParser(val, handleLyric)
  })

  return {
    lyricObj,
    lyricCurrentLine
  }
}
