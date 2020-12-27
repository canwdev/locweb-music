<template>
  <div class="home">
    <Navbar/>
    <HomeList
        :is-loading="isLoading"
        :list="unitedList"
        :show-up="directories.length > 0 && !isPlaylistTab"
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
    return {
      fileList: [],
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
    unitedList(): any {
      if (this.isPlaylistTab) {
        return this.playlist
      }
      return this.fileList
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
          path += (item.name + '/')
        })

        const res = await getList({
          path
        })
        this.fileList = res
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
        title: item.name,
        filepath: item.path + item.name,
      })
    },
    handleItemClick(item: any) {
      if (item.isDirectory) {
        this.directories.push(item)
        return
      }

      if (isSupportedMusicFormat(item.name)) {
        this.$store.commit('setPlaylist', this.fileList.filter((item: any) => {
          return isSupportedMusicFormat(item.name)
        }).map((item: any) => {
          return this.musicItemBuilder(item)
        }))

        this.$store.commit('setMusicItem', this.musicItemBuilder(item))

        this.$nextTick(() => {
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
