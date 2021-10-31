<template>
  <MainList
    ref="mainListRef"
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
    <ContextMenuCommon
      ref="fileMenuRef"
      :list-fn="getFileMenuList"
    />
    <ContextMenuCommon
      ref="folderMenuRef"
      :list="folderMenuList"
    />
    <TkModalDialog
      v-model="isShowUploadModal"
      show-close
      persistent
    >
      <FileUpload
        ref="fileUpload"
        :upload-config="uploadConfig"
        @uploaded="handleUploaded"
      />
    </TkModalDialog>
  </MainList>
</template>

<script>
import {MusicItem, NavBarIndex} from '@/enum'
import {FileAction} from '@/enum/service'
import {
  fileAction,
  getList,
  getDownloadUrl,
} from '@/api/music'
import {isSupportedMusicFormat} from '@/utils/is'
import bus, {ACTION_PLAY_START, ACTION_LOCATE_FILE} from '@/utils/bus'
import {downLoadFile} from '@/utils'
import MainList from '@/components/MainList/index.vue'
import FileUpload from '@/components/FileUpload.vue'
import ContextMenuCommon from '@/components/ContextMenuCommon.vue'

export default {
  name: 'ListFilesystem',
  components: {
    MainList,
    FileUpload,
    ContextMenuCommon
  },
  data() {
    return {
      isLoading: false,
      isShowUploadModal: false,
      lastPlayId: -1,
      directories: [],
      fileList: [],
      uploadConfig: {
        path: '',
        filename: ''
      },
      selectedItem: null,
      folderMenuList: [
        {icon: 'create_new_folder', label: this.$t('create-folder'), action: this.createFolder},
        {icon: 'upload_file', label: this.$t('upload-files') + '...', action: this.showUploadDialog},
        {icon: 'drive_folder_upload', label: this.$t('upload-folder') + '...', disabled: true}
      ]
    }
  },
  computed: {
    currentPath() {
      return this.getCurrentPath(this.directories)
    },
  },
  mounted() {
    this.getFileList()
    bus.$on(ACTION_LOCATE_FILE, this.handleLocateFile)
  },
  beforeDestroy() {
    bus.$off(ACTION_LOCATE_FILE, this.handleLocateFile)
  },
  watch: {
    '$route.query.id': {
      handler(id) {
        this.lastPlayId = Number(id) || -1

        if (!id) {
          return
        }
        this.$nextTick(() => {
          this.$refs.mainListRef.locateItem()
        })
      },
      immediate: true
    },
    '$route.query.dir': {
      handler(dir) {
        if (dir) {
          this.setDirectories(JSON.parse(dir))
        }
      },
      immediate: true
    },
    directories: {
      handler(val) {
        this.$router.push({
          query: {
            ...this.$route.query,
            dir: JSON.stringify(val.map(item => item.filename))
          }
        }).catch(e => {
        })
        this.getFileList()
      },
      deep: true
    },
  },
  methods: {
    getFileMenuList(sItem) {
      const list = [
        {icon: 'space_bar', label: this.$t('rename'), action: () => this.actionRenameFile(sItem)},
        {icon: 'delete', label: this.$t('delete'), action: () => this.actionDeleteFile(sItem)},
        !sItem.isDirectory
          ? {icon: 'file_download', label: this.$t('download'), action: () => this.actionDownloadFile(sItem)}
          : {icon: 'archive', label: this.$t('download-archive'), disabled: true},
      ]
      if (!sItem.isDirectory) {
        list.push({icon: 'upgrade', label: this.$t('replace') + '...', action: () => this.actionReplaceFile(sItem)})
      }
      return list
    },
    setDirectories(arr) {
      this.directories = arr.map(item => new MusicItem({
        filename: item,
        isDirectory: true
      }))
    },
    setLastPlayId(id) {
      if (!id && !this.$route.query.id) {
        return
      }
      return this.$router.replace({
        query: {
          ...this.$route.query,
          id: id || ''
        }
      })
    },
    getCurrentPath(directories) {
      let path = ''
      directories.forEach((item) => {
        path += (item.filename + '/')
      })
      return path
    },
    async getFileList() {
      if (this.isLoading) {
        return
      }
      try {
        this.isLoading = true

        const path = this.currentPath

        const {list, playStat, message} = await getList({
          path,
          getPlayStat: true
        })
        if (message) {
          this.$toast.warning(message)
        }
        this.fileList = list.map((file) => {
          return new MusicItem(file)
        })

        const lastFilename = playStat && playStat.file
        if (lastFilename && !this.$route.query.id) {
          const item = list.find(file => file.filename === lastFilename) || {}
          this.lastPlayId = item.id || -1
        }
        this.$nextTick(() => {
          this.$refs.mainListRef.locateItem()
        })
      } catch (e) {
        this.fileList = []
        // this.$toast.error(e.message)
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },
    async handleRefresh() {
      await this.setLastPlayId()
      return this.getFileList()
    },
    goUpDir() {
      this.directories.pop()
    },
    async handleItemClick(item) {
      // jump folder
      if (item.isDirectory) {
        await this.setLastPlayId()
        this.directories.push(item)
        return
      }

      if (isSupportedMusicFormat(item.filename)) {
        this.$store.commit('clearShuffle')
        // format data
        const list = this.fileList.filter((val) => {
          return isSupportedMusicFormat(val.filename)
        })
        this.$store.commit('setPlayingList', list)
        // set current playing
        // playMusicFromList(list, item)
        bus.$emit(ACTION_PLAY_START, {list, item})
        this.lastPlayId = item.id
        this.setLastPlayId()
      } else {
        this.$prompt.create({
          propsData: {
            title: this.$t('msg.format-not-support'),
            btnConfirm: 'Try'
          },
          parentEl: this.$el
        }).onConfirm(async () => {
          window.open(item.getSource(), '_blank')
        })
      }
    },
    handleItemAction(item) {
      this.$refs.fileMenuRef.open(item)
    },
    spliceLocalItem(item, newItem) {
      const index = this.fileList.findIndex(v => v.id === item.id)
      if (index !== -1) {
        if (newItem) {
          this.fileList.splice(index, 1, newItem)
        } else {
          this.fileList.splice(index, 1)
        }
      }
    },
    async actionRenameFile(sItem) {
      if (!sItem) return

      this.$prompt.create({
        propsData: {
          title: `${this.$t('rename')}`,
          input: {
            value: sItem.filename,
            required: true,
            placeholder: sItem.filename,
          }
        },
        parentEl: this.$el
      }).onConfirm(async (context) => {
        const name = context.inputValue
        if (!name || name === sItem.filename) {
          return
        }
        this.isLoading = true
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
          this.isLoading = false
        }
      })
    },
    async actionDeleteFile(sItem) {
      if (!sItem) return

      this.$prompt.create({
        propsData: {
          title: `${this.$t('warning')}!!`,
          content: `${this.$t('delete')} 《${sItem.filename}》?\n${this.$t('msg.this-operation-cannot-be-undone')}`
        },
        parentEl: this.$el
      }).onConfirm(async () => {
        this.isLoading = true
        try {
          await fileAction({
            path: sItem.path,
            filename: sItem.filename,
            action: FileAction.DELETE
          })
          this.spliceLocalItem(sItem)
        } catch (e) {
          console.error(e)
        } finally {
          this.isLoading = false
        }
      })
    },
    async actionDownloadFile(sItem) {
      if (!sItem) return
      this.isLoading = true
      try {
        downLoadFile(getDownloadUrl({
          path: sItem.path,
          filename: sItem.filename,
        }), sItem.filename)
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },
    async actionReplaceFile(sItem) {
      if (!sItem) return
      const path = this.currentPath

      this.uploadConfig = {
        path,
        filename: sItem.filename
      }
      this.$refs.fileUpload.clearFileInput()
      this.isShowUploadModal = true
    },
    showFolderMenu() {
      this.$refs.folderMenuRef.open()
    },
    async createFolder() {
      this.$prompt.create({
        propsData: {
          title: this.$t('create-folder'),
          input: {
            value: '',
            required: true,
            placeholder: this.$t('create-folder'),
          }
        },
        parentEl: this.$el
      }).onConfirm(async (context) => {
        const name = context.inputValue
        if (!name) {
          return
        }
        await fileAction({
          path: this.directories.map(item => item.filename).join('/'),
          action: FileAction.CREATE_FOLDER,
          actionValue: name
        })
        await this.getFileList()
      })
    },
    async showUploadDialog() {
      const path = this.currentPath
      this.uploadConfig = {
        path,
        filename: ''
      }
      this.$refs.fileUpload.clearFileInput()
      this.isShowUploadModal = true
    },
    handleUploaded() {
      setTimeout(() => {
        this.isShowUploadModal = false
        this.$refs.fileUpload.clearFileInput()
        this.$toast.success(this.$t('msg.file-uploaded'))
      }, 500)
      this.getFileList()
    },
    async handleLocateFile(item) {
      setTimeout(() => {
        this.$store.commit('setNavbarIndex', NavBarIndex.LEFT)
      }, 30)
      // console.log(item)

      await this.setLastPlayId(item.id)
      if (item.path !== this.currentPath) {
        this.setDirectories(item.path.split('/').filter(i => i))
      }
    }
  }
}
</script>

<style scoped>

</style>
