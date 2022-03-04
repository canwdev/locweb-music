import * as React from 'react'
import {FC} from 'react'
import {AppBar, Toolbar, Typography} from '@mui/material'
import {useNavigate} from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

interface Props {
  title: string
  navigatePath: string
}

const CommonAppBar: FC<Props> = (props) => {
  const navigate = useNavigate()
  const {title, navigatePath} = props

  return (
    <AppBar position="sticky">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{mr: 2}}
          onClick={() => {
            navigate(navigatePath)
          }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
CommonAppBar.defaultProps = {
  navigatePath: '/',
}

export default CommonAppBar
