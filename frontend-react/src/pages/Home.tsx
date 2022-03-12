import * as React from 'react'
import {useState} from 'react'
import {Outlet} from 'react-router-dom'
import {Box} from '@mui/material'
import GlobalDrawer from '@/components/navigation/GlobalDrawer'
import HomeBottomBar from '@/components/navigation/HomeBottomBar'
import HomeTopBar from '@/components/navigation/HomeTopBar'

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
