import { addPlaylistMusic } from '@/api/playlist'
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
      ],
      isShowChoosePlaylist: false,
      currentAddItem: null
    }
  },
  methods: {
    getFileMenuList(sItem) {
      return [
        { icon: 'my_location', label: this.$t('msg.locate-file'), action: () => this.locateFile(sItem) },
        {
          icon: 'playlist_add', label: this.$t('msg.add-to-playlist') + '...',
          action: () => {
            this.currentAddItem = sItem
            this.isShowChoosePlaylist = true
            // this.addMusic(sItem)
          }
        },
      ]
    },
    showFileMenu(item) {
      this.$refs.fileMenuRef.open(item)
    },
    async addMusic(item, pid) {
      try {
        this.isLoading = true
        await addPlaylistMusic({
          musics: [{ filepath: item.filepath }],
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
      console.log(val)

      if (this.currentAddItem) {
        const item = this.currentAddItem
        this.currentAddItem = null
        this.addMusic(item, val.data.id)
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
    }
  }
}
