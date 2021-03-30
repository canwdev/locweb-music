<template>
  <div class="actionbar-wrapper">
    <div class="progressbar bg-dark flex items-center justify-between">
      <span class="time text-overflow">{{ formatTimeMS(mCurrentTime) }}</span>

      <SeekBar
          :max="duration"
          :value="mCurrentTime"
          @input="progressSeeking"
          @change="progressChange"
      />


      <span class="time text-overflow">{{ formatTimeMS(duration) }}</span>
    </div>
    <div class="actionbar bg-dark flex items-center">
      <ButtonCover
          @click="handleCoverClick"
          :src="coverImage"
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
        <span class="title text-overflow">{{ displayTitle }}</span>
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
        dark
        is-show-close
        v-model:visible="detailDialogVisible"
    >
      <div class="music-detail">
        <div class="cover-wrap">
          <CoverDisplay
              class="big-cover"
              :src="coverImage"
              :is-rotating="false"
              :is-rounded="false"
              :is-show-icon="!isShowDetail"
              @click="isShowDetail = true"
          />
          <transition name="fade">
            <div v-show="isShowDetail" class="detail-content bg-glass-black">
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

              <div
                  style="flex: 1; overflow: hidden"
                  v-show="currentDetailTab === DetailTabEnum.LYRIC"
              >

                <div v-if="lyricObj && lyricObj.lines" class="lrc-main">
                  <button class="btn-no-style lyric-lock" title="Lock Lyric" @click="isLyricLock = !isLyricLock">
                    <i class="material-icons">
                      {{ isLyricLock ? 'lock' : 'lock_open' }}
                    </i>
                  </button>

                  <div class="lrc-scroll-wrap">
                    <p
                        v-for="(line, index) in lyricObj.lines"
                        :class="{active: lyricCurrentLine===index}"
                        :key="index"
                        :data-index="index"
                    >{{ line.txt }}
                    </p>
                  </div>

                </div>
                <div v-else class="lrc-main no-lyric" @click="isShowDetail = false">
                  没有歌词，请欣赏
                </div>
              </div>
              <textarea
                  v-show="currentDetailTab === DetailTabEnum.METADATA"
                  class="metadata" cols="30" rows="15" readonly
                  :value="JSON.stringify(musicItem.metadata, null, 2)"></textarea>
            </div>
          </transition>
        </div>


        <div
            class="titles-wrap"
            :class="{opacity: isShowDetail}"
            @click="isShowDetail = !isShowDetail"
        >
          <div class="title">{{ displayTitle }}</div>
          <div class="subtitle">{{ musicItem.artist }}</div>
          <div class="subtitle">{{ musicItem.album }}</div>
        </div>
      </div>
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
  ACTION_CHANGE_VOLUME
} from "@/utils/bus";
import {formatTimeMS} from "@/utils";
import ButtonCover from "@/components/ButtonCover.vue"
import CoverDisplay from "@/components/CoverDisplay.vue"
import ModalDialog from '@/components/ModalDialog.vue'
import SeekBar from '@/components/SeekBar.vue'
import useLyricObj from "@/composables/useLyricObj"
import useAudioVolume from "@/composables/useAudioVolume"
import hotkeys from 'hotkeys-js';
import is from 'is_js'

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
    CoverDisplay,
    SeekBar
  },
  setup() {
    const mCurrentTime = ref(0)
    const isSeeking = ref(false)
    const detailDialogVisible = ref(false)
    const isShowDetail = ref(false)
    const currentDetailTab = ref(DetailTabEnum.LYRIC)
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
    const coverImage = computed(() => {
      return musicItem.value.cover
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

    const displayTitle = computed(() => {
      return musicItem.value.title || musicItem.value.filename || 'N/A'
    })

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

    const {
      lyricObj,
      lyricCurrentLine,
      isLyricLock,
    } = useLyricObj({
      beforeHandleLyric() {
        return detailDialogVisible.value && isShowDetail.value
      }
    })

    watch(isShowDetail, (val) => {
      if (val) {
        // console.log('isShowDetail', val)
        nextTick(() => {
          if (lyricObj.value) {
            lyricObj.value.callHandler()
          }
        })
      }
    })

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
      DetailTabEnum,
      detailTabList,
      currentDetailTab,
      lyricObj,
      lyricCurrentLine,
      // data
      LoopModeEnum,
      mCurrentTime,
      isSeeking,
      isShowDetail,
      coverImage,
      detailDialogVisible,
      isLyricLock,
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
      displayTitle,
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
        if (lyricObj.value) {
          lyricObj.value.seek(value * 1000)
        }
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

.music-detail {
  width: 300px;
  text-align: center;
  user-select: text;
  padding: 10px;

  .titles-wrap {
    &.opacity {
      opacity: .8;
      cursor: pointer;
    }

    .title {
      margin-top: 10px;
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 5px;
    }

    .subtitle {
      font-size: 14px;
      margin-bottom: 5px;
    }
  }

  .cover-wrap {
    position: relative;
    width: 300px;
    height: 300px;
    margin: 0 auto;
    border-radius: $generic-border-radius;
    overflow: hidden;
    box-shadow: 0 0 1px 1px rgba(255, 255, 255, .5);

    @media screen and (max-width: $mobile_min_width) {
      width: 95%;
      height: 270px;
    }

    .big-cover {
      width: 100%;
      height: 100%;
      cursor: pointer;
      border-radius: inherit;
      overflow: hidden;
    }
  }

  .detail-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    color: white;
    background: rgba(0, 0, 0, 0.4);
    border-radius: inherit;

    .tab-wrap {
      display: flex;
      font-size: 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);

      button {
        flex: 1;
        opacity: .3;
        padding: 10px 0;
        font-weight: bold;

        &.active {
          opacity: 1;
        }
      }
    }

    .metadata {
      padding: 5px;
      flex: 1;
      width: 100%;
      font-size: 12px;
      font-family: monospace;
      resize: none;
      box-sizing: border-box;
      background: transparent;
      outline: none;
      border: none;
      color: white;
    }

    .lrc-main {
      height: 100%;
      position: relative;

      .lyric-lock {
        position: absolute;
        top: 5px;
        left: 5px;
        font-size: 16px;
        opacity: .6;

        i {
          font-size: inherit;
        }
      }

      .lrc-scroll-wrap {
        height: 100%;
        width: 100%;
        overflow: auto;
        padding: 0 5px;
        box-sizing: border-box;
        scroll-behavior: smooth;

        & > p {
          font-size: 14px;
          margin: 10px 0 10px 0;
          text-align: center;
          line-height: 1.3;
          opacity: .7;
          transition: all .3s;

          &.active {
            opacity: 1;
            font-weight: bold;
            font-size: 16px;
          }
        }
      }

      &.no-lyric {
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        opacity: .5;
      }
    }
  }
}
</style>
