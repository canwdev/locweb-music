<template>
  <MainList
      :is-loading="isLoading"
      :list="fileList"
      :show-up="directories.length > 0"
      :active-id="lastPlayIndex"
      :min-item-size="40"
      @onItemClick="handleItemClick"
      @onItemAction="handleItemAction"
      @goUpDir="goUpDir"
      @refresh="getFileList"
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
import {computed, defineComponent, onMounted, ref, watch} from 'vue';
import store from '@/store'
import {useRoute} from 'vue-router'
import router from '@/router'
import {MusicItem} from "@/enum"
import {FileAction} from "@/enum/service"
import {
  fileAction,
  getList,
  getDownloadUrl,
} from "@/api/music"
import {isSupportedMusicFormat} from "@/utils/is";
import bus, {ACTION_PLAY_START,} from "@/utils/bus";
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
    const route = useRoute()
    const isLoading = ref<boolean>(false)
    const isShowUploadModal = ref<boolean>(false)
    const lastPlayIndex = ref(-1)
    const directories = ref<Array<any>>([])
    const fileList = ref<Array<MusicItem>>([])

    const uploadConfig = ref({
      path: '',
      filename: ''
    })
    let fileUpload
    const setFileUploadRef = (ref) => {
      fileUpload = ref
    }

    const getCurrentPath = () => {
      let path = ''
      directories.value.forEach((item: any) => {
        path += (item.filename + '/')
      })
      return path
    }

    const getFileList = async () => {
      if (isLoading.value) {
        return
      }
      try {
        isLoading.value = true
        lastPlayIndex.value = -1

        const path = getCurrentPath()

        const {list, playStat, message} = await getList({
          path,
          getPlayStat: true
        })
        if (message) {
          window.$notify.warning(message)
        }
        const lastFilename = playStat && playStat.file
        fileList.value = list.map((file, index) => {
          if (lastFilename && (file.filename === lastFilename)) {
            lastPlayIndex.value = index
          }
          return new MusicItem(file)
        })

      } catch (e) {
        fileList.value = []
        // window.$notify.error(e.message)
        console.error(e)
      } finally {
        isLoading.value = false
      }

    }

    // watch route change
    watch(() => route.query, (val) => {
      const dir = val.dir
      if (dir) {
        // @ts-ignore
        directories.value = JSON.parse(dir).map(item => new MusicItem({
          filename: item,
          isDirectory: true
        }))
        // console.log('router.query.dir change', val)
      }
    }, {
      immediate: true
    })

    // watch dir change
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

    const handleItemClick = (item: MusicItem) => {
      // jump folder
      if (item.isDirectory) {
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
        lastPlayIndex.value = item.id
      } else {
        window.$swal.fire({
          toast: true,
          width: 300,
          timer: 2500,
          icon: 'warning',
          title: 'Format not support.',
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

    const fileRename = async () => {
      if (!selectedItem.value) return
      const sItem = selectedItem.value
      isShowFileMenu.value = false

      const name = prompt(`Rename 《${sItem.filename}》`, sItem.filename) || ''
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
    const fileDelete = async () => {
      if (!selectedItem.value) return
      const sItem = selectedItem.value
      isShowFileMenu.value = false

      const flag = confirm(`WARNING!! Delete 《${sItem.filename}》?\nThis operation cannot be undone.`)
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
    const fileDownload = async () => {
      if (!selectedItem.value) return
      const sItem = selectedItem.value
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
    const fileReplace = async () => {
      if (!selectedItem.value) return
      const sItem = selectedItem.value
      const path = getCurrentPath()

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
        {label: 'Rename', action: fileRename},
        {label: 'Delete', action: fileDelete},
        !sItem.isDirectory ? {label: 'Download', action: fileDownload} :
            {label: 'Download Archive', disabled: true},
      ]
      if (!sItem.isDirectory) {
        list.push({label: 'Replace...', action: fileReplace})
      }
      return list
    })

    const isShowFolderMenu = ref(false)
    const showFolderMenu = () => {
      isShowFolderMenu.value = true
    }
    const createFolder = async () => {
      const name = prompt(`Create Folder`) || ''
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
      const path = getCurrentPath()
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
        window.$notify.success(`File Uploaded`)
      }, 500)
      getFileList()
    }

    const folderMenuList = [
      {label: 'Create Folder', action: createFolder},
      {label: 'Upload Files...', action: showUploadDialog},
      {label: 'Upload Folder...', disabled: true}
    ]

    onMounted(() => {
      getFileList()
    })

    return {
      isLoading,
      fileList,
      lastPlayIndex,
      directories,
      getFileList,
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
      uploadConfig
    }
  }
})
</script>

<style scoped>

</style>
