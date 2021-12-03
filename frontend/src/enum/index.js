import i18n from '@/lang/i18n'

// server api url
export const HOST_URL = localStorage.getItem('LOCWEB_API_HOST') || process.env.VUE_APP_API_HOST || ''

// https://github.com/Binaryify/NeteaseCloudMusicApi
export const NCM_API_URL = localStorage.getItem('LOCWEB_NCM_API_URL') || process.env.NCM_API_URL || 'https://konsole.top:9001'

export const NavbarTabsType = {
  MAIN: 1, // file list
  PLAYING: 2, // playing list
  SONGLIST: 3, // 歌单
  ALBUMS: 4,
  ARTISTS: 5,
  RECENT: 6,
  RATED: 7,
  SEARCH: 8,
  SETTINGS: 9,
  RESCAN: 10,
  DOWNLOAD: 10,
}

export const NavbarTabs = {
  [NavbarTabsType.MAIN]: {
    iconName: 'storage',
    name: i18n.t('file-system'),
    value: NavbarTabsType.MAIN,
    componentName: 'FilesystemList',
  },
  [NavbarTabsType.PLAYING]: {
    iconName: 'audiotrack',
    name: i18n.t('playlist'),
    value: NavbarTabsType.PLAYING,
    // componentName: 'PlayList',
  },
  [NavbarTabsType.SONGLIST]: {
    iconName: 'queue_music',
    name: '歌单 (Beta)',
    value: NavbarTabsType.SONGLIST,
    componentName: 'SongList',
  },
  [NavbarTabsType.ALBUMS]: {
    iconName: 'album',
    name: i18n.t('albums'),
    value: NavbarTabsType.ALBUMS,
    disabled: true
  },
  [NavbarTabsType.ARTISTS]: {
    iconName: 'mic',
    name: i18n.t('artists'),
    value: NavbarTabsType.ARTISTS,
    disabled: true
  },
  [NavbarTabsType.RECENT]: {
    iconName: 'history',
    name: i18n.t('recent'),
    value: NavbarTabsType.RECENT,
    disabled: true
  },
  [NavbarTabsType.RATED]: {
    iconName: 'stars',
    name: i18n.t('rated'),
    value: NavbarTabsType.RATED,
    disabled: true
  },
  [NavbarTabsType.SEARCH]: {
    iconName: 'search',
    name: i18n.t('search'),
    value: NavbarTabsType.SEARCH,
    disabled: true
  },
  [NavbarTabsType.DOWNLOAD]: {
    iconName: 'cloud_download',
    name: i18n.t('download'),
    value: NavbarTabsType.DOWNLOAD,
    componentName: 'DownloadView',
  },
}

export const DrawerMenuTabItems = [
  NavbarTabs[NavbarTabsType.MAIN],
  NavbarTabs[NavbarTabsType.SONGLIST],
  NavbarTabs[NavbarTabsType.ALBUMS],
  NavbarTabs[NavbarTabsType.ARTISTS],
  NavbarTabs[NavbarTabsType.RECENT],
  NavbarTabs[NavbarTabsType.RATED],
  NavbarTabs[NavbarTabsType.SEARCH],
  NavbarTabs[NavbarTabsType.DOWNLOAD],
]

export const LoopModeType = {
  NONE: 1, // Play stops after last track
  LOOP_SEQUENCE: 2, // Sequence play
  LOOP_REVERSE: 3, // Reverse play
  LOOP_SINGLE: 4, // Single cycle
  SHUFFLE: 5, // Shuffle next
}

// single song data
export class MusicItem {
  constructor(item = {}) {
    this.id = item.id
    this.title = item.title
    this.artists = item.artists || []
    this.album = item.album
    this.rating = item.rating
    this.filename = item.filename || ''
    this.isDirectory = item.isDirectory || false
    this.path = item.path || ''
    this.size = item.size
    this.metadata = item.metadata
    this.coverOrigin = item.cover
    this.isDetailLoaded = item.isDetailLoaded || false
    this.isMigrated = item.isMigrated || false // 是否完成迁移到vault
    this.isOutSource = item.isOutSource || false // 是否外链
    this.src = item.src
    this.lyric = item.lyric || ''
  }

  get artist() {
    return this.artists.join(', ')
  }

  get cover() {
    if (!this.coverOrigin) {
      return null
    }
    return `${HOST_URL}${this.coverOrigin}`
  }

  get filepath() {
    return this.path + this.filename
  }

  get fileSuffix() {
    return this.filename.split('.').pop()
  }

  get filenameDisplay() {
    if (this.title) {
      return [this.title, this.artist].join(' - ')
    }
    return this.filename
  }

  get titleDisplay() {
    return this.title || this.filename || ''
  }

  getSource() {
    if (this.src) {
      return this.src
    }
    if (!this.filepath) {
      return ''
    }
    return HOST_URL + '/mfs/' + encodeURIComponent(this.filepath)
  }

  setMetadata(metadata, cover, lyric) {
    const {
      common: {
        title,
        artists,
        album,
        // track,
      }
    } = metadata

    this.title = title
    this.artists = artists || []
    this.album = album
    this.metadata = metadata

    if (cover) {
      this.coverOrigin = cover
    }

    if (lyric) {
      this.lyric = lyric
    }

    this.isDetailLoaded = true
    console.log('setMetadata',this)
  }
}
