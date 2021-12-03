// import mitt from 'mitt'
import Vue from 'vue'

export default new Vue()

export const ACTION_PLAY_START = 'ACTION_PLAY_START' // play a song from playingList
export const ACTION_TOGGLE_PLAY = 'ACTION_TOGGLE_PLAY' // toggle play/pause
export const ACTION_PREV = 'ACTION_PREV' // play previous song
export const ACTION_NEXT = 'ACTION_NEXT' // play next song
export const ACTION_PLAY_ENDED = 'ACTION_PLAY_ENDED' // a song play ended
export const ACTION_CHANGE_CURRENT_TIME = 'ACTION_CHANGE_CURRENT_TIME'
export const ACTION_CHANGE_SPEED = 'ACTION_CHANGE_SPEED'
export const ACTION_CHANGE_VOLUME = 'ACTION_CHANGE_VOLUME'
export const ACTION_LOCATE_FILE = 'ACTION_LOCATE_FILE'
export const ACTION_ADD_PLAYLIST = 'ACTION_ADD_PLAYLIST'
export const ACTION_DOWNLOAD_FILE = 'ACTION_DOWNLOAD_FILE'
export const ACTION_ADD_LIST_PLAY_NEXT = 'ACTION_ADD_LIST_PLAY_NEXT'

