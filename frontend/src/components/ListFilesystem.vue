<template>
  <MainList
      :ref="setMainListRef"
      :is-loading="isLoading"
      :list="fileList"
      :show-up="directories.length > 0"
      :active-id="lastPlayId"
      :min-item-size="40"
      :filter-placeholder="`${$t('filter-in')} ${currentPath || '/'}`"
      @onItemClick="handleItemClick"
      @onItemAction="handleItemAction"
      @goUpDir="goUpDir"
      @refresh="handleRefresh"
      @openMenu="showFolderMenu"
  >
    <DialogMenu
        v-model:visible="isShowFileMenu"
        :list="fileMenuList"
    />
    <DialogMenu
        v-model:visible="isShowFolderMenu"
        auto-close
        :list="folderMenuList"
    />
    <ModalDialog
        v-model:visible="isShowUploadModal"
        is-show-close
        persistent
        :dark="isDarkTheme"
    >
      <FileUpload
          @uploaded="handleUploaded"
          :upload-config="uploadConfig"
          :ref="setFileUploadRef"
      />
    </ModalDialog>
  </MainList>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, onBeforeUnmount, ref, watch, nextTick} from 'vue';
import {useI18n} from "vue-i18n";
import store from '@/store'
import {useRoute} from 'vue-router'
import router from '@/router'
import {MusicItem, NavBarIndex} from "@/enum"
import {FileAction} from "@/enum/service"
import {
  fileAction,
  getList,
  getDownloadUrl,
} from "@/api/music"
import {isSupportedMusicFormat} from "@/utils/is";
import bus, {ACTION_PLAY_START, ACTION_LOCATE_FILE} from "@/utils/bus";
import {downLoadFile} from "@/utils";
import MainList from "@/components/MainList/index.vue";
import DialogMenu from "@/components/DialogMenu.vue";
import FileUpload from "@/components/FileUpload.vue";
import ModalDialog from '@/components/ModalDialog.vue'

export default defineComponent({
  name: "ListFilesystem",
  components: {
    MainList,
    DialogMenu,
    FileUpload,
    ModalDialog
  },
  setup() {
    const {t} = useI18n()
    const route = useRoute()
    const isLoading = ref<boolean>(false)
    const isShowUploadModal = ref<boolean>(false)
    const lastPlayId = ref(-1)
    const directories = ref<Array<any>>([])
    const fileList = ref<Array<MusicItem>>([])
    let mainListRef
    const setMainListRef = (ref) => {
      mainListRef = ref
    }

    const setDirectories = (arr) => {
      return directories.value = arr.map(item => new MusicItem({
        filename: item,
        isDirectory: true
      }))
    }

    const setLastPlayId = (id?) => {
      return router.replace({
        query: {
          ...route.query,
          id: id || ''
        }
      })
    }

    const uploadConfig = ref({
      path: '',
      filename: ''
    })
    let fileUpload
    const setFileUploadRef = (ref) => {
      fileUpload = ref
    }

    const getCurrentPath = (directories) => {
      let path = ''
      directories.forEach((item: any) => {
        path += (item.filename + '/')
      })
      return path
    }

    const currentPath = computed(() => {
      return getCurrentPath(directories.value)
    })

    const getFileList = async () => {
      if (isLoading.value) {
        return
      }
      try {
        isLoading.value = true

        const path = currentPath.value

        const {list, playStat, message} = await getList({
          path,
          getPlayStat: true
        })
        if (message) {
          window.$notify.warning(message)
        }
        fileList.value = list.map((file) => {
          return new MusicItem(file)
        })

        const lastFilename = playStat && playStat.file
        if (lastFilename && !route.query.id) {
          const item = list.find(file => file.filename === lastFilename) || {}
          lastPlayId.value = item.id || -1
        }
        nextTick(() => {
          mainListRef.locateItem()
        })
      } catch (e) {
        fileList.value = []
        // window.$notify.error(e.message)
        console.error(e)
      } finally {
        isLoading.value = false
      }

    }

    const handleRefresh = async () => {
      await setLastPlayId()
      return getFileList()
    }

    // watch route change
    watch(() => route.query.id, (id) => {
      if (id) {
        lastPlayId.value = Number(id) || -1
      }
      nextTick(() => {
        mainListRef.locateItem()
      })
    }, {
      immediate: true
    })
    watch(() => route.query.dir, (dir) => {
      if (dir) {
        // @ts-ignore
        setDirectories(JSON.parse(dir))
        // console.log('router.query.dir change', val)
      }
    }, {
      immediate: true
    })

    // watch directories change
    watch(directories, (val) => {
      // console.log('directories changed', {val, router, route})

      router.push({
        query: {
          ...route.query,
          dir: JSON.stringify(val.map(item => item.filename))
        }
      })
      getFileList()
    }, {
      deep: true
    })

    const goUpDir = () => {
      directories.value.pop()
    }

    const handleItemClick = async (item: MusicItem) => {
      // jump folder
      if (item.isDirectory) {
        await setLastPlayId()
        directories.value.push(item)
        return
      }

      if (isSupportedMusicFormat(item.filename)) {
        store.commit('clearShuffle')
        // format data
        const list = fileList.value.filter((val: any) => {
          return isSupportedMusicFormat(val.filename)
        })
        store.commit('setPlayingList', list)
        // set current playing
        // playMusicFromList(list, item)
        bus.emit(ACTION_PLAY_START, {list, item})
        lastPlayId.value = item.id
        setLastPlayId()
      } else {
        window.$swal.fire({
          toast: true,
          width: 300,
          timer: 2500,
          icon: 'warning',
          title: t('msg.format-not-support'),
          showConfirmButton: true,
          confirmButtonText: 'Try'
        }).then((result) => {
          if (result.isConfirmed) {
            window.open(item.getSource(), '_blank')
          }
        })
      }
    }

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

    // remove local list item
    const spliceLocalItem = (item, newItem?: MusicItem) => {
      // @ts-ignore
      const index = fileList.value.findIndex(v => v.id === item.id)
      if (index !== -1) {
        if (newItem) {
          fileList.value.splice(index, 1, newItem)
        } else {
          fileList.value.splice(index, 1)
        }
      }
    }

    const actionRenameFile = async (sItem) => {
      if (!sItem) return
      isShowFileMenu.value = false

      const name = prompt(`${ t('rename') } 《${sItem.filename}》`, sItem.filename) || ''
      if (!name) {
        return
      }
      isLoading.value = true
      try {
        const {newName} = await fileAction({
          path: sItem.path,
          filename: sItem.filename,
          action: FileAction.RENAME,
          actionValue: name
        })
        sItem.filename = newName
      } catch (e) {
        console.error(e)
      } finally {
        isLoading.value = false
      }

    }
    const actionDeleteFile = async (sItem) => {
      if (!sItem) return
      isShowFileMenu.value = false

      const flag = confirm(`${ t('warning') }!! ${ t('delete') } 《${sItem.filename}》?\n${ t('msg.this-operation-cannot-be-undone') }`)
      if (!flag) {
        return
      }

      isLoading.value = true
      try {
        await fileAction({
          path: sItem.path,
          filename: sItem.filename,
          action: FileAction.DELETE
        })
        spliceLocalItem(sItem)
      } catch (e) {
        console.error(e)
      } finally {
        isLoading.value = false
      }
    }
    const actionDownloadFile = async (sItem) => {
      if (!sItem) return
      isLoading.value = true
      try {
        downLoadFile(getDownloadUrl({
          path: sItem.path,
          filename: sItem.filename,
        }), sItem.filename)
      } catch (e) {
        console.error(e)
      } finally {
        isLoading.value = false
      }
    }
    const actionReplaceFile = async (sItem) => {
      if (!sItem) return
      const path = currentPath.value

      uploadConfig.value = {
        path,
        filename: sItem.filename
      }
      fileUpload.clearFileInput()
      isShowUploadModal.value = true
      isShowFileMenu.value = false
    }

    const fileMenuList = computed(() => {
      if (!selectedItem.value) return
      const sItem = selectedItem.value
      const list = [
        {label: t('rename'), action: () => actionRenameFile(sItem)},
        {label: t('delete'), action: () => actionDeleteFile(sItem)},
        !sItem.isDirectory ? {label: t('download'), action: () => actionDownloadFile(sItem)} :
            {label: t('download-archive'), disabled: true},
      ]
      if (!sItem.isDirectory) {
        list.push({label: t('replace') + '...', action: () => actionReplaceFile(sItem)})
      }
      return list
    })

    const isShowFolderMenu = ref(false)
    const showFolderMenu = () => {
      isShowFolderMenu.value = true
    }
    const createFolder = async () => {
      const name = prompt(t('create-folder')) || ''
      if (!name) {
        return
      }

      await fileAction({
        path: directories.value.map(item => item.filename).join('/'),
        action: FileAction.CREATE_FOLDER,
        actionValue: name
      })
      getFileList()
    }

    // upload files
    const showUploadDialog = async () => {
      const path = currentPath.value
      uploadConfig.value = {
        path,
        filename: ''
      }
      fileUpload.clearFileInput()
      isShowUploadModal.value = true
    }
    const handleUploaded = () => {
      setTimeout(() => {
        isShowUploadModal.value = false
        fileUpload.clearFileInput()
        window.$notify.success(t('msg.file-uploaded'))
      }, 500)
      getFileList()
    }

    const folderMenuList = [
      {label: t('create-folder'), action: createFolder},
      {label: t('upload-files')+'...', action: showUploadDialog},
      {label: t('upload-folder')+'...', disabled: true}
    ]

    const handleLocateFile = async (item) => {
      setTimeout(() => {
        store.commit('setNavbarIndex', NavBarIndex.LEFT)
      }, 30)
      // console.log(item)

      await setLastPlayId(item.id)
      if (item.path !== currentPath.value) {
        setDirectories(item.path.split('/').filter(i => i))
      }
    }

    onMounted(() => {
      getFileList()
      bus.on(ACTION_LOCATE_FILE, handleLocateFile)
    })

    onBeforeUnmount(() => {
      bus.off(ACTION_LOCATE_FILE, handleLocateFile)
    })

    return {
      setMainListRef,
      isLoading,
      fileList,
      lastPlayId,
      directories,
      getFileList,
      handleRefresh,
      goUpDir,
      handleItemClick,
      handleItemAction,
      isShowFileMenu,
      fileMenuList,
      showFolderMenu,
      isShowFolderMenu,
      folderMenuList,
      isShowUploadModal,
      handleUploaded,
      setFileUploadRef,
      uploadConfig,
      isDarkTheme: computed(() => store.getters.isDarkTheme),
      currentPath
    }
  }
})
</script>

<style scoped>

</style>
