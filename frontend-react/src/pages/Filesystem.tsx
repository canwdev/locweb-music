import {
  Box,
  Breadcrumbs,
  Container,
  Divider,
  Link as LinkMui,
  List,
  Paper,
} from '@mui/material'
import {Link} from 'react-router-dom'
import React, {useEffect, useState} from 'react'
import IconButton from '@mui/material/IconButton'
import RefreshIcon from '@mui/icons-material/Refresh'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import {getFileList} from '@/api/music'
import {FileItemType, FileType, MusicItem} from '@/enum'
import FileItem from '@/components/filesystem/FileItem'
import {toast} from 'react-toastify'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import {useSearchParams} from 'react-router-dom'
import {useDidUpdateEffect} from '@/utils/hooks'
import LinearProgress from '@mui/material/LinearProgress'
import Fade from '@mui/material/Fade'
import {observer} from 'mobx-react-lite'
import {musicStore} from '@/store'

const Filesystem = () => {
  const [mStore] = useState(musicStore)
  const [pathList, setPathList] = useState<Array<string>>([])
  const [fileList, setFileList] = useState<Array<FileItemType>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const uniSetPathList = (newList) => {
    setSearchParams({
      dir: JSON.stringify(newList),
    })
  }

  useDidUpdateEffect(() => {
    // console.log('pathList', pathList)
    loadDir()
  }, [pathList])

  useEffect(() => {
    // console.log('searchParams updated', searchParams)
    const list = JSON.parse(searchParams.get('dir') || '[]')
    setPathList(list)
  }, [searchParams])

  const loadDir = async () => {
    try {
      setIsLoading(true)
      const {list} = (await getFileList({
        path: pathList.join('/'),
        getPlayStat: true,
      })) as any

      setFileList(list)
    } catch (e) {
      console.log(e)
      setFileList([])
    } finally {
      setIsLoading(false)
    }
  }

  const dirBack = () => {
    uniSetPathList(pathList.slice(0, pathList.length - 1))
  }

  const handleItemClick = (item, fileType) => {
    if (fileType === FileType.DIR) {
      uniSetPathList([...pathList, item.filename])
      return
    }
    if (fileType === FileType.MUSIC) {
      mStore.setCurrentSong(new MusicItem(item))
      return
    }
    if (fileType === FileType.OTHER) {
      toast.warn('格式尚未支持', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
      })

      return
    }
  }

  return (
    <Container
      sx={{
        py: '10px',
      }}
      maxWidth="lg">
      <Paper elevation={3}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
          }}>
          <Fade
            in={isLoading}
            style={{
              transitionDelay: isLoading ? '800ms' : '0ms',
            }}
            unmountOnExit>
            <LinearProgress
              sx={{position: 'absolute', left: 0, right: 0, bottom: 0}}
            />
          </Fade>

          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            sx={{padding: '16px'}}
            aria-label="breadcrumb">
            {pathList.map((path, index) => {
              const params = new URLSearchParams({
                dir: JSON.stringify(pathList.slice(0, index + 1)),
              }).toString()
              return (
                <LinkMui
                  key={index}
                  component={Link}
                  underline="hover"
                  color="inherit"
                  to={`/?${params}`}>
                  {path}
                </LinkMui>
              )
            })}
            {!pathList.length ? (
              <LinkMui
                component={Link}
                underline="hover"
                color="inherit"
                to="/">
                &nbsp;
              </LinkMui>
            ) : null}
          </Breadcrumbs>
          <Box>
            <IconButton color="inherit" sx={{mr: 2}} onClick={dirBack}>
              <ArrowUpwardIcon />
            </IconButton>
            <IconButton color="inherit" sx={{mr: 2}} onClick={loadDir}>
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>
        <Divider />
        <List sx={{width: '100%', bgcolor: 'background.paper'}} component="nav">
          {fileList.map((item) => {
            return (
              <FileItem
                key={item.id}
                item={item}
                handleItemClick={handleItemClick}
              />
            )
          })}

          {!fileList.length && !isLoading ? (
            <Box sx={{textAlign: 'center', padding: '20px'}}>
              <FolderOpenIcon />
              <Box>文件夹是空的</Box>
            </Box>
          ) : null}
        </List>
      </Paper>
    </Container>
  )
}

export default observer(Filesystem)
