import {getClientHostUrl} from '@/utils/client'

// server api url
export const HOST_URL_DEFAULT = getClientHostUrl()
export const API_PROXY_BASE = import.meta.env.VITE_PROXY_BASE || ''
export const HOST_URL = API_PROXY_BASE + HOST_URL_DEFAULT

export enum LoopModeType {
  NONE = 1, // Play stops after last track
  LOOP_SEQUENCE = 2, // Sequence play
  LOOP_REVERSE = 3, // Reverse play
  LOOP_SINGLE = 4, // Single cycle
  SHUFFLE = 5, // Shuffle next
}

export const LoopModeTypeValues = [
  LoopModeType.NONE,
  LoopModeType.LOOP_SEQUENCE,
  LoopModeType.LOOP_REVERSE,
  LoopModeType.LOOP_SINGLE,
  LoopModeType.SHUFFLE,
]

export const loopModeMap = {
  [LoopModeType.NONE]: {
    icon: 'arrow_forward',
    i18nKey: 'msg.play-in-order',
  },
  [LoopModeType.SHUFFLE]: {
    icon: 'shuffle',
    i18nKey: 'shuffle',
  },
  [LoopModeType.LOOP_SEQUENCE]: {
    icon: 'repeat',
    i18nKey: 'msg.sequential-loop',
  },
  [LoopModeType.LOOP_REVERSE]: {
    icon: 'repeat',
    className: 'reverse-x',
    i18nKey: 'msg.reverse-loop',
  },
  [LoopModeType.LOOP_SINGLE]: {
    icon: 'repeat_one',
    i18nKey: 'msg.single-cycle',
  },
}
