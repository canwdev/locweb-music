import * as React from 'react'
import {FC, MouseEventHandler} from 'react'
import {AppBar, Menu, MenuItem, Toolbar, Typography} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import MoreVertIcon from '@mui/icons-material/MoreVert'

interface Props {
  onMenuIconClick: MouseEventHandler<HTMLButtonElement>
}

const HomeTopBar: FC<Props> = (props) => {
  const {onMenuIconClick} = props
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{mr: 2}}
          onClick={onMenuIconClick}>
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
  )
}

export default HomeTopBar
