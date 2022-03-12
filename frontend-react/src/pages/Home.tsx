import * as React from 'react'
import {Outlet} from 'react-router-dom'
import {
  AppBar,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {useState} from 'react'
import GlobalDrawer from '@/components/navigation/GlobalDrawer'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import Popover from '@mui/material/Popover'
import Stack from '@mui/material/Stack'
import Slider from '@mui/material/Slider'
import VolumeDown from '@mui/icons-material/VolumeDown'
import VolumeUp from '@mui/icons-material/VolumeUp'

export default function MenuAppBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [anchorVolumeEl, setAnchorVolumeEl] =
    React.useState<null | HTMLElement>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [volume, setVolume] = React.useState(100)

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue)
  }

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const showVolumeMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorVolumeEl(event.currentTarget)
  }

  const hideVolumeMenu = () => {
    setAnchorVolumeEl(null)
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{mr: 2}}
            onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
            本地云音乐
          </Typography>

          <IconButton size="large" onClick={handleMenu} color="inherit">
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}>
            <MenuItem onClick={handleClose}>雕花工艺</MenuItem>
            <MenuItem onClick={handleClose}>精雕细琢</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <GlobalDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />

      <Box sx={{flexGrow: 1, overflow: 'auto'}}>
        <Outlet />
      </Box>

      <AppBar position="sticky" color="primary" sx={{top: 'auto', bottom: 0}}>
        <Toolbar>
          <Box sx={{flexGrow: 0, display: 'flex', alignItems: 'center'}}>
            <IconButton size="large" color="inherit" sx={{p: 0}}>
              <Avatar>A</Avatar>
            </IconButton>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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
                    aria-label="Volume"
                    orientation="vertical"
                    value={volume}
                    onChange={handleVolumeChange}
                  />
                  <VolumeDown />
                </Stack>
              </Box>
            </Popover>
          </Box>

          <IconButton size="large" color="inherit">
            <PlaylistPlayIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
