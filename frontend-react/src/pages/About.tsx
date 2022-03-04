import {
  Avatar,
  Box,
  Container,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material'
import CommonAppBar from '../components/navigation/CommonAppBar'
import * as React from 'react'
import {useEffect, useState} from 'react'
import {getServerInfo} from '@/api/service'
import InfoIcon from '@mui/icons-material/Info'

const paperStyle = {
  my: '20px',
}

const About = () => {
  const [text, setText] = useState('Loading...')
  const [list, setList] = useState<Array<any>>([])

  useEffect(() => {
    getServerInfo().then((res: any) => {
      console.log(res)
      const {changelog, package: pkg} = res
      setText(changelog)
      const li = []
      for (const key in pkg) {
        li.push({
          key: key.toUpperCase(),
          value: pkg[key],
        })
      }
      setList(li)
    })
  }, [])

  return (
    <Box sx={{flexGrow: 1}}>
      <CommonAppBar title="关于软件" navigatePath="/" />

      <Container
        sx={{
          py: '10px',
        }}
        maxWidth="sm">
        <Paper elevation={3} sx={paperStyle}>
          <List>
            {list.map((item, index) => {
              return (
                <React.Fragment key={item.key}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <InfoIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={item.key} secondary={item.value} />
                  </ListItem>
                  {index + 1 !== list.length && <Divider />}
                </React.Fragment>
              )
            })}
          </List>
        </Paper>
        <Paper
          elevation={3}
          sx={{
            ...paperStyle,
            padding: '16px',
            whiteSpace: 'pre-wrap',
          }}>
          {text}
        </Paper>
      </Container>
    </Box>
  )
}

export default About
