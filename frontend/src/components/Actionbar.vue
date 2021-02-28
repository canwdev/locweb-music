<template>
  <div class="actionbar-wrapper">
    <div class="progressbar bg-glass-white flex items-center justify-between">
      <span class="time text-overflow">{{ formatTimeMS(mCurrentTime) }}</span>
      <div class="seekbar-wrap">
        <div class="seekbar-fill"
             :style="'width:'+progress+'%'"></div>
        <input
            ref="seekBar"
            type="range"
            min="0"
            :max="duration"
            :value="mCurrentTime"
            @input="seekbarProgressSeeking"
            @change="seekbarProgressChange"
            class="common-seekbar seekbar-input"
        >
      </div>


      <span class="time text-overflow">{{ formatTimeMS(duration) }}</span>
    </div>
    <div class="actionbar bg-glass-white flex items-center">
      <ButtonCover
          @click="showDetailDialog"
          :src="coverImage"
      />
      <button
          @click="showDetailDialog"
          class="btn-no-style btn-song"
      >
        <span class="title text-overflow">{{ displayTitle }}</span>
        <span v-show="musicItem.artist" class="artist text-overflow">{{ musicItem.artist }}</span>
      </button>
      <div class="buttons-scroll flex items-center ">
        <button
            @click="previous"
            class="btn-no-style btn-action">
          <i class="material-icons" title="Previous">skip_previous</i>
        </button>

        <button
            @click="togglePlay"
            class="btn-no-style btn-action">
          <i v-show="paused" class="material-icons" title="Play">play_arrow</i>
          <i v-show="!paused" class="material-icons" title="Pause">pause</i>
        </button>

        <button
            @click="next"
            class="btn-no-style btn-action">
          <i class="material-icons" title="Next">skip_next</i>
        </button>

        <!--        <button class="btn-no-style btn-action">-->
        <!--          <i class="material-icons" title="Volume">volume_up</i>-->
        <!--        </button>-->
        <button class="btn-no-style btn-action" :class="{active: isRandom}" @click="toggleRandom">
          <i class="material-icons" title="Shuffle">shuffle</i>
        </button>
        <button class="btn-no-style btn-action" @click="switchLoopMode">
          <i class="material-icons" title="Loop">{{ loopIconName }}</i>
        </button>
      </div>
    </div>

    <ModalDialog
        v-model:visible="detailDialogVisible"
    >
      <div class="music-detail">
        <CoverDisplay
            class="big-cover"
            :src="coverImage"
            :is-rotating="false"
            :is-rounded="false"
        />
        <div class="title">{{ displayTitle }}</div>
        <div class="subtitle">{{ musicItem.artist }}</div>
        <div class="subtitle">{{ musicItem.album }}</div>

        <div class="tab-wrap">
          <button
            v-for="item in detailTabList"
            :key="item.value"
            class="btn-no-style"
            :class="{active: currentDetailTab === item.value}"
            @click="currentDetailTab = item.value"
          >
            {{ item.label }}
          </button>
        </div>

        <textarea
            v-if="currentDetailTab === DetailTabEnum.LYRIC"
            class="metadata" cols="30" rows="15" readonly
            :value="musicItem.lyric"></textarea>
        <textarea
            v-if="currentDetailTab === DetailTabEnum.METADATA"
            class="metadata" cols="30" rows="15" readonly
            :value="JSON.stringify(musicItem.metadata, null, 2)"></textarea>

      </div>

    </ModalDialog>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref, watch} from 'vue';
import store from '@/store'
import {LoopModeEnum, MusicItem} from "@/enum";
import bus, {ACTION_CHANGE_CURRENT_TIME, ACTION_NEXT, ACTION_PREV, ACTION_TOGGLE_PLAY} from "@/utils/bus";
import {formatTimeMS} from "@/utils";
import ButtonCover from "@/components/ButtonCover.vue"
import CoverDisplay from "@/components/CoverDisplay.vue"
import useCoverImage from "@/composables/useCoverImage";
import ModalDialog from '@/components/ModalDialog.vue'

const DetailTabEnum = {
  LYRIC: 'LYRIC',
  METADATA: 'METADATA',
}
const detailTabList = [
  {label: 'Lyric', value: DetailTabEnum.LYRIC},
  {label: 'Metadata', value: DetailTabEnum.METADATA},
]

export default defineComponent({
  name: 'Actionbar',
  components: {
    ButtonCover,
    ModalDialog,
    CoverDisplay
  },
  setup() {
    const mCurrentTime = ref(0)
    const isSeeking = ref(false)
    const detailDialogVisible = ref(false)
    const currentDetailTab = ref(DetailTabEnum.LYRIC)

    const currentTime = computed(() => {
      return store.getters.currentTime
    })
    watch(currentTime, (val) => {
      if (!isSeeking.value) {
        mCurrentTime.value = val
      }
    })
    const duration = computed(() => {
      return store.getters.duration
    })
    const progress = computed(() => {
      return mCurrentTime.value / duration.value * 100
    })
    const musicItem = computed((): MusicItem => {
      return store.getters.musicItem
    })
    const {coverImage} = useCoverImage(musicItem)
    const paused = computed((): boolean => {
      return store.getters.paused
    })
    const playlist = computed((): Array<MusicItem> => {
      return store.getters.playlist
    })
    const isRandom = computed({
      get() {
        return store.getters.isRandom
      },
      set(val) {
        store.commit('setIsRandom', val)
      }
    })
    const loopMode = computed({
      get(): number {
        return store.getters.loopMode
      },
      set(val: number) {
        store.commit('setLoopMode', val)
      }
    })
    const loopIconName = computed((): string => {
      switch (loopMode.value) {
        case LoopModeEnum.NONE:
          return 'arrow_forward'
        case LoopModeEnum.LOOP_SEQUENCE:
          return 'repeat'
        case LoopModeEnum.LOOP_REVERSE:
          return 'arrow_back'
        case LoopModeEnum.LOOP_SINGLE:
          return 'repeat_one'
        default:
          return 'help'
      }
    })
    const displayTitle = computed(() => {
      return musicItem.value.title || musicItem.value.filename || 'N/A'
    })

    const loopText = {
      1: 'Play in order',
      2: 'Sequential loop',
      3: 'Reverse playback',
      4: 'Single cycle',
    }
    const showTip = (text) => {
      window.$swal.fire({
        toast: true,
        timer: 1000,
        title: text,
        showConfirmButton: false,
      })
    }

    return {
      DetailTabEnum,
      detailTabList,
      currentDetailTab,
      // data
      LoopModeEnum,
      mCurrentTime,
      isSeeking,
      coverImage,
      detailDialogVisible,
      // computed
      currentTime,
      duration,
      progress,
      musicItem,
      paused,
      isRandom,
      loopMode,
      loopIconName,
      displayTitle,
      // methods
      previous() {
        bus.emit(ACTION_PREV)
      },
      next() {
        bus.emit(ACTION_NEXT)
      },
      togglePlay() {
        bus.emit(ACTION_TOGGLE_PLAY)
      },
      toggleRandom() {
        if (playlist.value.length === 0) {
          return
        }
        const flag = !isRandom.value
        if (flag) {
          store.commit('setShuffle')
        } else {
          store.commit('setShuffleRestore')
        }
        showTip('Shuffle: ' + (flag ? 'ON' : 'OFF'))
      },
      switchLoopMode() {
        let index = loopMode.value
        ++index
        if (index > LoopModeEnum.LOOP_SINGLE) {
          index = LoopModeEnum.NONE
        }
        loopMode.value = index
        showTip(loopText[index])
      },
      formatTimeMS,
      seekbarProgressSeeking(evt) {
        // console.log('seekbarProgressSeeking', evt.target.value)
        isSeeking.value = true
        mCurrentTime.value = evt.target.value
      },
      seekbarProgressChange(evt) {
        console.log('seekbarProgressChange', evt.target.value)

        bus.emit(ACTION_CHANGE_CURRENT_TIME, evt.target.value)
        isSeeking.value = false
      },
      showDetailDialog() {
        detailDialogVisible.value = true
        console.log(musicItem.value)
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.actionbar-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}

.progressbar {
  height: 25px;
  width: 100%;
  box-sizing: border-box;
  border-top: 1px solid $border-color;
  border-bottom: 1px solid $border-color;

  .time {
    width: 50px;
    text-align: center;
  }

  .seekbar-wrap {
    height: 100%;
    flex: 1;
    position: relative;
    overflow: hidden;

    .seekbar-fill {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      height: 5px;
      width: 0;
      background: $primary;
      user-select: none;
      pointer-events: none;
      z-index: 0;
      border-radius: 2px;
    }

    input {
      width: 100%;
      appearance: none;
      height: 5px;
      background: $border-color;
      outline: none;
      border-radius: 2px;

      &::-webkit-slider-thumb {
        position: relative;
        appearance: none;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: $primary;
        z-index: 1;
        border: 1px solid rgba(0, 0, 0, 0.2);
      }
    }
  }
}

.actionbar {
  height: 55px;
  box-shadow: $shadow-1;
  user-select: none;
  padding-left: 2px;

  .btn-cover {
    background-color: $primary;
  }

  .btn-song {
    width: 45%;
    height: 100%;
    border-right: 1px solid $border-color;
    text-align: left;
    font-size: 12px;
    padding-left: 5px;

    .title {
      font-size: 14px;
    }

    .artist {
      margin-top: 5px;
    }

    & > span {
      display: block;
      width: 100%;
    }
  }

  .buttons-scroll {
    overflow: auto;
    height: 100%;
    flex: 1;
    flex-wrap: nowrap;

    & > button {
      height: 100%;
      width: 55px;
      font-size: 28px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      &.active {
        color: $primary;
      }

      & + button {
        border-left: 1px solid $border-color;
      }
    }
  }
}

.music-detail {
  width: 300px;
  text-align: center;
  .big-cover {
    width: 300px;
    height: 300px;
  }
  .title {
    margin-top: 10px;
    font-size: 22px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  .subtitle {
    margin-bottom: 5px;
  }
  .metadata {
    width: 90%;
    font-size: 12px;
    font-family: monospace;
    resize: none;
  }

  .tab-wrap {
    display: flex;
    margin-top: 10px;
    font-size: 14px;
    button {
      flex: 1;
      opacity: .3;
      &.active {
        opacity: 1;
        font-weight: bold;
      }
    }
  }
}
</style>
