export const HOST_URL = process.env.VUE_APP_API_HOST || ''

export class MusicItem {
  title: string;
  artist: string;
  album: string;
  track: string;
  year: string;
  hash: string;
  coverImage: string;
  rating: number;
  // fs directory
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

  getSource(): string {
    if (!this.filepath) {
      return ''
    }
    return HOST_URL + '/mfs/' + this.filepath
  }
}
