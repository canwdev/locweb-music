<template>
  <div class="home">
    <Navbar/>

    <MainList
        v-show="!isPlaylist"
        :is-loading="isLoading"
        :list="fileList"
        :show-up="directories.length > 0"
        :active-id="lastPlayIndex"
        @onItemClick="handleItemClick"
        @goUpDir="goUpDir"
        @refresh="getFileList"
    />
    <MainList
        v-show="isPlaylist"
        :is-loading="isLoading"
        :list="playlist"
        :active-id="playingId"
        is-play-list
        :is-paused="paused"
        @onItemClick="handleItemClick"
        @goUpDir="goUpDir"
    />
    <Actionbar/>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, computed, watch, nextTick, onMounted} from 'vue';
import store from '@/store'

import Navbar from '@/components/Navbar.vue';
import MainList from '@/components/MainList/index.vue';
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
import {useRoute} from 'vue-router'
import router from '@/router'

export default defineComponent({
  name: 'Home',
  components: {
    Navbar,
    MainList,
    Actionbar,
  },
  setup() {
    const route = useRoute()

    const isLoading = ref<boolean>(false)
    const fileList = ref<Array<MusicItem>>([])
    const directories = ref<Array<any>>([])
    const lastPlayIndex = ref(-1)

    const playlist = computed(() => store.getters.playlist)
    const navbarTab = computed(() => store.getters.navbarTab)
    const isRandom = computed(() => store.getters.isRandom)
    const loopMode = computed(() => store.getters.loopMode)
    const paused = computed(() => store.getters.paused)
    const playingId = computed(() => store.getters.musicItem.id)
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
        lastPlayIndex.value = -1

        let path = ''
        directories.value.forEach((item: any) => {
          path += (item.filename + '/')
        })

        const {list, playStat} = await getList({
          path,
          getPlayStat: true
        })
        const lastFilename = playStat && playStat.file
        fileList.value = list.map((file, index) => {
          if (lastFilename && (file.filename === lastFilename)) {
            lastPlayIndex.value = index
          }
          return new MusicItem(file)
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
            width: 300,
            timer: 2500,
            icon: 'info',
            title: 'Format not support.',
            showConfirmButton: true,
            confirmButtonText: 'Try'
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            console.log('result', result)
            if (result.isConfirmed) {
              window.open(item.getSource(), '_blank')
            }
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

    watch(() => route.query, (val) => {
      const dir = val.dir
      if (dir) {
        // @ts-ignore
        const list = JSON.parse(dir).map(item => new MusicItem({
          filename: item,
          isDirectory: true
        }))
        directories.value = list
        // console.log('router.query.dir change', val)
      }
    }, {
      immediate: true
    })

    watch(directories, (val) => {
      // console.log('directories changed', {val, router, route})

      router.push({
        query: {
          ...route.query,
          dir: JSON.stringify(val.map(item => item.filename))
        }
      })
      getFileList()
    }, {
      deep: true
    })

    return {
      // data
      isLoading,
      fileList,
      directories,
      lastPlayIndex,
      // computed
      playlist,
      navbarTab,
      isRandom,
      loopMode,
      playingId,
      playingIndex,
      isPlaylist,
      paused,
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
