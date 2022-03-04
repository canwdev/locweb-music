import React, {FC} from 'react'
import {
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import CloseIcon from '@mui/icons-material/Close'
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import InfoIcon from '@mui/icons-material/Info'
import PersonIcon from '@mui/icons-material/Person'

import {DrawerTabList} from '@/enum'
import {useNavigate} from 'react-router-dom'

const extraMenuList = [
  {label: '系统设置', icon: SettingsApplicationsIcon, key: 'settings'},
  {label: '主题切换', icon: DarkModeIcon, key: 'theme'},
  {label: '关于软件', icon: InfoIcon, key: 'about'},
]

interface Props {
  drawerOpen: boolean
  setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const GlobalDrawer: FC<Props> = (props) => {
  const navigate = useNavigate()
  const {drawerOpen, setDrawerOpen} = props

  const closeDrawer = () => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return
    }

    setDrawerOpen(false)
  }

  const handleExtraClick = (key: string) => {
    switch (key) {
      case 'settings':
        navigate('/settings')
        return
      case 'about':
        navigate('/about')
        return
      default:
        setDrawerOpen(false)
        break
    }
  }

  return (
    <Drawer anchor="left" open={drawerOpen} onClose={closeDrawer()}>
      <Box sx={{width: 250}} role="presentation">
        <Box
          sx={{
            height: 150,
            backgroundColor: 'gray',
            backgroundImage: `url('https://cn.bing.com/th?id=OHR.MoonlightRainier_ZH-CN6263832605_1920x1080.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            display: 'flex',
            alignItems: 'flex-end',
            position: 'relative',
          }}>
          <IconButton
            size="large"
            color="inherit"
            aria-label="close"
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
            }}
            onClick={closeDrawer()}>
            <CloseIcon />
          </IconButton>
          <Button
            sx={{
              padding: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              width: '100%',
            }}>
            <Avatar>
              <PersonIcon />
            </Avatar>
            <Box
              sx={{
                ml: '10px',
                color: 'white',
                fontSize: '16px',
              }}>
              请先登录
            </Box>
          </Button>
        </Box>
        <Divider />
        <List onClick={closeDrawer()} onKeyDown={closeDrawer()}>
          {DrawerTabList.map((item, index) => (
            <ListItem button key={item.id}>
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {extraMenuList.map((item, index) => (
            <ListItem
              button
              key={index}
              onClick={() => handleExtraClick(item.key)}>
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  )
}

export default GlobalDrawer
