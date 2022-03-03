import * as React from 'react';
import {useState} from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText,
  Menu,
  MenuItem
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import {DrawerTabList} from "../enum";

const extraMenuList = [
  {label: '系统设置', icon: SettingsApplicationsIcon},
  {label: '主题切换', icon: DarkModeIcon},
  {label: '关于软件', icon: InfoIcon},
]

export default function MenuAppBar() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  const closeDrawer = () => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setDrawerOpen(false);
  };

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
            onClick={() => setDrawerOpen(true)}
          >
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
            本地云音乐
          </Typography>

          <IconButton
            size="large"
            onClick={handleMenu}
            color="inherit"
          >
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
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>雕花工艺</MenuItem>
            <MenuItem onClick={handleClose}>精雕细琢</MenuItem>
          </Menu>

        </Toolbar>
      </AppBar>

      <Drawer
        anchor='left'
        open={drawerOpen}
        onClose={closeDrawer()}
      >
        <Box
          sx={{width: 250}}
          role="presentation"
        >
          <Box sx={{
            height: 150,
            backgroundColor: 'gray',
            backgroundImage: `url('https://cn.bing.com/th?id=OHR.MoonlightRainier_ZH-CN6263832605_1920x1080.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            display: 'flex',
            alignItems: 'flex-end',
            position: 'relative'
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
              onClick={closeDrawer()}
            >
              <CloseIcon/>
            </IconButton>
            <Button
              sx={{
                padding: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%'
              }}
            >
              <Avatar>
                <PersonIcon/>
              </Avatar>
              <Box
                sx={{
                  ml: '10px',
                  color: 'white',
                  fontSize: '16px'
                }}
              >请先登录</Box>
            </Button>
          </Box>
          <Divider/>
          <List
            onClick={closeDrawer()}
            onKeyDown={closeDrawer()}
          >
            {DrawerTabList.map((item, index) => (
              <ListItem button key={item.id}>
                <ListItemIcon>
                  <item.icon/>
                </ListItemIcon>
                <ListItemText primary={item.label}/>
              </ListItem>
            ))}
          </List>
          <Divider/>
          <List>
            {extraMenuList.map((item, index) => (
              <ListItem button key={index}>
                <ListItemIcon>
                  <item.icon/>
                </ListItemIcon>
                <ListItemText primary={item.label}/>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
