import React, {FC, MouseEventHandler, useMemo} from 'react'
import {FileItemType, FileType, MusicItem} from '@/enum'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import MusicNoteIcon from '@mui/icons-material/MusicNote'
import ListItemText from '@mui/material/ListItemText'
import {ListItemButton} from '@mui/material'

interface Props {
  item: MusicItem
  handleItemClick: (item: FileItemType) => void
  selected: boolean
}

const PlayListItem: FC<Props> = (props) => {
  const {item, handleItemClick, selected} = props

  const artistsAlbum = useMemo(() => {
    const {artist, album} = item
    return [artist, album].join(' - ')
  }, [item.artist, item.album])
  return (
    <ListItemButton onClick={() => handleItemClick(item)} selected={selected}>
      <ListItemAvatar>
        <Avatar src={item.cover}>
          <MusicNoteIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={item.title || item.filename}
        secondary={artistsAlbum}
        primaryTypographyProps={{noWrap: true}}
        secondaryTypographyProps={{noWrap: true}}
      />
    </ListItemButton>
  )
}

export default PlayListItem
