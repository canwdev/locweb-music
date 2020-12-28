import { createStore } from 'vuex'
import { MusicItem } from "@/enum";
import {NavbarTabsEnum, LoopModeEnum} from "@/enum";

const playlist: Array<MusicItem> = [];

export default createStore({
  state: {
    musicItem: new MusicItem(), // current playing music
    navbarTab: NavbarTabsEnum.MAIN, // navbar index
    playlist, // current playing list
    playingIndex: 0, // playing music index in playlist
    paused: true, // is current playing paused
    isRandom: false, // is random choose next song to play
    loopMode: LoopModeEnum.SEQUENCE // music playing loop mode
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
      state.playlist = payload
    },
    updatePlaylist: (state, payload: MusicItem) => {
      // TODO state.playlist =
    },
    setPlayingIndex: (state, payload: number) => {
      state.playingIndex = payload
    },
    setPaused: (state, payload: boolean) => {
      state.paused = payload
    },
    setIsRandom: (state, payload: boolean) => {
      state.isRandom = payload
    },
    setLoopMode: (state, payload: number) => {
      state.loopMode = payload
    }
  },
  actions: {
  },
  modules: {
  }
})
