import Vue from 'vue'
import Vuex from 'vuex'
import {MusicItem} from '@/enum'
import {shuffleArray} from '@/utils'
import bus, {
  ACTION_TOGGLE_PLAY,
} from '@/utils/bus'
import {
  setToken,
  getToken,
  removeToken
} from '@/utils/auth'
import {loadSettings, saveSettings} from '@/utils/settings'

Vue.use(Vuex)
const playingList = []
const playlistBackup = []

export default new Vuex.Store({
  state: {
    musicItem: new MusicItem(), // current playing music
    playingList, // current playing list
    playlistBackup, // backup original list from random mode
    playingIndex: 0, // playing music index in playingList
    playingIndexBackup: 0, // backup original index from random mode
    paused: true, // is current playing paused
    isRandom: false, // is random choose next song to play
    currentTime: 0,
    duration: 0,
    token: getToken(), // Authorization token
    settings: loadSettings(),
    playbackRate: 1,
    stopCountdown: null
  },
  getters: {
    isDarkTheme: state => state.settings.isDarkTheme,
    useSystemTheme: state => state.settings.useSystemTheme,
    navbarTab: state => state.settings.navbarTab,
    themeClass: state => state.settings.isDarkTheme ? 'bg-dark' : 'bg-light',
    themeColor: state => state.settings.themeColor,
    loopMode: state => state.settings.loopMode,
    lyric: state => state.musicItem.lyric,
  },
  mutations: {
    setMusicItem: (state, payload) => {
      if (!payload) {
        payload = new MusicItem()
        state.currentTime = 0
      }
      state.musicItem = payload
    },
    setNavbarTab(state, payload) {
      // @ts-ignore
      this.commit('updateSettings', {
        key: 'navbarTab',
        value: payload
      })
    },
    setPlayingList: (state, payload) => {
      state.playingList = payload
      state.playlistBackup = []
    },
    restorePlayingList: (state) => {
      state.playingList = state.playlistBackup
      state.playlistBackup = []
    },
    setPlayingIndex: (state, payload) => {
      state.playingIndex = payload
    },
    setPaused: (state, payload) => {
      state.paused = payload
    },
    setShuffle(state) {
      state.playlistBackup = [...state.playingList]
      state.playingList = shuffleArray(state.playingList)

      state.playingIndexBackup = state.playingIndex
      state.playingIndex = 0
      state.musicItem = state.playingList[0]
      setTimeout(() => {
        bus.$emit(ACTION_TOGGLE_PLAY, {isPlay: true})
      }, 0)
      state.isRandom = true
    },
    setShuffleRestore(state) {
      // @ts-ignore
      this.commit('restorePlayingList')

      state.playingIndex = state.playingIndexBackup
      state.musicItem = state.playingList[state.playingIndex]
      setTimeout(() => {
        bus.$emit(ACTION_TOGGLE_PLAY, {isPlay: true})
      }, 0)
      state.isRandom = false
    },
    clearShuffle(state) {
      state.playlistBackup = []
      state.playingIndex = state.playingIndexBackup = 0
      state.isRandom = false
    },
    setIsRandom(state, payload) {
      state.isRandom = payload
    },
    setLoopMode(state, payload) {
      // @ts-ignore
      this.commit('updateSettings', {
        key: 'loopMode',
        value: payload
      })
    },
    setCurrentTime: (state, payload) => {
      state.currentTime = payload
    },
    setDuration: (state, payload) => {
      state.duration = payload
    },
    setToken: (state, val) => {
      if (val) {
        setToken(val)
      } else {
        removeToken()
      }
      state.token = val
    },
    setSettings: (state, val) => {
      state.settings = val
      saveSettings(state.settings)
    },
    updateSettings: (state, payload) => {
      const {key, value} = payload
      state.settings[key] = value
      saveSettings(state.settings)
    },
    setPlaybackRate(state, payload) {
      state.playbackRate = payload
    },
    setStopCountdown(state, payload) {
      state.stopCountdown = payload
    }
  },
  actions: {},
  modules: {}
})
