import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import FolderIcon from '@mui/icons-material/Folder'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import React, {FC, useMemo} from 'react'
import {FileItemType, FileType, isSupportedMusicFormat} from '@/enum'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'

interface PropsType {
  item: FileItemType
  handleItemClick: (item: FileItemType, fileType: FileType) => void
}

const FileItem: FC<PropsType> = (props) => {
  const {item, handleItemClick} = props

  const fileType = useMemo(() => {
    if (item.isDirectory) {
      return FileType.DIR
    }
    if (isSupportedMusicFormat(item.filename)) {
      return FileType.MUSIC
    }
    return FileType.OTHER
  }, [item.filename])

  const IconComponent = useMemo(() => {
    switch (fileType) {
      case FileType.DIR:
        return <FolderIcon />
      case FileType.MUSIC:
        return <MusicNoteIcon />
      default:
        return <InsertDriveFileIcon />
    }
  }, [fileType])

  return (
    <ListItemButton onClick={() => handleItemClick(item, fileType)}>
      <ListItemAvatar>
        <Avatar>{IconComponent}</Avatar>
      </ListItemAvatar>
      <ListItemText primary={item.filename} />
    </ListItemButton>
  )
}

export default FileItem
