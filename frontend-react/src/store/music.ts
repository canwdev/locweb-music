import {makeAutoObservable} from 'mobx'
import {MusicItem} from '@/enum'

interface MusicStore {
  currentSong: MusicItem | null
}

class MusicStore {
  constructor() {
    this.currentSong = null
    makeAutoObservable(this)
  }

  setCurrentSong(val) {
    this.currentSong = val
  }
}

export const musicStore = new MusicStore()
