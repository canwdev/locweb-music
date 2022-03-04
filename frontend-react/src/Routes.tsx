import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Page404 from './pages/Page404'

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  )
}

export default RoutesComponent
