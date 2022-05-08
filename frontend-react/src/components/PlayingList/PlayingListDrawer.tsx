import React, {FC, MouseEventHandler, useState} from 'react'
import {AppBar, Box, Drawer, Toolbar, Typography} from '@mui/material'
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay'
import List from '@mui/material/List'
import {musicStore} from '@/store'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import LocalPlayIcon from '@mui/icons-material/LocalPlay'
import PlayListItem from './PlayListItem'

interface Props {
  drawerOpen: boolean
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const PlayingListDrawer: FC<Props> = (props) => {
  const [mStore] = useState(musicStore)

  const {drawerOpen, setDrawerOpen} = props

  const handleListItem = (item) => {
    // console.log('[handleListItem]', item)
    const playingIndex = mStore.playingList.findIndex((i) => i.id === item.id)
    mStore.setPlayingIndex(playingIndex)
    mStore.setIsPlayNext(true)
  }
  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}>
      <Box
        sx={{
          display: 'flex',
          minWidth: '350px',
          maxWidth: '500px',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}>
        <AppBar position="absolute" color="primary" sx={{top: 0}}>
          <Toolbar>
            <LocalPlayIcon sx={{mr: 1}} />

            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
              {mStore.playingIndex} / {mStore.playingList.length}
            </Typography>

            {/*<IconButton size="large" color="inherit">
              <MoreVertIcon />
            </IconButton>*/}
          </Toolbar>
        </AppBar>
        <Box sx={{mt: '64px', mb: '64px', overflow: 'auto'}}>
          <List sx={{mb: 2}}>
            {mStore.playingList.map((item, index) => (
              <PlayListItem
                key={item.id}
                item={item}
                handleItemClick={handleListItem}
                selected={index === mStore.playingIndex}
              />
            ))}
          </List>
        </Box>
        <AppBar
          position="absolute"
          color="primary"
          sx={{top: 'auto', bottom: 0}}>
          <Toolbar>
            <PlaylistPlayIcon sx={{mr: 1}} />
            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
              Now Playing
            </Typography>

            <IconButton
              size="large"
              color="inherit"
              onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
    </Drawer>
  )
}

export default PlayingListDrawer
