import {getClientHostUrl} from '@/utils/client'
import {LS_KEY_API_HOST} from '@/enum/service'

// server api url
export const HOST_URL_DEFAULT = getClientHostUrl()
export const HOST_URL = localStorage.getItem(LS_KEY_API_HOST) || HOST_URL_DEFAULT

export const LoopModeType = {
  NONE: 1, // Play stops after last track
  LOOP_SEQUENCE: 2, // Sequence play
  LOOP_REVERSE: 3, // Reverse play
  LOOP_SINGLE: 4, // Single cycle
  SHUFFLE: 5, // Shuffle next
}

export const LoopModeTypeArray = Object.values(LoopModeType)

export function getLoopModeMap() {
  return {
    [LoopModeType.NONE]: {
      icon: 'arrow_forward',
      label: this.$t('msg.play-in-order'),
    },
    [LoopModeType.SHUFFLE]: {
      icon: 'shuffle',
      label: this.$t('shuffle'),
    },
    [LoopModeType.LOOP_SEQUENCE]: {
      icon: 'repeat',
      label: this.$t('msg.sequential-loop'),
    },
    [LoopModeType.LOOP_REVERSE]: {
      icon: 'repeat',
      className: 'reverse-x',
      label: this.$t('msg.reverse-loop'),
    },
    [LoopModeType.LOOP_SINGLE]: {
      icon: 'repeat_one',
      label: this.$t('msg.single-cycle'),
    },
  }
}
