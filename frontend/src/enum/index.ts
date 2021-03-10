import {IAudioMetadata, ICommonTagsResult}  from 'music-metadata/lib/type'

// server api url
export const HOST_URL = process.env.VUE_APP_API_HOST || '';

// navbar tab index
export const NavbarTabsEnum = {
  MAIN: 1, // showing main list
  PLAYING: 2, // showing playing list
}

export const LoopModeEnum = {
  NONE: 1, // play stops after last track
  LOOP_SEQUENCE: 2, // Sequence play
  LOOP_REVERSE: 3,  // Reverse play
  LOOP_SINGLE: 4, // Single cycle
}

// single song data
export class MusicItem {
  id: number;
  title?: string;
  artist?: string;
  album?: string;
  track?: object;
  rating: number;
  // below are data for filesystem or directories
  filename: string;
  isDirectory: boolean;
  path: string;
  size: number;
  metadata: IAudioMetadata;
  cover?: string;
  isDetailLoaded: boolean;
  lyric?: string;

  constructor(item: any = {}) {
    this.id = item.id
    this.title = item.title
    this.artist = item.artist
    this.album = item.album
    this.track = item.track
    this.rating = item.rating
    this.filename = item.filename
    this.isDirectory = item.isDirectory
    this.path = item.path
    this.size = item.size
    this.metadata = item.metadata
    this.cover = item.cover
    this.isDetailLoaded = false
  }

  get filepath() {
    return this.path + this.filename
  }

  getDisplayTitle(): string {
    if (this.title) {
      return [this.title, this.artist].join(' - ')
    }
    return this.filename
  }

  getSource(): string {
    if (!this.filepath) {
      return ''
    }
    return HOST_URL + '/mfs/' + this.filepath
  }

  setMetadata(metadata: IAudioMetadata, cover?: string|undefined|null, lyric?: string|undefined) {
    const {common: {
      title,
      artist,
      album,
      track,
    }}: {common: ICommonTagsResult} = metadata

    this.title = title
    this.artist = artist
    this.album = album
    this.track = track
    this.metadata = metadata

    if (cover) {
      this.cover = `${HOST_URL}${cover}`
    }

    if (lyric) {
      this.lyric = lyric
    }

    this.isDetailLoaded = true
  }
}
