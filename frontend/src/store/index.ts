import { createStore } from 'vuex'
import { MusicItem } from "@/enum";
import {NavbarTabsEnum} from "@/enum";

const playlist: Array<MusicItem> = [];

export default createStore({
  state: {
    musicItem: new MusicItem(),
    navbarTab: NavbarTabsEnum.MAIN,
    playlist,
    playingIndex: 0,
    paused: true
  },
  getters: {
    musicItem: state => state.musicItem,
    navbarTab: state => state.navbarTab,
    playlist: state => state.playlist,
    playingIndex: state => state.playingIndex,
    paused: state => state.paused,
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
    }
  },
  actions: {
  },
  modules: {
  }
})
