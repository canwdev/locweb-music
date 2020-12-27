import { createStore } from 'vuex'
import { MusicItem } from "@/enum";

export default createStore({
  state: {
    musicItem: new MusicItem(),
    paused: true
  },
  getters: {
    musicItem: state => state.musicItem,
    paused: state => state.paused,
  },
  mutations: {
    setCurrentMusic: (state, payload: MusicItem) => {
      console.log('setCurrent', payload)
      state.musicItem = payload
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
