import * as React from 'react'
import {useState} from 'react'
import {Outlet} from 'react-router-dom'
import {Box} from '@mui/material'
import GlobalDrawer from '@/components/Navigation/GlobalDrawer'
import HomeBottomBar from '@/components/Navigation/HomeBottomBar'
import HomeTopBar from '@/components/Navigation/HomeTopBar'

export default function MenuAppBar() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <Box
      sx={{
        flexGrow: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <HomeTopBar onMenuIconClick={() => setDrawerOpen(true)} />
      <GlobalDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />

      <Box sx={{flexGrow: 1, overflow: 'auto'}}>
        <Outlet />
      </Box>

      <HomeBottomBar />
    </Box>
  )
}
