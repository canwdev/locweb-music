import {createStore} from 'vuex'
import {MusicItem} from "@/enum";
import {NavbarTabsEnum, LoopModeEnum} from "@/enum";
import {shuffleArray} from "@/utils";
import bus, {
  ACTION_TOGGLE_PLAY,
} from "@/utils/bus";
import {
  setToken,
  getToken,
  removeToken
} from "@/utils/auth";
import {loadSettings, saveSettings} from "@/utils/settings";

const playingList: Array<MusicItem> = [];
const playlistBackup: Array<MusicItem> = [];

export default createStore({
  state: {
    musicItem: new MusicItem(), // current playing music
    navbarTab: NavbarTabsEnum.MAIN, // navbar index
    playingList, // current playing list
    playlistBackup, // backup original list from random mode
    playingIndex: 0, // playing music index in playingList
    playingIndexBackup: 0, // backup original index from random mode
    paused: true, // is current playing paused
    isRandom: false, // is random choose next song to play
    loopMode: LoopModeEnum.LOOP_SEQUENCE, // music playing loop mode
    currentTime: 0,
    duration: 0,
    token: getToken(), // Authorization token
    settings: loadSettings()
  },
  getters: {
    isDarkTheme: state => state.settings.isDarkTheme
  },
  mutations: {
    setMusicItem: (state, payload: MusicItem) => {
      state.musicItem = payload
    },
    setNavbarTab: (state, payload: number) => {
      state.navbarTab = payload
    },
    setPlayingList: (state, payload: Array<MusicItem>) => {
      state.playlistBackup = [...state.playingList]
      state.playingList = payload
    },
    restorePlayingList: (state) => {
      state.playingList = state.playlistBackup
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
      this.commit('setPlayingList', shuffleArray(state.playingList))

      state.playingIndexBackup = state.playingIndex
      state.playingIndex = 0
      state.musicItem = state.playingList[0]
      setTimeout(() => {
        bus.emit(ACTION_TOGGLE_PLAY)
      }, 0)
      state.isRandom = true
    },
    setShuffleRestore(state) {
      // @ts-ignore
      this.commit('restorePlayingList')

      state.playingIndex = state.playingIndexBackup
      state.musicItem = state.playingList[state.playingIndex]
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
    },
    setCurrentTime: (state, payload: number) => {
      state.currentTime = payload
    },
    setDuration: (state, payload: number) => {
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
    setSettings: (state, val: object) => {
      state.settings = val
      saveSettings(state.settings)
    },
    updateSettings: (state, payload) => {
      const {key, value} = payload
      state.settings[key] = value
      saveSettings(state.settings)
    }
  },
  actions: {},
  modules: {}
})
