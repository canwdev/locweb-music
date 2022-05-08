import {makeAutoObservable} from 'mobx'
import {MusicItem} from '@/enum'

interface MusicStore {
  paused: boolean
  duration: number
  currentTime: number
  isPlayNext: boolean
  playingList: Array<MusicItem>
  playingIndex: number
}

class MusicStore {
  constructor() {
    this.paused = true
    this.duration = 0
    this.currentTime = 0
    this.isPlayNext = false
    this.playingList = []
    this.playingIndex = null
    makeAutoObservable(this)
  }

  get currentSong() {
    if (this.playingIndex < 0 || !this.playingList.length) {
      return null
    }
    return this.playingList[this.playingIndex] || null
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

  setIsPlayNext(val) {
    this.isPlayNext = val
  }

  setPlayingList(val) {
    this.playingList = val
  }

  setPlayingIndex(val) {
    if (val < 0) {
      this.paused = true
      this.duration = 0
      this.currentTime = 0
    }
    this.playingIndex = val
  }
}

export const musicStore = new MusicStore()
