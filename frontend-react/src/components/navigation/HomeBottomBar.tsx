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
import bgImage from '@/assets/image/bg.jpg'
import {observer} from 'mobx-react-lite'
import {musicStore} from '@/store'

const HomeBottomBar: FC = (props) => {
  const [mStore] = useState(musicStore)
  const {currentSong} = mStore
  const [anchorVolumeEl, setAnchorVolumeEl] =
    React.useState<null | HTMLElement>(null)
  const [volume, setVolume] = React.useState(100)

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue)
  }

  const showVolumeMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorVolumeEl(event.currentTarget)
  }

  const hideVolumeMenu = () => {
    setAnchorVolumeEl(null)
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
          <Box>0:00</Box>
          <Slider size="small" defaultValue={0} valueLabelDisplay="auto" />
          <Box>0:00</Box>
        </Stack>
      </Paper>
      <Toolbar sx={{position: 'relative'}}>
        <Box sx={{flexGrow: 0, display: 'flex', alignItems: 'center'}}>
          <IconButton size="large" color="inherit" sx={{p: 0}}>
            {currentSong ? (
              <Avatar src={currentSong.cover} variant="square">
                A
              </Avatar>
            ) : (
              <Avatar variant="square" />
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
          <IconButton color="inherit" aria-label="previous">
            <SkipPreviousIcon />
          </IconButton>
          <IconButton color="inherit" aria-label="play/pause">
            <PlayArrowIcon sx={{height: 38, width: 38}} />
          </IconButton>
          <IconButton color="inherit" aria-label="next">
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

        <IconButton size="large" color="inherit">
          <PlaylistPlayIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default observer(HomeBottomBar)
