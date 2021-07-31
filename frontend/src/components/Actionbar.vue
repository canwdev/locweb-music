<template>
  <div class="actionbar-wrapper">
    <div class="progressbar flex items-center justify-between" :class="themeClass">
      <span class="time text-overflow">{{ formatTimeMS(mCurrentTime) }}</span>

      <SeekBar
          :max="duration"
          :value="mCurrentTime"
          @input="progressSeeking"
          @change="progressChange"
      />


      <span class="time text-overflow">{{ formatTimeMS(duration) }}</span>
    </div>
    <div class="actionbar flex items-center" :class="themeClass">
      <ButtonCover
          @click="detailDialogVisible = !detailDialogVisible"
          :src="musicItem.cover"
          icon-name="audiotrack"
      >
      </ButtonCover>
      <button
          @click="showDetailDialog"
          class="btn-no-style btn-song-info"
      >
        <span class="title text-overflow">{{ musicItem.titleDisplay }}</span>
        <span v-show="musicItem.artist" class="artist text-overflow">{{ musicItem.artist }}</span>
        <span v-show="musicItem.album" class="album text-overflow">{{ musicItem.album }}</span>
      </button>
      <div class="buttons-scroll flex items-center">
        <button
            :disabled="actionDisabled"
            @click="previous"
            class="btn-no-style btn-action"
            :title="$t('previous')"
        >
          <i class="material-icons">skip_previous</i>
        </button>

        <button
            :disabled="actionDisabled"
            @click="togglePlay"
            class="btn-no-style btn-action"
            :title="paused ? $t('play') : $t('pause')"
        >
          <i v-show="paused" class="material-icons">play_arrow</i>
          <i v-show="!paused" class="material-icons">pause</i>
        </button>

        <button
            :disabled="actionDisabled"
            @click="next"
            class="btn-no-style btn-action"
            :title="$t('next')"
        >
          <i class="material-icons">skip_next</i>
        </button>

        <button
            :disabled="actionDisabled"
            class="btn-no-style btn-action"
            :class="{active: isRandom}"
            :title="$t('random')"
            @click="toggleRandom"
        >
          <i class="material-icons">casino</i>
        </button>

        <button class="btn-no-style btn-action" @click="switchLoopMode" :title="currentLoopMode.label">
          <i class="material-icons" :class="currentLoopMode.className">{{ currentLoopMode.icon }}</i>
        </button>

        <button
            class="btn-no-style btn-action"
            :title="$t('volume')"
            @click="isShowVolumeSlider = !isShowVolumeSlider"
        >
          <i class="material-icons">{{ volumeIcon }}</i>
        </button>
      </div>
    </div>

    <!--Music Detail Dialog-->
    <ModalDialog
        fixed
        class="music-detail-dialog"
        :dark="isDarkTheme"
        is-show-close
        no-radius
        unlimited-size
        v-model:visible="detailDialogVisible"
    >
      <MusicDetail
          :is-parent-visible="detailDialogVisible"
      />
    </ModalDialog>

    <ModalDialog
        fixed
        v-model:visible="isShowVolumeSlider"
        :dark="isDarkTheme"
    >
      <div
          @click.stop
          class="volume-slider-wrap"
      >
        <div class="tip">{{ $t('volume') }}</div>
        <SeekBar
            vertical
            :value="audioVolume"
            @input="volumeSeeking"
            @change="volumeChange"
        />
        <div class="tip">{{ audioVolume }}%</div>
      </div>
    </ModalDialog>

  </div>
</template>

<script lang="ts">
import {computed, defineComponent, ref, watch, nextTick, onMounted, onBeforeUnmount} from 'vue';
import {useI18n} from "vue-i18n";
import store from '@/store'
import {LoopModeType, MusicItem} from "@/enum";
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

export default defineComponent({
  name: 'Actionbar',
  components: {
    ButtonCover,
    ModalDialog,
    SeekBar,
    MusicDetail
  },
  setup() {
    const {t} = useI18n()
    const mCurrentTime = ref(0)
    const isSeeking = ref(false)
    const detailDialogVisible = ref(false)
    const isShowVolumeSlider = ref(false)

    const currentTime = computed(() => {
      return store.state.currentTime
    })
    watch(currentTime, (val) => {
      if (!isSeeking.value) {
        mCurrentTime.value = Number(val)
      }
    })
    const duration = computed(() => {
      return store.state.duration
    })

    const musicItem = computed((): MusicItem => {
      return store.state.musicItem
    })
    const paused = computed((): boolean => {
      return store.state.paused
    })
    const playingList = computed((): Array<MusicItem> => {
      return store.state.playingList
    })
    const actionDisabled = computed((): boolean => {
      return playingList.value.length === 0
    })
    const isRandom = computed({
      get() {
        return store.state.isRandom
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

    const loopModeMap = {
      [LoopModeType.NONE]: {
        icon: 'arrow_forward',
        label: t('msg.play-in-order'),
      },
      [LoopModeType.SHUFFLE]: {
        icon: 'shuffle',
        label: t('shuffle'),
      },
      [LoopModeType.LOOP_SEQUENCE]: {
        icon: 'repeat',
        label: t('msg.sequential-loop'),
      },
      [LoopModeType.LOOP_REVERSE]: {
        icon: 'repeat', className: 'reverse-x',
        label: t('msg.reverse-loop'),
      },
      [LoopModeType.LOOP_SINGLE]: {
        icon: 'repeat_one',
        label: t('msg.single-cycle'),
      },
    }
    const currentLoopMode = computed((): object => {
      return loopModeMap[loopMode.value]
    })

    const {
      audioVolume,
      volumeIcon,
      volumeSeeking,
      volumeChange,
      volumeUp,
      volumeDown,
    } = useAudioVolume()

    const volumeUpFn = (e) => {
      e.preventDefault()
      volumeUp()
    }
    const volumeDownFn = (e) => {
      e.preventDefault()
      volumeDown()
    }

    const showTip = (text) => {
      window.$notify.info(text, {
        position: 'center',
      })
    }

    const previous = () => {
      bus.emit(ACTION_PREV)
    }
    const next = () => {
      bus.emit(ACTION_NEXT)
    }
    const togglePlay = (e) => {
      e.preventDefault()
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
      showTip(t('random') + ': ' + (flag ? t('on') : t('off')))
    }
    const loopModeList = [
      LoopModeType.LOOP_SEQUENCE,
      LoopModeType.LOOP_SINGLE,
      LoopModeType.SHUFFLE,
      LoopModeType.LOOP_REVERSE,
      LoopModeType.NONE,
    ]
    const switchLoopMode = () => {
      let index = loopModeList.findIndex(i => i === loopMode.value)
      ++index
      if (index > loopModeList.length - 1) {
        index = 0
      }
      loopMode.value = loopModeList[index]
      // @ts-ignore
      showTip(currentLoopMode.value.label)
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
      LoopModeType,
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
      currentLoopMode,
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
        // console.log(musicItem.value)
      },
      isDarkTheme: computed(() => store.getters.isDarkTheme),
      themeClass: computed(() => store.getters.themeClass)
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

  .btn-song-info {
    width: 45%;
    height: 100%;
    border-right: 1px solid $border-color;
    text-align: left;
    padding-left: 5px;
    line-height: 1.1;

    .title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 2px;
    }

    .artist, .album {
      opacity: .8;
      font-size: 10px;
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

      .reverse-x {
        text-shadow: 0 0 5px $red;
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
    background: rgba(255, 255, 255, .85);

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

.volume-slider-wrap {
  text-align: center;
  width: 80px;
  height: 180px;
  padding: 10px 0 0 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .tip {
    max-width: 100%;
    overflow: hidden;
    font-size: 12px;
    margin: 5px 10px;
  }
}
</style>
