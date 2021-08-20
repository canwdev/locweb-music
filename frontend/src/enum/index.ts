import {IAudioMetadata, ICommonTagsResult} from 'music-metadata/lib/type'
import VueI18n from '../lang/i18n'

const {t} = VueI18n.global

// server api url
export const HOST_URL = localStorage.getItem('LOCWEB_API_HOST') || process.env.VUE_APP_API_HOST || '';

// https://github.com/Binaryify/NeteaseCloudMusicApi
export const NCM_API_URL = localStorage.getItem('LOCWEB_NCM_API_URL') || process.env.NCM_API_URL || 'https://konsole.top:9001'

export enum NavbarTabsType {
  MAIN = 1, // file list
  PLAYING = 2, // playing list
  PLAYLIST = 3, // playlist
  ALBUMS = 4,
  ARTISTS = 5,
  RECENT = 6,
  RATED = 7,
  SEARCH = 8,
  SETTINGS = 9,
  RESCAN = 10,
  DOWNLOAD = 10,
}

export const NavbarTabs = {
  [NavbarTabsType.MAIN]: {
    icon: 'storage',
    name: t('file-system'),
    value: NavbarTabsType.MAIN,
    componentName: 'ListFilesystem',
  },
  [NavbarTabsType.PLAYING]: {
    icon: 'audiotrack',
    name: t('playing'),
    value: NavbarTabsType.PLAYING,
    // componentName: 'ListPlaying',
  },
  [NavbarTabsType.PLAYLIST]: {
    icon: 'queue_music',
    name: t('playlist') + ' (Beta)',
    value: NavbarTabsType.PLAYLIST,
    componentName: 'ListTreePlaylist/index',
  },
  [NavbarTabsType.ALBUMS]: {
    icon: 'album',
    name: t('albums'),
    value: NavbarTabsType.ALBUMS,
    disabled: true
  },
  [NavbarTabsType.ARTISTS]: {
    icon: 'mic',
    name: t('artists'),
    value: NavbarTabsType.ARTISTS,
    disabled: true
  },
  [NavbarTabsType.RECENT]: {
    icon: 'history',
    name: t('recent'),
    value: NavbarTabsType.RECENT,
    disabled: true
  },
  [NavbarTabsType.RATED]: {
    icon: 'stars',
    name: t('rated'),
    value: NavbarTabsType.RATED,
    disabled: true
  },
  [NavbarTabsType.SEARCH]: {
    icon: 'search',
    name: t('search'),
    value: NavbarTabsType.SEARCH,
    disabled: true
  },
  [NavbarTabsType.DOWNLOAD]: {
    icon: 'cloud_download',
    name: t('download'),
    value: NavbarTabsType.DOWNLOAD,
    componentName: 'DownloadView/index',
  },
}

export const DrawerMenuTabItems = [
  NavbarTabs[NavbarTabsType.MAIN],
  NavbarTabs[NavbarTabsType.PLAYLIST],
  NavbarTabs[NavbarTabsType.ALBUMS],
  NavbarTabs[NavbarTabsType.ARTISTS],
  NavbarTabs[NavbarTabsType.RECENT],
  NavbarTabs[NavbarTabsType.RATED],
  NavbarTabs[NavbarTabsType.SEARCH],
  NavbarTabs[NavbarTabsType.DOWNLOAD],
]

export enum LoopModeType {
  NONE = 1, // Play stops after last track
  LOOP_SEQUENCE = 2, // Sequence play
  LOOP_REVERSE = 3,  // Reverse play
  LOOP_SINGLE = 4, // Single cycle
  SHUFFLE = 5, // Shuffle next
}

export enum NavBarIndex {
  LEFT = 0,
  RIGHT = 1
}

// single song data
export class MusicItem {
  id: number;
  title?: string;
  artists: string[];
  album?: string;
  // track?: any;
  rating: number;
  // below are data for filesystem or directories
  filename: string;
  isDirectory: boolean;
  path: string;
  size: number;
  metadata: IAudioMetadata;
  coverOrigin?: string;
  isDetailLoaded: boolean;
  lyric?: string;
  isOutSource: boolean;
  src?: string;

  constructor(item: any = {}) {
    this.id = item.id
    this.title = item.title
    this.artists = item.artists || []
    this.album = item.album
    this.rating = item.rating
    this.filename = item.filename || ''
    this.isDirectory = item.isDirectory
    this.path = item.path || ''
    this.size = item.size
    this.metadata = item.metadata
    this.coverOrigin = item.cover
    this.isDetailLoaded = false
    this.isOutSource = item.isOutSource
    this.src = item.src
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

  get filenameDisplay(): string {
    if (this.title) {
      return [this.title, this.artist].join(' - ')
    }
    return this.filename
  }

  get titleDisplay(): string {
    return this.title || this.filename || ''
  }

  getSource(): string {
    if (this.src) {
      return this.src
    }
    if (!this.filepath) {
      return ''
    }
    return HOST_URL + '/mfs/' + encodeURIComponent(this.filepath)
  }

  setMetadata(metadata: IAudioMetadata, cover?: string | undefined | null, lyric?: string | undefined) {
    const {
      common: {
        title,
        artists,
        album,
        // track,
      }
    }: { common: ICommonTagsResult } = metadata

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
  }
}
