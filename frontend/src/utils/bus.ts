import mitt from 'mitt'

export default mitt()

export const ACTION_TOGGLE_PLAY = 'ACTION_TOGGLE_PLAY' // toggle play/pause
export const ACTION_PREV = 'ACTION_PREV' // play previous song
export const ACTION_NEXT = 'ACTION_NEXT' // play next song
export const ACTION_PLAY_ENDED = 'ACTION_PLAY_ENDED' // a song play ended
export const ACTION_CHANGE_VOLUME = 'ACTION_CHANGE_VOLUME'
