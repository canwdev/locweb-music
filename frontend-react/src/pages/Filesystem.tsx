import {
  Avatar,
  Breadcrumbs,
  Container,
  Divider,
  Link as LinkMui,
  ListItemAvatar,
  Paper,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Box,
} from '@mui/material'
import {Link} from 'react-router-dom'
import FolderIcon from '@mui/icons-material/Folder'
import React from 'react'

function generate(element: React.ReactElement) {
  return new Array(50).fill(0).map((value, index) =>
    React.cloneElement(element, {
      key: index,
    })
  )
}

const Filesystem = () => {
  return (
    <Container
      sx={{
        py: '10px',
      }}
      maxWidth="lg">
      <Paper elevation={3} sx={{}}>
        <Breadcrumbs sx={{padding: '16px'}} aria-label="breadcrumb">
          <LinkMui component={Link} underline="hover" color="inherit" to="/">
            MUI
          </LinkMui>
          <LinkMui component={Link} underline="hover" color="inherit" to="/">
            Core
          </LinkMui>
          <Typography color="text.primary">Breadcrumbs</Typography>
        </Breadcrumbs>
        <Divider />

        <List sx={{width: '100%', bgcolor: 'background.paper'}} component="nav">
          {generate(
            <ListItemButton>
              <ListItemAvatar>
                <Avatar>
                  <FolderIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Sent mail" />
            </ListItemButton>
          )}
        </List>
      </Paper>
    </Container>
  )
}

export default Filesystem
