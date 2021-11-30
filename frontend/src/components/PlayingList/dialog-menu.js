import {addPlaylistMusic} from '@/api/playlist'
import bus, {ACTION_LOCATE_FILE} from '@/utils/bus'

export default {
  data() {
    return {}
  },
  methods: {
    getFileMenuList(sItem) {
      return [
        {icon: 'my_location', label: this.$t('msg.locate-file'), action: () => this.locateFile(sItem)},
        {icon: 'playlist_add', label: this.$t('msg.add-to-playlist') + '...', action: () => this.addMusic(sItem)},
      ]
    },
    handleItemAction(item) {
      this.$refs.fileMenuRef.open(item)
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
    }
  }
}
