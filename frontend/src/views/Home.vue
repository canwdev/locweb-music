<template>
  <div class="home">
    <Navbar/>

    <HomeList
        v-show="!isPlaylist"
        :is-loading="isLoading"
        :list="fileList"
        :show-up="directories.length > 0"
        @onItemClick="handleItemClick"
        @goUpDir="goUpDir"
    />
    <HomeList
        v-show="isPlaylist"
        :is-loading="isLoading"
        :list="playlist"
        :active-index="playingIndex"
        @onItemClick="handleItemClick"
        @goUpDir="goUpDir"
    />
    <Actionbar/>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, computed, watch, nextTick} from 'vue';
import store from '@/store'

import Navbar from '@/components/Navbar.vue';
import HomeList from '@/components/HomeList/index.vue';
import Actionbar from '@/components/Actionbar.vue';
import {getList} from "@/api/music.ts";
import {LoopModeEnum, MusicItem, NavbarTabsEnum} from "@/enum";
import bus, {
  ACTION_TOGGLE_PLAY,
  ACTION_PREV,
  ACTION_NEXT,
  ACTION_PLAY_ENDED
} from "@/utils/bus";
import {isSupportedMusicFormat} from "@/utils/is";

export default defineComponent({
  name: 'Home',
  components: {
    Navbar,
    HomeList,
    Actionbar,
  },
  setup() {
    const isLoading = ref<boolean>(false)
    const fileList = ref<Array<MusicItem>>([])
    const directories = ref<Array<any>>([])

    const playlist = computed(() => store.getters.playlist)
    const navbarTab = computed(() => store.getters.navbarTab)
    const isRandom = computed(() => store.getters.isRandom)
    const loopMode = computed(() => store.getters.loopMode)
    const playingIndex = computed<number>({
      get() {
        return store.getters.playingIndex
      },
      set(val) {
        store.commit('setPlayingIndex', val)
      }
    })
    const isPlaylist = computed(() => store.getters.navbarTab === NavbarTabsEnum.PLAYING)

    const getFileList = async () => {
      if (isLoading.value) {
        return
      }
      try {
        isLoading.value = true
        let path = ''
        directories.value.forEach((item: any) => {
          path += (item.filename + '/')
        })

        const list = await getList({
          path
        })
        fileList.value = list.map(file => {
          return new MusicItem({
            ...file
          })
        })

      } catch (e) {
        window.$swal.fire({
          toast: true,
          icon: 'error',
          title: e.message,
          showConfirmButton: false,
        })
        console.error(e)
      } finally {
        isLoading.value = false
      }

    }
    const goUpDir = () => {
      directories.value.pop()
    }
    const playMusicFromList = (list, item: MusicItem) => {
      store.commit('setMusicItem', item)
      playingIndex.value = list.findIndex((val: any) => {
        return val.filename === item.filename
      })

      nextTick(() => {
        // jump to playing list
        store.commit('setNavbarTab', NavbarTabsEnum.PLAYING)
        bus.emit(ACTION_TOGGLE_PLAY)
      })
    }
    const handleItemClick = (item: MusicItem) => {
      // jump folder
      if (item.isDirectory) {
        directories.value.push(item)
        return
      }

      // play a song
      if (isPlaylist.value) {
        playMusicFromList(playlist.value, item)
      } else {
        if (isSupportedMusicFormat(item.filename)) {

          store.commit('clearShuffle')
          // format data
          const list = fileList.value.filter((val: any) => {
            return isSupportedMusicFormat(val.filename)
          })
          store.commit('setPlaylist', list)
          // set current playing
          playMusicFromList(list, item)
        } else {
          window.$swal.fire({
            toast: true,
            timer: 1500,
            icon: 'info',
            title: 'Format not support (yet)',
            showConfirmButton: false,
          })
        }
      }
    }
    const playMusicIndexed = (index: number) => {
      // console.log('playMusicIndexed', index)
      store.commit('setMusicItem', playlist.value[index])
      playingIndex.value = index
      nextTick(() => {
        bus.emit(ACTION_TOGGLE_PLAY)
      })
    }
    const playPrev = () => {
      const index = playingIndex.value - 1
      if (index < 0) {
        return
      }
      playMusicIndexed(index)
    }
    const playNext = () => {
      let index = playingIndex.value + 1
      if (index > playlist.value.length - 1) {
        if (loopMode.value === LoopModeEnum.LOOP_SEQUENCE) {
          // loop list from first
          index = 0
        } else {
          // stop at last
          return
        }
      }
      playMusicIndexed(index)
    }
    const handlePlayEnded = () => {
      // console.log('handlePlayEnded', loopMode.value)
      if (loopMode.value === LoopModeEnum.LOOP_SINGLE) {
        // single loop
        bus.emit(ACTION_TOGGLE_PLAY)
        return
      }
      if (loopMode.value === LoopModeEnum.LOOP_REVERSE) {
        // reverse play
        playPrev()
        return
      }
      playNext()
    }



    watch(directories, (val) => {
      console.log('directories changed', val)
      getFileList()
    }, {
      deep: true
    })

    return {
      // data
      isLoading,
      fileList,
      directories,
      // computed
      playlist,
      navbarTab,
      isRandom,
      loopMode,
      playingIndex,
      isPlaylist,
      // methods
      getFileList,
      goUpDir,
      playMusicFromList,
      handleItemClick,
      playMusicIndexed,
      playPrev,
      playNext,
      handlePlayEnded
    }
  },
  mounted() {
    this.getFileList()
    bus.on(ACTION_PREV, this.playPrev)
    bus.on(ACTION_NEXT, this.playNext)
    bus.on(ACTION_PLAY_ENDED, this.handlePlayEnded)
  },
  beforeUnmount() {
    bus.off(ACTION_PREV, this.playPrev)
    bus.off(ACTION_NEXT, this.playNext)
    bus.off(ACTION_PLAY_ENDED, this.handlePlayEnded)
  }
});
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
}
</style>
