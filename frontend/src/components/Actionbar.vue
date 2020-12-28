<template>
  <div class="actionbar-wrapper">
    <div class="progressbar bg-glass-black flex items-center justify-between">
      <span class="time">{{ formatTimeMS(0) }}</span>
      <div class="common-seekbar-box">
<!--        <input-->
<!--            ref="seekBar"-->
<!--            type="range"-->
<!--            min="0"-->
<!--            :max="duration"-->
<!--            :value="currentTime"-->
<!--            @input="seekbarProgressSeeking"-->
<!--            @change="seekbarProgressChange"-->
<!--            class="common-seekbar seekbar-input"-->
<!--        >-->
      </div>


      <span class="time">{{ formatTimeMS(0) }}</span>
    </div>
    <div class="actionbar bg-glass-black flex items-center">
      <button class="btn-no-style btn-cover">
        <i class="iconfont icon-ios-musical-notes"></i>
      </button>
      <button class="btn-no-style btn-song">
        <span class="title text-overflow">{{ musicItem.title || musicItem.filename }}</span>
        <span v-show="musicItem.artist" class="artist text-overflow">{{ musicItem.artist }}</span>
      </button>
      <div class="buttons-scroll flex items-center ">
        <button
            @click="previous"
            class="btn-no-style btn-action">
          <i class="iconfont icon-skip-previous" title="Previous"></i>
        </button>

        <button
            @click="togglePlay"
            class="btn-no-style btn-action">
          <i v-show="paused" class="iconfont icon-play-arrow" title="Play"></i>
          <i v-show="!paused" class="iconfont icon-pause" title="Pause"></i>
        </button>

        <button
            @click="next"
            class="btn-no-style btn-action">
          <i class="iconfont icon-skip-next" title="Next"></i>
        </button>

        <button class="btn-no-style btn-action">
          <i class="iconfont icon-volume-up" title="Volume"></i>
        </button>
        <button class="btn-no-style btn-action" :class="{active: isRandom}" @click="isRandom = !isRandom">
          <i class="iconfont icon-shuffle" title="Shuffle"></i>
        </button>
        <button class="btn-no-style btn-action" @click="switchLoopMode">
          <i class="iconfont" :class="btnLoopClass" title="Loop"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, computed} from 'vue';
import store from '@/store'
import {MusicItem, LoopModeEnum} from "@/enum";
import bus, {
  ACTION_TOGGLE_PLAY,
  ACTION_PREV,
  ACTION_NEXT
} from "@/utils/bus";
import {formatTimeMS} from "@/utils";

export default defineComponent({
  name: 'Actionbar',
  setup() {
    const musicItem = computed((): MusicItem => {
      return store.getters.musicItem
    })
    const paused = computed((): boolean => {
      return store.getters.paused
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
    const btnLoopClass = computed((): string => {
      switch (loopMode.value) {
        case LoopModeEnum.NONE:
          return 'icon-arrow-forward'
        case LoopModeEnum.LOOP_SEQUENCE:
          return 'icon-repeat'
        case LoopModeEnum.LOOP_REVERSE:
          return 'icon-arrow-back'
        case LoopModeEnum.LOOP_SINGLE:
          return 'icon-repeat-one'
        default:
          return 'icon-help'
      }
    })

    return {
      // data
      LoopModeEnum,
      // computed
      musicItem,
      paused,
      isRandom,
      loopMode,
      btnLoopClass,
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
      switchLoopMode() {
        let index = loopMode.value
        ++index
        if (index > LoopModeEnum.LOOP_SINGLE) {
          index = LoopModeEnum.NONE
        }
        loopMode.value = index
      },
      formatTimeMS,
      seekbarProgressSeeking() {
        console.log('seekbarProgressSeeking')
      },
      seekbarProgressChange() {
        console.log('seekbarProgressChange')
      },
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
  border-top: 1px solid $grey-8;
  border-bottom: 1px solid $grey-8;

  .time {
    width: 50px;
    text-align: center;
  }
}

.actionbar {
  height: 55px;
  box-shadow: $shadow-1;
  user-select: none;

  .btn-cover {
    margin-left: 2px;
    width: 50px;
    height: 50px;
    background: $pink;
    font-size: 28px;
    border-radius: 2px;
  }

  .btn-song {
    width: 50%;
    height: 100%;
    border-right: 1px solid $grey-8;
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
        color: $pink;
      }

      & + button {
        border-left: 1px solid $grey-8;
      }
    }
  }
}
</style>
