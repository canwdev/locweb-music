import {
  addPlaylistMusic,
  migrateMedia
 } from '@/api/playlist'
import bus, {
  ACTION_LOCATE_FILE,
  ACTION_TOGGLE_PLAY,
} from '@/utils/bus'

export default {
  data() {
    return {
      menuList: [
        { icon: 'queue', label: 'Save playlist...', action: this.savePlaylist },
        { icon: 'clear_all', label: 'Clear playlist', action: this.clearPlaylist },
        {isSeparator: true},
        { icon: 'sync', label: 'Migrate media', action: this.migrateMedia },
      ],
      isShowChoosePlaylist: false,
      currentAddItem: null
    }
  },
  methods: {
    getItemMenuList(item) {
      return [
        { icon: 'my_location', label: this.$t('msg.locate-file'), action: () => this.locateFile(item) },
        {
          icon: 'playlist_add', label: this.$t('msg.add-to-playlist'),
          action: () => {
            this.currentAddItem = item
            this.isShowChoosePlaylist = true
          }
        },
      ]
    },
    showItemMenu(item) {
      this.$refs.itemMenuRef.open(item)
    },
    async addMusic(items, pid) {
      try {
        this.isLoading = true
        await addPlaylistMusic({
          musics: items.map(item => {
            return{ filepath: item.filepath }
          }),
          pid: pid,
        })
        this.$toast.success(this.$t('msg.music-added'))
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
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
      // if (!this.playingList.length) {
      //   return
      // }
      this.currentAddItem = null
      this.isShowChoosePlaylist = true
    },
    handleChoosePlaylist(val) {
      const pid = val.data.id

      if (this.currentAddItem) {
        const item = this.currentAddItem
        this.currentAddItem = null
        this.addMusic([item], pid)
      } else {
        this.addMusic(this.playingList, pid)
      }
    },
    clearPlaylist() {
      if (!this.playingList.length) {
        return
      }
      this.$prompt.create({
        propsData: {
          title: 'Clear playlist?',
        },
        parentEl: this.$el
      }).onConfirm(async () => {
        this.$store.commit('setPlayingList', [])
        this.playingIndex = 0
        bus.$emit(ACTION_TOGGLE_PLAY, { isPause: true })
        setTimeout(() => {
          this.$store.commit('setMusicItem', null)
        })
      })
    },
    async migrateMedia() {
      await migrateMedia()
    }
  }
}
