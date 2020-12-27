<template>
  <div class="home">
    <Navbar/>
    <HomeList
        v-show="!isPlaylistTab"
        :is-loading="isLoading"
        :list="fileList"
        :show-up="directories.length > 0"
        @onItemClick="handleItemClick"
        @goUpDir="goUpDir"
    />
    <HomeList
        v-show="isPlaylistTab"
        :is-loading="isLoading"
        :list="playlist"
        @onItemClick="handleItemClick"
        @goUpDir="goUpDir"
    />
    <Actionbar/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {mapGetters} from 'vuex';
import Navbar from '@/components/Navbar.vue';
import HomeList from '@/components/HomeList/index.vue';
import Actionbar from '@/components/Actionbar.vue';
import {getList} from "@/api/music.ts";
import {MusicItem} from "@/enum";
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
    ...mapGetters(['isPlaylistTab', 'playlist']),
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
          return this.musicItemBuilder(file)
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
    musicItemBuilder(item) {
      return new MusicItem({
        ...item
      })
    },
    handleItemClick(item: any) {
      if (item.isDirectory) {
        this.directories.push(item)
        return
      }

      if (isSupportedMusicFormat(item.filename)) {
        this.$store.commit('setPlaylist', this.fileList.filter((val: any) => {
          return isSupportedMusicFormat(val.filename)
        }).map((item: any) => {
          return this.musicItemBuilder(item)
        }))

        this.$store.commit('setMusicItem', this.musicItemBuilder(item))

        this.$nextTick(() => {
          this.$store.commit('setIsPlaylistTab', true)

          bus.emit(ACTION_TOGGLE_PLAY)
        })
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
});
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
}
</style>
