<template>
  <div class="song-list">
    <div class="panel-item left-panel">
      <TreePlaylist
        :selected.sync="currentNode"
      />
    </div>
    <div class="panel-item right-panel">
      <MainList
        ref="mainListRef"
        :is-loading="isLoading"
        :list="songList"
        :active-id="playingId"
        is-play-list
        :is-paused="paused"
        :min-item-size="55"
        allow-sort
        show-btn-menu
        :filter-placeholder="$t('filter-by-name')"
        @onItemClick="handleItemClick"
      >
      </MainList>
    </div>
  </div>
</template>

<script>
import TreePlaylist from "./TreePlaylist.vue"
import MainList from '@/components/MainList/index.vue'
import {mapGetters, mapState} from 'vuex'
import {getPlaylistMusic} from '@/api/playlist'
import {MusicItem} from '@/enum'
import bus, {
  ACTION_TOGGLE_PLAY,
  ACTION_PLAY_START,
} from '@/utils/bus'

export default {
  name: "SongList",
  components: {
    TreePlaylist,
    MainList
  },
  data() {
    return {
      currentNode: null,
      isLoading: false,
      songList: []
    }
  },
  computed: {
    ...mapState([
      'paused',
      'musicItem',
    ]),
    playingId() {
      return this.musicItem.id
    },
    playingIndex: {
      get() {
        return this.$store.state.playingIndex
      },
      set(val) {
        this.$store.commit('setPlayingIndex', val)
      }
    },
  },
  watch: {
    currentNode: {
      handler(val) {
        if (!val || !val.data) {
          return
        }
        this.loadSongList()
      },
      immidate: true
    }
  },
  methods: {
    async loadSongList() {
      try {
        this.isLoading = true

        const {list, path} = await getPlaylistMusic({
          pid: this.currentNode.data.id
        })

        this.songList = list.map(item => {
          const {music} = item
          const params = {
            ...music,
            id: item.id,
            isDetailLoaded: true,
          }
          if (music.filepath) {
            params.path = path + '/'
            params.filename = music.filepath
          } else {
            const pathArr = music.filepathOrigin.split('/')
            const filename = pathArr.pop()
            params.path = pathArr.join('/') + '/'
            params.filename = filename
          }
          if (music.cover) {
            params.cover = `/images/${music.cover}`
          }
          return new MusicItem(params)
        })

      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },
    handleItemClick(item) {
      if (item.isDirectory) {
        return
      }

      // play a song
      this.playMusicFromList(this.songList, item)
    },
    playMusicFromList(list, item) {
      this.$store.commit('setPlayingList', list)
      bus.$emit(ACTION_PLAY_START, {list, item})
    },
  }
};
</script>

<style lang="scss" scoped>
.song-list {
  .panel-item {
    position: absolute;
    overflow: hidden;
    top: 0;
    left: 0;
    display: flex !important;
    width: 50%;
    bottom: 0;
    &.right-panel {
      border-left: 1px solid $border-color;
      left: unset;
      right: 0;
    }
  }
}
</style>