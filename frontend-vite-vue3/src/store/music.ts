import {MusicItem} from '@/enum/music'

type IStore = {
  musicItem: MusicItem | null
  playingList: MusicItem[]
  playlistBackup: MusicItem[]
  playingIndex: number
  playingIndexBackup: number
  paused: boolean
  isRandom: boolean
  currentTime: number
  duration: number
  playbackRate: number
  stopCountdown: any // setTimeout timer
}

export const useMusicStore = defineStore('music', {
  state: (): IStore => {
    return {
      musicItem: new MusicItem(),
      playingList: [], // current playing list
      playlistBackup: [], // backup original list from random mode
      playingIndex: 0, // playing music index in playingList
      playingIndexBackup: 0, // backup original index from random mode
      paused: true, // is current playing paused
      isRandom: false, // is random choose next song to play
      currentTime: 0,
      duration: 0,
      playbackRate: 1,
      stopCountdown: null,
    }
  },
  actions: {
    clearShuffle() {
      this.playlistBackup = []
      this.playingIndex = this.playingIndexBackup = 0
      this.isRandom = false
    },
  },
})
