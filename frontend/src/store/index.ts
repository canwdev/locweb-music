import { createStore } from 'vuex'
import { MusicItem } from "@/enum";

const playlist: Array<MusicItem> = [];

export default createStore({
  state: {
    musicItem: new MusicItem(),
    isPlaylistTab: false,
    playlist,
    playingIndex: 0,
    paused: true
  },
  getters: {
    musicItem: state => state.musicItem,
    isPlaylistTab: state => state.isPlaylistTab,
    playlist: state => state.playlist,
    playingIndex: state => state.playingIndex,
    paused: state => state.paused,
  },
  mutations: {
    setMusicItem: (state, payload: MusicItem) => {
      console.log('setCurrent', payload)
      state.musicItem = payload
    },
    setIsPlaylistTab: (state, payload: boolean) => {
      console.log('setIsPlaylist', payload)
      state.isPlaylistTab = payload
    },
    setPlaylist: (state, payload: Array<MusicItem>) => {
      console.log('setPlaylist', payload)
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
