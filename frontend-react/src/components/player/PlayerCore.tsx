import {Paper} from '@mui/material'
import {useEffect, useState} from 'react'
import {getMusicDetail} from '@/api/music'
import {MusicItem} from '@/enum'
import {observer} from 'mobx-react-lite'
import {musicStore} from '@/store'

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
  const handleCurrentSong = async (item: MusicItem) => {
    if (!item || !item.filename) {
      updateTitle('', true)
      return
    }
    updateTitle(item.filenameDisplay)
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

  useEffect(() => {
    handleCurrentSong(mStore.currentSong)
  }, [mStore.currentSong])

  return (
    <Paper
      sx={{
        position: 'fixed',
        top: 0,
        left: '50%',
        zIndex: 100000,
        padding: '10px',
      }}>
      <audio src=""></audio>
    </Paper>
  )
}

export default observer(PlayerCore)
