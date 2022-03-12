import {HOST_URL} from '@/enum/service'

export enum LoopModeType {
  NONE = 1, // Play stops after last track
  LOOP_SEQUENCE = 2, // Sequence play
  LOOP_REVERSE = 3, // Reverse play
  LOOP_SINGLE = 4, // Single cycle
  SHUFFLE = 5, // Shuffle next
}

export interface MusicItem {
  id: number
  title: string
  artists: Array<string>
  album: string
  rating: number
  filename: string
  isDirectory: boolean
  path: string
  size: string
  metadata: object
  coverOrigin: string
  isDetailLoaded: boolean
  isMigrated: boolean
  isOutSource: boolean
  isChecked: boolean
  src: string
  lyric: string
}

export class MusicItem {
  constructor(props: any = {}) {
    this.id = props.id
    this.title = props.title
    this.artists = props.artists || []
    this.album = props.album
    this.rating = props.rating
    this.filename = props.filename || ''
    this.isDirectory = props.isDirectory || false
    this.path = props.path || ''
    this.size = props.size
    this.metadata = props.metadata
    this.coverOrigin = props.cover
    this.isDetailLoaded = props.isDetailLoaded || false
    this.isMigrated = props.isMigrated || false // 是否完成迁移到vault
    this.isOutSource = props.isOutSource || false // 是否外链
    this.isChecked = props.isChecked || false
    this.src = props.src
    this.lyric = props.lyric || ''
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
      return [this.artist, this.title].join(' - ')
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
      },
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
    console.log('setMetadata', this)
  }
}
