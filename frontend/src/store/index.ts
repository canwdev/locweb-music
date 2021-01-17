import {createStore} from 'vuex'
import {MusicItem} from "@/enum";
import {NavbarTabsEnum, LoopModeEnum} from "@/enum";
import {shuffleArray} from "@/utils";
import bus, {
  ACTION_TOGGLE_PLAY,
} from "@/utils/bus";

const playlist: Array<MusicItem> = [];
const playlistBackup: Array<MusicItem> = [];

export default createStore({
  state: {
    musicItem: new MusicItem(), // current playing music
    navbarTab: NavbarTabsEnum.MAIN, // navbar index
    playlist, // current playing list
    playlistBackup, // backup original list from random mode
    playingIndex: 0, // playing music index in playlist
    playingIndexBackup: 0, // backup original index from random mode
    paused: true, // is current playing paused
    isRandom: false, // is random choose next song to play
    loopMode: LoopModeEnum.LOOP_SEQUENCE // music playing loop mode
  },
  getters: {
    musicItem: state => state.musicItem,
    navbarTab: state => state.navbarTab,
    playlist: state => state.playlist,
    playingIndex: state => state.playingIndex,
    paused: state => state.paused,
    isRandom: state => state.isRandom,
    loopMode: state => state.loopMode,
  },
  mutations: {
    setMusicItem: (state, payload: MusicItem) => {
      state.musicItem = payload
    },
    setNavbarTab: (state, payload: number) => {
      state.navbarTab = payload
    },
    setPlaylist: (state, payload: Array<MusicItem>) => {
      state.playlistBackup = [...state.playlist]
      state.playlist = payload
    },
    restorePlaylist: (state) => {
      state.playlist = state.playlistBackup
      state.playlistBackup = []
    },
    setPlayingIndex: (state, payload: number) => {
      state.playingIndex = payload
    },
    setPaused: (state, payload: boolean) => {
      state.paused = payload
    },
    setShuffle(state) {
      // @ts-ignore
      this.commit('setPlaylist', shuffleArray(state.playlist))

      state.playingIndexBackup = state.playingIndex
      state.playingIndex = 0
      state.musicItem = state.playlist[0]
      setTimeout(() => {
        bus.emit(ACTION_TOGGLE_PLAY)
      }, 0)
      state.isRandom = true
    },
    setShuffleRestore(state) {
      // @ts-ignore
      this.commit('restorePlaylist')

      state.playingIndex = state.playingIndexBackup
      state.musicItem = state.playlist[state.playingIndex]
      setTimeout(() => {
        bus.emit(ACTION_TOGGLE_PLAY)

      }, 0)
      state.isRandom = false
    },
    clearShuffle(state) {
      state.playlistBackup = []
      state.playingIndex = state.playingIndexBackup = 0
      state.isRandom = false
    },
    setIsRandom(state, payload: boolean) {
      state.isRandom = payload
    },
    setLoopMode: (state, payload: number) => {
      state.loopMode = payload
    }
  },
  actions: {},
  modules: {}
})
