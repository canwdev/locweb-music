import React from 'react';
import ReactDOM from 'react-dom';
import './style/base.scss';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import RoutesComponent from "./Routes";
import {BrowserRouter as Router} from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <RoutesComponent/>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
