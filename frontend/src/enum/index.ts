export const HOST_URL = process.env.VUE_APP_API_HOST || ''

export class MusicItem {
  title: string;
  artist: string;
  album: string;
  track: string;
  year: string;
  hash: string;
  coverImage: string;
  filepath: string;
  rating: number;

  constructor(item: any = {}) {
    this.title = item.title
    this.artist = item.artist
    this.album = item.album
    this.track = item.track
    this.year = item.year
    this.hash = item.hash
    this.coverImage = item.coverImage
    this.filepath = item.filepath
    this.rating = item.rating
  }

  getSource(): string {
    if (!this.filepath) {
      return ''
    }
    return HOST_URL + '/mfs/' + this.filepath
  }
}
