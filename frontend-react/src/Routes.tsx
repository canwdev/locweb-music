import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Page404 from './pages/Page404'
import Filesystem from './pages/Filesystem'
import Playlist from './pages/Playlist'
import Download from './pages/Download'

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}>
        <Route index element={<Filesystem />} />
        <Route path="playlist" element={<Playlist />} />
        <Route path="download" element={<Download />} />
      </Route>
      <Route path="/about" element={<About />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  )
}

export default RoutesComponent
