import {addPlaylistMusic} from '@/api/playlist'
import bus, {ACTION_LOCATE_FILE} from '@/utils/bus'

export default {
  data() {
    return {
      isShowFileMenu: false,
      selectedItem: null,
      isLoading: false,
    }
  },
  computed: {
    fileMenuList() {
      if (!this.selectedItem) return
      const sItem = this.selectedItem
      return [
        {
          label: this.$t('msg.add-to-playlist') + '...', action: () => this.addMusic(sItem)
        },
        {
          label: this.$t('msg.locate-file'), action: () => this.locateFile(sItem)
        }
      ]
    }
  },
  watch: {
    isShowFileMenu(val) {
      if (!val) {
        this.selectedItem = null
      }
    }
  },
  methods: {
    handleItemAction(item) {
      this.isShowFileMenu = true
      this.selectedItem = item
    },
    async addMusic(item) {
      try {
        this.isLoading = true
        await addPlaylistMusic({
          // pid: -1,
          title: item.titleDisplay,
          artists: item.artists,
          cover: item.coverOrigin,
          //   desc,
          album: item.album,
          //   tags,
          path: item.path,
          filename: item.filename,
          file: item.filepath
          //   sort,
          //   rank,
        })
        this.$toast.success(this.$t('msg.music-added'))
        this.isShowFileMenu = false
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
      this.isShowFileMenu = false
    }
  }
}
