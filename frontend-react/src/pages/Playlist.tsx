import * as React from 'react'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import {Container, Paper} from '@mui/material'

const Filesystem = () => {
  return (
    <Container
      sx={{
        py: '10px',
      }}
      maxWidth="lg">
      <Paper elevation={3} sx={{}}>
        <Stack spacing={1}>
          <Skeleton variant="text" />
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rectangular" width={210} height={118} />
        </Stack>
      </Paper>
    </Container>
  )
}

export default Filesystem
