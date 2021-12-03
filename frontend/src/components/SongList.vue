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
        @openMenu="showListMenu"
        @onItemAction="showItemMenu"
      >
        <template v-slot:actions>
          <TkButton
            size="no-style"
            :title="$t('refresh')"
            @click="loadSongList"
          ><i class="material-icons">refresh</i>
          </TkButton>
        </template>

        <ContextMenuCommon
          ref="itemMenuRef"
          :list-fn="getItemMenuList"
        />

        <ContextMenuCommon
          ref="listMenuRef"
          :list="menuList"
        />
      </MainList>
    </div>
  </div>
</template>

<script>
import TreePlaylist from './TreePlaylist.vue'
import MainList from '@/components/MainList/index.vue'
import {mapGetters, mapState} from 'vuex'
import {deletePlaylist, getPlaylistMusic, removePlaylistMusic} from '@/api/playlist'
import {MusicItem} from '@/enum'
import bus, {
  ACTION_TOGGLE_PLAY,
  ACTION_PLAY_START,
} from '@/utils/bus'
import ContextMenuCommon from '@/components/ContextMenuCommon'

export default {
  name: 'SongList',
  components: {
    TreePlaylist,
    MainList,
    ContextMenuCommon
  },
  data() {
    return {
      currentNode: null,
      isLoading: false,
      songList: [],
      menuList: [
        { icon: 'save', label: 'Sync playlist', action: () => {}, disabled: true },
        { icon: 'queue', label: 'Save as new playlist', action: () => {}, disabled: true },
        { icon: 'archive', label: this.$t('download-archive'), action: () => {}, disabled: true },
      ],
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
      immediate: true
    }
  },
  methods: {
    getItemMenuList(sItem) {
      return [
        {icon: 'play_arrow', label: 'Play', action: () => this.handleItemClick(sItem)},
        {icon: 'playlist_play', label: 'Play next', action: () => {}, disabled: true},
        {icon: 'playlist_add', label: 'Add to 歌单', action: () => {}, disabled: true},
        {isSeparator: true},
        {icon: 'file_download', label: this.$t('download'), action: () => {}, disabled: true},
        {icon: 'delete', label: 'Remove', action: () => this.handleDeleteItem(sItem)},
        {icon: 'info', label: 'Properties', action: () => {}, disabled: true},
      ]
    },
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
            const pathArr = music.filepath_origin.split('/')
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
    showListMenu(item) {
      this.$refs.listMenuRef.open()
    },
    showItemMenu(item) {
      this.$refs.itemMenuRef.open(item)
    },
    async handleDeleteItem(item) {
      this.$prompt.create({
        propsData: {
          title: this.$t('delete'),
          content: `WARNING!! Remove《${item.title}》?`,
        },
        parentEl: this.$el
      }).onConfirm(async () => {
        await removePlaylistMusic({
          id: item.id
        })

        const index = this.songList.findIndex(v => v.id === item.id)
        if (index > -1) {
          this.songList.splice(index, 1)
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.song-list {
  display: flex;
  height: 100%;
  overflow: hidden;
  .panel-item {
    display: flex !important;
    bottom: 0;

    &.left-panel {
      width: 300px;
      box-sizing: border-box;
      overflow: auto;
      overflow-y: overlay;
    }

    &.right-panel {
      border-left: 1px solid $border-color;
      left: unset;
      right: 0;
      flex: 1;
    }
  }
}
</style>
