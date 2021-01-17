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
  title: string;
  artist: string;
  album: string;
  track: string;
  year: string;
  hash: string; // song unique hash from backend
  coverImage: string;
  rating: number;
  // below are data for filesystem or directories
  filename: string;
  isDirectory: boolean;
  path: string;
  size: number;

  constructor(item: any = {}) {
    this.title = item.title
    this.artist = item.artist
    this.album = item.album
    this.track = item.track
    this.year = item.year
    this.hash = item.hash
    this.coverImage = item.coverImage
    this.rating = item.rating
    this.filename = item.filename
    this.isDirectory = item.isDirectory
    this.path = item.path
    this.size = item.size
  }

  get filepath() {
    return this.path + this.filename
  }

  getWebTitle(): string {
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
}
