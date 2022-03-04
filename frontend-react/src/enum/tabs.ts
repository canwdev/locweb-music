import StorageIcon from '@mui/icons-material/Storage'
import QueueMusicIcon from '@mui/icons-material/QueueMusic'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'

export enum DrawerTabId {
  FS,
  PLAYLIST,
  DOWNLOAD,
}

export const DrawerTabList = [
  {id: DrawerTabId.FS, label: '文件系统', icon: StorageIcon},
  {id: DrawerTabId.PLAYLIST, label: '播放列表', icon: QueueMusicIcon},
  {id: DrawerTabId.DOWNLOAD, label: '音乐下载', icon: CloudDownloadIcon},
]
