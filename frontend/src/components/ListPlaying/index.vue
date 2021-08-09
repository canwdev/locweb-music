<template>
  <MainList
      :is-loading="isLoading"
      :list="playingList"
      :active-id="playingId"
      is-play-list
      :is-paused="paused"
      :min-item-size="55"
      @onItemClick="handleItemClick"
      @onItemAction="handleItemAction"
      :filter-placeholder="$t('filter-by-name')"
  >
    <DialogMenu
        v-model:visible="isShowFileMenu"
        :list="fileMenuList"
    />
  </MainList>
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  nextTick,
  onMounted,
  onBeforeUnmount, ref
} from 'vue';
import store from '@/store'
import MainList from '@/components/MainList/index.vue';
import bus, {
  ACTION_PLAY_START,
  ACTION_TOGGLE_PLAY,
  ACTION_PREV,
  ACTION_NEXT,
  ACTION_PLAY_ENDED
} from "@/utils/bus";
import {LoopModeType, MusicItem, NavBarIndex, NavbarTabsType} from "@/enum";
import DialogMenu from "@/components/DialogMenu.vue";
import useDialogMenu from "./useDialogMenu";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default defineComponent({
  name: "ListPlaying",
  components: {
    MainList,
    DialogMenu
  },
  setup() {
    const isLoading = ref<boolean>(false)
    const playingList = computed(() => store.state.playingList)
    const isRandom = computed(() => store.state.isRandom)
    const loopMode = computed(() => store.getters.loopMode)
    const paused = computed(() => store.state.paused)
    const playingId = computed(() => store.state.musicItem.id)
    const playingIndex = computed<number>({
      get() {
        return store.state.playingIndex
      },
      set(val) {
        store.commit('setPlayingIndex', val)
      }
    })

    const playMusicFromList = (list: Array<MusicItem>, item: MusicItem): void => {
      store.commit('setMusicItem', item)
      playingIndex.value = list.findIndex((val: any) => {
        return val.filename === item.filename
      })

      nextTick(() => {
        // jump to playing list
        setTimeout(() => {
          store.commit('setNavbarIndex', NavBarIndex.RIGHT)
        }, 30)
        bus.emit(ACTION_TOGGLE_PLAY)
      })
    }
    const handleItemClick = (item: MusicItem) => {
      if (item.isDirectory) {
        return
      }

      // play a song
      playMusicFromList(playingList.value, item)
    }
    const playByIndex = (index: number) => {
      // console.log('playByIndex', index)
      store.commit('setMusicItem', playingList.value[index])
      playingIndex.value = index
      nextTick(() => {
        bus.emit(ACTION_TOGGLE_PLAY)
      })
    }
    const playPrev = () => {
      let index = playingIndex.value - 1
      if (index < 0) {
        index = playingList.value.length - 1
      }
      playByIndex(index)
    }
    const playShuffle = () => {
      playByIndex(getRandomInt(0, playingList.value.length - 1))
    }
    const playNext = () => {
      if (loopMode.value === LoopModeType.SHUFFLE) {
        playShuffle()
        return
      }
      let index = playingIndex.value + 1
      if (index > playingList.value.length - 1) {
        if (loopMode.value === LoopModeType.LOOP_SEQUENCE) {
          // loop list from first
          index = 0
        } else {
          // stop at last
          return
        }
      }
      playByIndex(index)
    }
    const handlePlayEnded = () => {
      // console.log('handlePlayEnded', loopMode.value)
      if (loopMode.value === LoopModeType.LOOP_SINGLE) {
        // single loop
        bus.emit(ACTION_TOGGLE_PLAY)
        return
      }
      if (loopMode.value === LoopModeType.LOOP_REVERSE) {
        // reverse play
        playPrev()
        return
      }
      if (loopMode.value === LoopModeType.SHUFFLE) {
        playShuffle()
        return
      }
      playNext()
    }

    const handlePlayStart = (event) => {
      const {
        list,
        item
      } = event
      playMusicFromList(list, item)
    }

    onMounted(() => {
      bus.on(ACTION_PLAY_START, handlePlayStart)
      bus.on(ACTION_PREV, playPrev)
      bus.on(ACTION_NEXT, playNext)
      bus.on(ACTION_PLAY_ENDED, handlePlayEnded)
    })
    onBeforeUnmount(() => {
      bus.off(ACTION_PLAY_START, handlePlayStart)
      bus.off(ACTION_PREV, playPrev)
      bus.off(ACTION_NEXT, playNext)
      bus.off(ACTION_PLAY_ENDED, handlePlayEnded)
    })

    return {
      isLoading,
      playingList,
      isRandom,
      loopMode,
      playingId,
      playingIndex,
      paused,
      playMusicFromList,
      handleItemClick,
      playByIndex,
      playPrev,
      playNext,
      handlePlayEnded,
      ...useDialogMenu(isLoading)
    }
  }
})
</script>

<style scoped>

</style>
