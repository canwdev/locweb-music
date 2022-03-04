import * as React from 'react'
import {Outlet} from 'react-router-dom'
import {AppBar, Box, Menu, MenuItem, Toolbar, Typography} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {useState} from 'react'
import GlobalDrawer from '@/components/navigation/GlobalDrawer'

export default function MenuAppBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar position="static">
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

      <Outlet />
    </Box>
  )
}
