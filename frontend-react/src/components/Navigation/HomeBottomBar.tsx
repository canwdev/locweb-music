import * as React from 'react'
import {FC, useEffect, useState} from 'react'
import {AppBar, Avatar, Box, Paper, Toolbar} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import Popover from '@mui/material/Popover'
import Stack from '@mui/material/Stack'
import VolumeUp from '@mui/icons-material/VolumeUp'
import Slider from '@mui/material/Slider'
import VolumeDown from '@mui/icons-material/VolumeDown'
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay'
import {observer} from 'mobx-react-lite'
import {musicStore} from '@/store'
import {formatTimeHMS} from '@/utils'
import PauseIcon from '@mui/icons-material/Pause'
import PlayingListDrawer from '@/components/PlayingList/PlayingListDrawer'
import {musicBus, MusicBusEvents} from '@/enum'
import MusicNoteIcon from '@mui/icons-material/MusicNote'

const playIconSx = {height: 38, width: 38}

const HomeBottomBar: FC = (props) => {
  const [mStore] = useState(musicStore)
  const {currentSong} = mStore
  const [anchorVolumeEl, setAnchorVolumeEl] =
    React.useState<null | HTMLElement>(null)
  const [volume, setVolume] = React.useState(100)
  const [showPlayingList, setShowPlayingList] = useState(false)

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue)
  }

  const showVolumeMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorVolumeEl(event.currentTarget)
  }

  const hideVolumeMenu = () => {
    setAnchorVolumeEl(null)
  }

  const handleSliderChange = (e) => {
    musicBus.emit(MusicBusEvents.SET_CURRENT_TIME, e.target.value)
  }

  const togglePlay = () => {
    if (mStore.paused) {
      musicBus.emit(MusicBusEvents.PLAY)
    } else {
      musicBus.emit(MusicBusEvents.PAUSE)
    }
  }

  const goPrevious = () => {
    musicBus.emit(MusicBusEvents.GO_PREVIOUS)
  }

  const goNext = () => {
    musicBus.emit(MusicBusEvents.GO_NEXT)
  }

  const logData = () => {
    console.log('[logData]', mStore)
  }

  return (
    <AppBar position="sticky" color="primary" sx={{top: 'auto', bottom: 0}}>
      <Paper
        sx={{
          px: '25px',
          display: 'flex',
          borderRadius: 0,
        }}>
        <Stack
          spacing={2}
          direction="row"
          alignItems="center"
          sx={{width: '100%'}}>
          <Box>{formatTimeHMS(mStore.currentTime)}</Box>
          <Slider
            size="small"
            max={mStore.duration}
            value={mStore.currentTime}
            valueLabelDisplay="auto"
            valueLabelFormat={formatTimeHMS}
            onChange={handleSliderChange}
          />
          <Box>{formatTimeHMS(mStore.duration)}</Box>
        </Stack>
      </Paper>
      <Toolbar sx={{position: 'relative'}}>
        <Box sx={{flexGrow: 0, display: 'flex', alignItems: 'center'}}>
          <IconButton
            onClick={logData}
            size="large"
            color="inherit"
            sx={{p: 0}}>
            {currentSong ? (
              <Avatar src={currentSong.cover}>
                <MusicNoteIcon />
              </Avatar>
            ) : (
              <Avatar>
                <MusicNoteIcon />
              </Avatar>
            )}
          </IconButton>
        </Box>

        <Stack
          spacing={1}
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{
            flexGrow: 1,
          }}>
          <IconButton color="inherit" aria-label="volume">
            <ShuffleIcon />
          </IconButton>
          <IconButton
            onClick={goPrevious}
            color="inherit"
            aria-label="previous">
            <SkipPreviousIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="play/pause"
            onClick={togglePlay}>
            {mStore.paused ? (
              <PlayArrowIcon sx={playIconSx} />
            ) : (
              <PauseIcon sx={playIconSx} />
            )}
          </IconButton>
          <IconButton onClick={goNext} color="inherit" aria-label="next">
            <SkipNextIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="volume"
            onClick={showVolumeMenu}>
            <VolumeUpIcon />
          </IconButton>

          <Popover
            open={Boolean(anchorVolumeEl)}
            anchorEl={anchorVolumeEl}
            onClose={hideVolumeMenu}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}>
            <Box sx={{padding: '15px'}}>
              <Stack spacing={2} alignItems="center" sx={{height: 200}}>
                <VolumeUp />
                <Slider
                  size="small"
                  aria-label="Volume"
                  orientation="vertical"
                  value={volume}
                  valueLabelDisplay="auto"
                  onChange={handleVolumeChange}
                />
                <VolumeDown />
              </Stack>
            </Box>
          </Popover>
        </Stack>

        <IconButton
          size="large"
          color="inherit"
          onClick={() => setShowPlayingList(true)}>
          <PlaylistPlayIcon />
        </IconButton>
      </Toolbar>

      <PlayingListDrawer
        drawerOpen={showPlayingList}
        setDrawerOpen={setShowPlayingList}
      />
    </AppBar>
  )
}

export default observer(HomeBottomBar)
