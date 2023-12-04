import {BackendFileItem} from '@/enum/file'
import {API_PROXY_BASE} from '@/enum/index'
import {getDetail} from '@/api/music'

export interface MusicItem {
  fileInfo: BackendFileItem
  title: string
  artists: string[]
  album: string
  cover: string
  lyric: string
  // getters:
  src: string
  titleDisplay: string
  artisDisplay: string
  allMetadata: any
}

export class MusicItem {
  constructor(data: BackendFileItem) {
    this.fileInfo = data
  }

  // 真实文件地址
  get src() {
    return API_PROXY_BASE + '/mfs' + this.fileInfo.path + this.fileInfo.filename
  }

  get titleDisplay() {
    return this.title || this.filename || ''
  }

  get artisDisplay() {
    return (this.artists || []).join(', ')
  }

  async fetchDetail() {
    const detail = await getDetail({
      path: this.fileInfo.path,
      filename: this.fileInfo.filename,
    })
    this.cover = API_PROXY_BASE + detail.cover
    this.lyric = detail.lyric || ''

    const {metadata} = detail
    this.title = metadata.common.title || ''
    this.artists = metadata.common.artists || []
    this.album = metadata.common.album || ''

    this.allMetadata = metadata
  }
}
