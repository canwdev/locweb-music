<template>
  <div class="actionbar-wrapper">
    <div class="progressbar flex items-center justify-between">
      <span class="time text-overflow">{{ formatTimeMS(mCurrentTime) }}</span>

      <SeekBar
          :max="duration"
          :value="mCurrentTime"
          @input="progressSeeking"
          @change="progressChange"
      />


      <span class="time text-overflow">{{ formatTimeMS(duration) }}</span>
    </div>
    <div class="actionbar flex items-center">
      <ButtonCover
          @click="handleCoverClick"
          :src="musicItem.cover"
          :icon-name="volumeIcon"
      >
        <div
            v-show="isShowVolumeSlider"
            @click.stop
            class="volume-slider-wrap bg-dark"
        >
          <SeekBar
              vertical
              :value="audioVolume"
              @input="volumeSeeking"
              @change="volumeChange"
          />
          <div class="tip">{{ audioVolume }}%</div>
        </div>
      </ButtonCover>
      <button
          @click="showDetailDialog"
          class="btn-no-style btn-song"
      >
        <span class="title text-overflow">{{ musicItem.titleDisplay }}</span>
        <span v-show="musicItem.artist" class="artist text-overflow">{{ musicItem.artist }}</span>
      </button>
      <div class="buttons-scroll flex items-center">
        <button
            :disabled="actionDisabled"
            @click="previous"
            class="btn-no-style btn-action">
          <i class="material-icons" title="Previous">skip_previous</i>
        </button>

        <button
            :disabled="actionDisabled"
            @click="togglePlay"
            class="btn-no-style btn-action">
          <i v-show="paused" class="material-icons" title="Play">play_arrow</i>
          <i v-show="!paused" class="material-icons" title="Pause">pause</i>
        </button>

        <button
            :disabled="actionDisabled"
            @click="next"
            class="btn-no-style btn-action">
          <i class="material-icons" title="Next">skip_next</i>
        </button>

        <button
            :disabled="actionDisabled"
            class="btn-no-style btn-action"
            :class="{active: isRandom}"
            @click="toggleRandom"
        >
          <i class="material-icons" title="Shuffle">shuffle</i>
        </button>

        <button class="btn-no-style btn-action" @click="switchLoopMode">
          <i class="material-icons" :class="loopIcon.className" title="Loop">{{ loopIcon.name }}</i>
        </button>
      </div>
    </div>

    <!--Music Detail Dialog-->
    <ModalDialog
        class="music-detail-dialog"
        dark
        is-show-close
        unlimited-size
        v-model:visible="detailDialogVisible"
    >
      <MusicDetail
          :is-parent-visible="detailDialogVisible"
      />
    </ModalDialog>

  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref, watch, nextTick, onMounted, onBeforeUnmount} from 'vue';
import store from '@/store'
import {LoopModeEnum, MusicItem} from "@/enum";
import bus, {
  ACTION_CHANGE_CURRENT_TIME,
  ACTION_NEXT, ACTION_PREV,
  ACTION_TOGGLE_PLAY,
} from "@/utils/bus";
import {formatTimeMS} from "@/utils";
import ButtonCover from "@/components/ButtonCover.vue"
import ModalDialog from '@/components/ModalDialog.vue'
import SeekBar from '@/components/SeekBar.vue'
import MusicDetail from '@/components/MusicDetail.vue'
import useAudioVolume from "@/composables/useAudioVolume"
import hotkeys from 'hotkeys-js';
import is from 'is_js'

export default defineComponent({
  name: 'Actionbar',
  components: {
    ButtonCover,
    ModalDialog,
    SeekBar,
    MusicDetail
  },
  setup() {
    const mCurrentTime = ref(0)
    const isSeeking = ref(false)
    const detailDialogVisible = ref(false)
    const isShowVolumeSlider = ref(false)

    const currentTime = computed(() => {
      return store.getters.currentTime
    })
    watch(currentTime, (val) => {
      if (!isSeeking.value) {
        mCurrentTime.value = Number(val)
      }
    })
    const duration = computed(() => {
      return store.getters.duration
    })

    const musicItem = computed((): MusicItem => {
      return store.getters.musicItem
    })
    const paused = computed((): boolean => {
      return store.getters.paused
    })
    const playingList = computed((): Array<MusicItem> => {
      return store.getters.playingList
    })
    const actionDisabled = computed((): boolean => {
      return playingList.value.length === 0
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
    const loopIcon = computed((): object => {
      switch (loopMode.value) {
        case LoopModeEnum.NONE:
          return {name: 'arrow_forward'}
        case LoopModeEnum.LOOP_SEQUENCE:
          return {name: 'repeat'}
        case LoopModeEnum.LOOP_REVERSE:
          return {name: 'repeat', className: 'reverse-x'}
        case LoopModeEnum.LOOP_SINGLE:
          return {name: 'repeat_one'}
        default:
          return {name: 'help'}
      }
    })

    const {
      audioVolume,
      volumeIcon,
      volumeSeeking,
      volumeChange,
      volumeUp,
      volumeDown,
    } = useAudioVolume()

    const volumeUpFn = () => {
      volumeUp()
    }
    const volumeDownFn = () => {
      volumeDown()
    }

    const loopText = {
      1: 'Play in order',
      2: 'Sequential loop',
      3: 'Reverse loop',
      4: 'Single cycle',
    }
    const showTip = (text) => {
      window.$notify.info(text, {
        position: 'bottom',
      })
    }

    const previous = () => {
      bus.emit(ACTION_PREV)
    }
    const next = () => {
      bus.emit(ACTION_NEXT)
    }
    const togglePlay = () => {
      bus.emit(ACTION_TOGGLE_PLAY)
    }
    const toggleRandom = () => {
      if (playingList.value.length === 0) {
        return
      }
      const flag = !isRandom.value
      if (flag) {
        store.commit('setShuffle')
      } else {
        store.commit('setShuffleRestore')
      }
      showTip('Shuffle: ' + (flag ? 'ON' : 'OFF'))
    }
    const switchLoopMode = () => {
      let index = loopMode.value
      ++index
      if (index > LoopModeEnum.LOOP_SINGLE) {
        index = LoopModeEnum.NONE
      }
      loopMode.value = index
      showTip(loopText[index])
    }

    const handleCoverClick = () => {
      if (is.ios()) {
        // window.$notify.warning('iOS may not support this function')
        detailDialogVisible.value = !detailDialogVisible.value
        return
      }
      isShowVolumeSlider.value = !isShowVolumeSlider.value
    }

    const keySpace = 'space'
    const keyPrevious = 'left,pageup,k,l'
    const keyNext = 'right,pagedown,h,j'
    const keyUp = 'up'
    const keyDown = 'down'

    onMounted(() => {
      hotkeys(keySpace, togglePlay)
      hotkeys(keyPrevious, previous)
      hotkeys(keyNext, next)
      hotkeys('z', toggleRandom)
      hotkeys('x', switchLoopMode)

      hotkeys(keyUp, volumeUpFn)
      hotkeys(keyDown, volumeDownFn)
    })
    onBeforeUnmount(() => {
      hotkeys.unbind(keySpace, togglePlay)
      hotkeys.unbind(keyPrevious, previous)
      hotkeys.unbind(keyNext, next)
      hotkeys.unbind('z', toggleRandom)
      hotkeys.unbind('x', switchLoopMode)

      hotkeys.unbind(keyUp, volumeUpFn)
      hotkeys.unbind(keyDown, volumeDownFn)
    })

    return {
      // data
      LoopModeEnum,
      mCurrentTime,
      isSeeking,
      detailDialogVisible,
      isShowVolumeSlider,
      audioVolume,
      volumeIcon,
      // computed
      currentTime,
      duration,
      musicItem,
      paused,
      isRandom,
      loopMode,
      loopIcon,
      actionDisabled,
      // methods
      previous,
      next,
      togglePlay,
      toggleRandom,
      switchLoopMode,
      formatTimeMS,
      progressSeeking(evt) {
        // console.log('progressSeeking', evt.target.value)
        isSeeking.value = true
        mCurrentTime.value = Number(evt.target.value)
      },
      progressChange(evt) {
        const value = Number(evt.target.value)
        // console.log('progressChange', value)

        bus.emit(ACTION_CHANGE_CURRENT_TIME, value)
        isSeeking.value = false

      },
      volumeSeeking,
      volumeChange,
      showDetailDialog() {
        detailDialogVisible.value = !detailDialogVisible.value
        console.log(musicItem.value)
      },
      handleCoverClick
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
  position: relative;
  z-index: 1000;

  .time {
    width: 50px;
    text-align: center;
  }

}

.actionbar {
  height: 50px;
  box-shadow: $shadow-1;
  user-select: none;
  position: relative;
  z-index: 1000;

  .btn-cover {
    background-color: $primary;
    border-radius: 0;
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

  .volume-slider-wrap {
    position: absolute;
    bottom: 100%;
    left: 0;
    width: 50px;
    height: 150px;
    z-index: 10;
    border-radius: 0 $generic-border-radius 0 0;
    padding: 10px 0 0 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .tip {
      font-size: 12px;
      margin: 5px 10px;
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

      .reverse-x {
        color: $red;
        transform: rotateX(-180deg);
      }

      &.active {
        color: $primary;
      }

      & + button {
        border-left: 1px solid $border-color;
      }
    }
  }
}

.music-detail-dialog {
  align-items: start;

  ::v-deep & > .dialog-main {
    width: 100%;
    height: calc(100% - 75px);

    & > .btn-no-style {
      top: 10px;
      right: 10px;
    }

    & > .dialog-inner {
      display: flex;
      align-items: center;
    }
  }
}
</style>
