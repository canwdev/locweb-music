<template>
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
      <button class="btn-no-style btn-action">
        <i class="iconfont icon-repeat" title="Loop"></i>
      </button>
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
      get() {
        store.getters.loopMode
      },
      set(val) {
        store.commit('setLoopMode', val)
      }
    })

    return {
      LoopModeEnum,
      musicItem,
      paused,
      isRandom,
      loopMode,
      previous() {
        bus.emit(ACTION_PREV)
      },
      next() {
        bus.emit(ACTION_NEXT)
      },
      togglePlay() {
        bus.emit(ACTION_TOGGLE_PLAY)
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.actionbar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
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
