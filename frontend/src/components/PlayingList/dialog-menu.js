import {migrateMedia} from '@/api/playlist'
import bus, {
  ACTION_ADD_PLAYLIST,
  ACTION_DOWNLOAD_FILE,
  ACTION_LOCATE_FILE,
  ACTION_NEXT, ACTION_REFRESH_FILESYSTEM,
  ACTION_TOGGLE_PLAY
} from '@/utils/bus'
import {fileAction} from '@/api/music'
import {FileAction} from '@/enum/service'

export default {
  data() {
    return {
      menuList: [
        {icon: 'queue', label: '保存播放列表...', action: this.savePlaylist},
        {icon: 'clear_all', label: '清空播放列表', action: this.clearPlaylistConfirm},
        {isSeparator: true},
        {icon: 'sync', label: '[DEBUG] Migrate media', action: this.migrateMedia},
      ],
    }
  },
  methods: {
    getItemMenuList({item, index}) {
      const list = []
      const isFile = !item.isMigrated && !item.isOutSource
      if (isFile) {
        list.push({icon: 'my_location', label: this.$t('msg.locate-file'), action: () => this.locateFile(item)})
      }
      list.push({
        icon: 'playlist_add', label: this.$t('msg.add-to-playlist'),
        action: () => {
          bus.$emit(ACTION_ADD_PLAYLIST, {
            items: [item]
          })
        }
      })
      list.push({icon: 'clear_all', label: '移除', action: () => this.removeItemConfirm(item, index)})

      list.push({
        icon: 'file_download', label: this.$t('download'), action: () => bus.$emit(ACTION_DOWNLOAD_FILE, item)
      })

      list.push({isSeparator: true})

      if (isFile) {
        list.push({
          icon: 'delete', label: this.$t('delete'), action: () => this.deleteItemConfirm(item, index)
        })
      }
      return list
    },
    showItemMenu(item, index) {
      this.$refs.itemMenuRef.open({item, index})
    },
    locateFile(item) {
      if (!item) {
        return
      }
      bus.$emit(ACTION_LOCATE_FILE, item)
    },
    showListMenu() {
      this.$refs.listMenuRef.open()
    },
    savePlaylist() {
      if (!this.playingList.length) {
        return
      }
      bus.$emit(ACTION_ADD_PLAYLIST, {
        items: this.playingList
      })
    },
    clearPlaylistConfirm() {
      if (!this.playingList.length) {
        return
      }
      this.$prompt.create({
        propsData: {
          title: '清空播放列表？',
        },
        parentEl: this.$el
      }).onConfirm(async () => {
        this.clearPlaylist()
      })
    },
    clearPlaylist() {
      this.$store.commit('setPlayingList', [])
      this.playingIndex = 0
      bus.$emit(ACTION_TOGGLE_PLAY, {isPause: true})
      setTimeout(() => {
        this.$store.commit('setMusicItem', null)
      })
    },
    removeItemConfirm(item, index) {
      this.$prompt.create({
        propsData: {
          title: `从正在播放的列表中移除《${item.titleDisplay}》？`,
        },
        parentEl: this.$el
      }).onConfirm(async () => {
        this.removeItem(index)
      })
    },
    removeItem(index) {
      if (this.playingIndex === index) {
        bus.$emit(ACTION_NEXT)
      }
      this.playingList.splice(index, 1)

      this.$nextTick(() => {
        if (!this.playingList.length) {
          this.clearPlaylist()
          return
        }

        this.playingIndex = this.playingList.findIndex(i => i.id === this.musicItem.id)
      })
    },
    deleteItemConfirm(item, index) {
      this.$prompt.create({
        propsData: {
          title: `${this.$t('warning')}!!`,
          content: `${this.$t('delete')} 《${item.filename}》?\n${this.$t('msg.this-operation-cannot-be-undone')}`
        },
        parentEl: this.$el
      }).onConfirm(async () => {
        await fileAction({
          path: item.path,
          filename: item.filename,
          action: FileAction.DELETE
        })
        this.removeItem(index)
        bus.$emit(ACTION_REFRESH_FILESYSTEM)
      })
    },
    async migrateMedia() {
      await migrateMedia()
    }
  }
}
