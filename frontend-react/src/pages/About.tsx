import {AppBar, Box, Toolbar, Typography} from "@mui/material"
import IconButton from "@mui/material/IconButton";
import BackIcon from "@mui/icons-material/Back";
import * as React from "react";

const About = () => {
  return <Box sx={{flexGrow: 1}}>
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{mr: 2}}
        >
          <BackIcon/>
        </IconButton>
        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
          关于软件
        </Typography>

      </Toolbar>
    </AppBar>
  </Box>
}

export default About
