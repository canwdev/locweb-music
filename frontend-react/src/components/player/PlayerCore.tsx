import {Box} from '@mui/material'
import {useEffect, useState, useRef} from 'react'
import {getMusicDetail} from '@/api/music'
import {MusicItem} from '@/enum'
import {observer} from 'mobx-react-lite'
import {musicStore} from '@/store'
import {toast} from 'react-toastify'

const originalTitle = document.title
const updateTitle = (title, isPaused = false) => {
  if (!title) {
    document.title = originalTitle
  } else {
    document.title = `${isPaused ? '⏸️' : '▶️'} ${title}`
  }
}

const PlayerCore = () => {
  const [mStore] = useState(musicStore)
  const audioEl = useRef(null)

  useEffect(() => {
    const audio = audioEl.current
    // console.log('audioEl', audioEl.current)
    audio.addEventListener('play', () => {
      mStore.paused = false
    })

    audio.addEventListener('pause', () => {
      mStore.paused = true
    })

    audio.addEventListener('ended', () => {
      console.log('ended!!')
    })

    audio.addEventListener('canplay', (evt) => {
      mStore.duration = evt.target.duration
    })

    audio.addEventListener('timeupdate', (evt) => {
      mStore.currentTime = evt.target.currentTime
    })

    audio.addEventListener('error', (error) => {
      toast.error('音频加载失败！', {
        position: 'top-center',
        autoClose: 3000,
      })
      console.error(error)
    })
  }, [])

  useEffect(() => {
    handleCurrentSong(mStore.currentSong)
  }, [mStore.currentSong])

  const setAudioSource = (src) => {
    if (!src) {
      audioEl.current.removeAttribute('src')
    }
    audioEl.current.src = src
  }

  const handleCurrentSong = async (item: MusicItem) => {
    console.log('handleCurrentSong', item)
    if (!item || !item.filename) {
      updateTitle('', true)
      setAudioSource(null)
      return
    }
    updateTitle(item.filenameDisplay)
    setAudioSource(item.getSource())
    if (!item.isOutSource) {
      const params = {
        path: item.path,
        filename: item.filename,
        updatePlayStat: true,
      }
      if (!item.isDetailLoaded) {
        const detail = (await getMusicDetail(params)) as any
        // console.log('detail', detail)

        const {metadata, cover, lyric} = detail
        item.setMetadata(metadata, cover, lyric)
        updateTitle(item.filenameDisplay)
      } else {
        // only update play status
        await getMusicDetail({
          ...params,
          updateStatOnly: true,
        })
      }
    }
  }

  return (
    <Box>
      <audio ref={audioEl} />
    </Box>
  )
}

export default observer(PlayerCore)
