import {makeAutoObservable} from 'mobx'
import {MusicItem} from '@/enum'

interface MusicStore {
  currentSong: MusicItem | null
  paused: boolean
  duration: number
  currentTime: number
}

class MusicStore {
  constructor() {
    this.currentSong = null
    this.paused = true
    this.duration = 0
    this.currentTime = 0
    makeAutoObservable(this)
  }

  setCurrentSong(val) {
    if (!val) {
      this.paused = true
      this.duration = 0
      this.currentTime = 0
    }
    this.currentSong = val
  }

  setPaused(val) {
    this.paused = val
  }

  setDuration(val) {
    this.duration = val
  }

  setCurrentTime(val) {
    this.currentTime = val
  }
}

export const musicStore = new MusicStore()
