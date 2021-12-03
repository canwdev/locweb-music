import {
  migrateMedia
 } from '@/api/playlist'
import bus, {
  ACTION_LOCATE_FILE,
  ACTION_TOGGLE_PLAY,
  ACTION_ADD_PLAYLIST
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
    }
  },
  methods: {
    getItemMenuList(item) {
      return [
        { icon: 'my_location', label: this.$t('msg.locate-file'), action: () => this.locateFile(item) },
        {
          icon: 'playlist_add', label: this.$t('msg.add-to-playlist'),
          action: () => {
            bus.$emit(ACTION_ADD_PLAYLIST, {
              items: [item]
            })
          }
        },
      ]
    },
    showItemMenu(item) {
      this.$refs.itemMenuRef.open(item)
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
