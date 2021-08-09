import {computed, ref, watch} from 'vue'
import {useI18n} from "vue-i18n";
import {MusicItem} from "@/enum";
import {addPlaylistMusic} from "@/api/playlist";
import bus, {ACTION_LOCATE_FILE} from "@/utils/bus";

export default function (isLoading) {
  const {t} = useI18n()
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
      window.$notify.success(t('msg.music-added'))
      isShowFileMenu.value = false
    } catch (e) {
      console.error(e)
    } finally {
      isLoading.value = false
    }
  }

  const locateFile = (item) => {
    if (!item) {
      return
    }
    bus.emit(ACTION_LOCATE_FILE, item)
    isShowFileMenu.value = false
  }

  const fileMenuList = computed(() => {
    if (!selectedItem.value) return
    const sItem = selectedItem.value
    return [
      {
        label: t('msg.add-to-playlist') + '...', action: () => addMusic(sItem)
      },
      {
        label: t('msg.locate-file'), action: () => locateFile(sItem)
      }
    ]
  })
  return {
    isShowFileMenu,
    fileMenuList,
    handleItemAction,
  }
}
