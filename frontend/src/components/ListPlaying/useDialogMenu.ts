import {computed, ref, watch} from 'vue'
import {MusicItem} from "@/enum";
import {addPlaylistMusic} from "@/api/playlist";

export default function (isLoading) {
  const isShowFileMenu = ref<boolean>(false)
  const selectedItem = ref<MusicItem | null>(null)
  const handleItemAction = (item: MusicItem) => {
    isShowFileMenu.value = true
    selectedItem.value = item
  }
  watch(isShowFileMenu, (val) => {
    if (!val) {
      selectedItem.value = null
    }
  })
  const addMusic = async (item: MusicItem) => {
    try {
      console.log(item);
      isLoading.value = true
      await addPlaylistMusic({
        // pid: -1,
        title: item.titleDisplay,
        artists: item.artists,
        cover: item.coverOrigin,
        //   desc,
        album: item.album,
        //   tags,
        file: item.filepath
        //   sort,
        //   rank,
      })
      window.$notify.success(`Music Added`)
      isShowFileMenu.value = false
    } catch (e) {
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  const fileMenuList = computed(() => {
    if (!selectedItem.value) return
    const sItem = selectedItem.value
    return [
      {
        label: 'Add To Playlist...', action: () => addMusic(sItem)
      }
    ]
  })
  return {
    isShowFileMenu,
    fileMenuList,
    handleItemAction,
  }
}
