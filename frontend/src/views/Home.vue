<template>
  <div class="home">
    <Navbar/>

    <button style="position:fixed; z-index: 999">{{ playingIndex }}</button>
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
import {defineComponent} from 'vue';
import Navbar from '@/components/Navbar.vue';
import HomeList from '@/components/HomeList/index.vue';
import Actionbar from '@/components/Actionbar.vue';
import {getList} from "@/api/music.ts";
import {MusicItem, NavbarTabsEnum} from "@/enum";
import bus, {
  ACTION_TOGGLE_PLAY,
} from "@/utils/bus";
import {isSupportedMusicFormat} from "@/utils/is";

export default defineComponent({
  name: 'Home',
  components: {
    Navbar,
    HomeList,
    Actionbar,
  },
  data() {
    const directories: Array<any> = [];
    const fileList: Array<MusicItem> = [];
    return {
      NavbarTabsEnum: Object.freeze(NavbarTabsEnum),
      fileList,
      isLoading: false,
      directories
    }
  },
  watch: {
    directories: {
      handler(val) {
        console.log(val)
        this.getFileList()
      },
      deep: true
    }
  },
  computed: {
    playlist() {
      return this.$store.getters.playlist
    },
    navbarTab() {
      return this.$store.getters.navbarTab
    },
    playingIndex: {
      get() {
        return this.$store.getters.playingIndex
      },
      set(val) {
        this.$store.commit('setPlayingIndex', val)
      }
    },
    isPlaylist() {
      // TODO this.navbarTab
      return this.$store.getters.navbarTab === NavbarTabsEnum.PLAYING
    }
  },
  mounted() {
    this.getFileList()
  },
  methods: {
    async getFileList() {
      if (this.isLoading) {
        return
      }
      try {
        this.isLoading = true
        let path = ''
        this.directories.forEach((item: any) => {
          path += (item.filename + '/')
        })

        const list = await getList({
          path
        })
        this.fileList = list.map(file => {
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
        this.isLoading = false
      }

    },
    goUpDir() {
      this.directories.pop()
    },
    handleItemClick(item: MusicItem) {
      // jump folder
      if (item.isDirectory) {
        this.directories.push(item)
        return
      }

      // play a song
      if (this.isPlaylist) {
        this.playMusic(this.playlist, item)
      } else {
        if (isSupportedMusicFormat(item.filename)) {

          // format data
          const list = this.fileList.filter((val: any) => {
            return isSupportedMusicFormat(val.filename)
          })
          this.$store.commit('setPlaylist', list)
          // set current playing
          this.playMusic(list, item)
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
    },
    playMusic(list, item) {
      this.$store.commit('setMusicItem', item)
      this.playingIndex = list.findIndex((val: any) => {
        return val.filename === item.filename
      })

      this.$nextTick(() => {
        // jump to playing list
        this.$store.commit('setNavbarTab', NavbarTabsEnum.PLAYING)
        bus.emit(ACTION_TOGGLE_PLAY)
      })
    }
  }
});
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
}
</style>
