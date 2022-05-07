import {Box} from '@mui/material'
import {useEffect, useState, useRef} from 'react'
import {getMusicDetail} from '@/api/music'
import {musicBus, MusicBusEvents, MusicItem} from '@/enum'
import {observer} from 'mobx-react-lite'
import {musicStore} from '@/store'
import {toast} from 'react-toastify'
import {useDidUpdateEffect} from '@/utils/hooks'

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

    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', play)
      navigator.mediaSession.setActionHandler('pause', pause)
    }

    audio.addEventListener('play', () => {
      mStore.setPaused(false)
    })

    audio.addEventListener('pause', () => {
      mStore.setPaused(true)
    })

    audio.addEventListener('ended', () => {
      console.log('ended!!')
      mStore.setPaused(true)
    })

    audio.addEventListener('loadeddata', (evt) => {
      // console.log('loadeddata')
      if (mStore.isPlayNext) {
        play()
        mStore.setIsPlayNext(false)
      }
    })

    audio.addEventListener('canplay', (evt) => {
      mStore.setDuration(evt.target.duration)
    })

    audio.addEventListener('timeupdate', (evt) => {
      mStore.setCurrentTime(evt.target.currentTime)
    })

    audio.addEventListener('error', (error) => {
      toast.error('音频加载失败！', {
        position: 'top-center',
        autoClose: 3000,
      })
      console.error(error)
    })

    musicBus.on(MusicBusEvents.PLAY, play)
    musicBus.on(MusicBusEvents.PAUSE, pause)
    musicBus.on(MusicBusEvents.SET_CURRENT_TIME, setCurrentTime)

    return () => {
      musicBus.off(MusicBusEvents.PLAY, play)
      musicBus.off(MusicBusEvents.PAUSE, pause)
      musicBus.off(MusicBusEvents.SET_CURRENT_TIME, setCurrentTime)
    }
  }, [])

  useEffect(() => {
    handleCurrentSong(mStore.currentSong)
  }, [mStore.currentSong])

  useDidUpdateEffect(() => {
    if (mStore.currentSong) {
      updateTitle(mStore.currentSong.filenameDisplay, mStore.paused)
    }
  }, [mStore.paused])

  const setAudioSource = (src) => {
    pause()
    setTimeout(() => {
      if (!src) {
        audioEl.current.removeAttribute('src')
        return
      }
      audioEl.current.src = src
    })
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
        const detail: any = await getMusicDetail(params)
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

    // https://developers.google.com/web/updates/2017/02/media-session
    if ('mediaSession' in navigator) {
      let artwork = [
        {src: require('@/assets/images/default-cover.jpg'), sizes: '512x512'},
      ]
      if (item.cover) {
        artwork = [{src: item.cover, sizes: '512x512'}]
      }

      /* eslint-disable no-undef */
      navigator.mediaSession.metadata = new MediaMetadata({
        /* eslint-enable no-undef */
        title: item.title,
        artist: item.artist,
        album: item.album,
        artwork,
      })
    }
  }

  const play = () => {
    audioEl.current.play()
  }
  const pause = () => {
    audioEl.current.pause()
  }
  const setCurrentTime = (val) => {
    audioEl.current.currentTime = val
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '15%',
        left: '10%',
        zIndex: 100,
        opacity: 0.5,
      }}>
      <audio ref={audioEl} controls />
    </Box>
  )
}

export default observer(PlayerCore)
