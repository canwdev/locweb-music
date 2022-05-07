import React from 'react'
import ReactDOM from 'react-dom'
import CssBaseline from '@mui/material/CssBaseline'
import './style/base.scss'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import RoutesComponent from './Routes'
import {HashRouter as Router} from 'react-router-dom'
import {Slide, ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import PlayerCore from '@/components/Player/PlayerCore'

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <Router>
      <RoutesComponent />
    </Router>
    <PlayerCore />
    <ToastContainer theme="colored" transition={Slide} />
  </React.StrictMode>,
  document.getElementById('root')
)
