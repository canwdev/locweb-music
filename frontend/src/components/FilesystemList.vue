<template>
  <MainList
    ref="mainListRef"
    :is-loading="isLoading"
    :list="fileList"
    :show-up="directories.length > 0"
    :active-id="lastPlayId"
    :min-item-size="40"
    :filter-placeholder="`${$t('filter-in')} ${currentPath || '/'}`"
    show-btn-refresh
    show-btn-menu
    @onItemClick="handleItemClick"
    @onItemAction="handleItemAction"
    @goUpDir="goUpDir"
    @refresh="handleRefresh"
    @openMenu="showFolderMenu"
    @dragover.native="fileDragover"
    @dragleave.native="showDropzone = false"
    @drop.native="fileDrop"
  >
    <ContextMenuCommon
      ref="itemMenuRef"
      :list-fn="getItemMenuList"
    />
    <ContextMenuCommon
      ref="folderMenuRef"
      :list="folderMenuList"
    />
    <TkModalDialog
      v-model="isShowUploadModal"
      :show-close="false"
      persistent
    >
      <FileUpload
        ref="fileUpload"
        :upload-config="uploadConfig"
        @close="getFileList(), isShowUploadModal = false"
      />
    </TkModalDialog>

    <transition name="fade">
      <FileDropzone v-show="showDropzone"/>
    </transition>
  </MainList>
</template>

<script>
import {MusicItem} from '@/enum'
import {FileAction} from '@/enum/service'
import {
  fileAction,
  getList,
} from '@/api/music'
import {isSupportedMusicFormat} from '@/utils/is'
import bus, {
  ACTION_PLAY_START,
  ACTION_LOCATE_FILE,
  ACTION_ADD_PLAYLIST,
  ACTION_DOWNLOAD_FILE,
  ACTION_REFRESH_FILESYSTEM
} from '@/utils/bus'
import MainList from '@/components/MainList/index.vue'
import FileUpload from '@/components/FileUpload/index.vue'
import ContextMenuCommon from '@/components/ContextMenuCommon.vue'
import FileDropzone from './FileDropzone'
import {openInBrowser} from '@/utils/client'

export default {
  name: 'FilesystemList',
  components: {
    MainList,
    FileUpload,
    ContextMenuCommon,
    FileDropzone,
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
        filename: '',
        isUploadMultiple: true,
      },
      selectedItem: null,
      folderMenuList: [
        {icon: 'create_new_folder', label: this.$t('create-folder'), action: this.createFolder},
        {
          icon: 'upload_file', label: this.$t('upload-files') + '...',
          action: () => {
            this.showUploadDialog({
              isOpenChooseDialog: true
            })
          }
        },
        {
          icon: 'drive_folder_upload', label: this.$t('upload-folder') + '...',
          action: () => {
            this.showUploadDialog({
              isUploadFolder: true,
              isOpenChooseDialog: true
            })
          }
        }
      ],
      showDropzone: false,
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
    bus.$on(ACTION_REFRESH_FILESYSTEM, this.handleRefresh)
  },
  beforeDestroy() {
    bus.$off(ACTION_LOCATE_FILE, this.handleLocateFile)
    bus.$off(ACTION_REFRESH_FILESYSTEM, this.handleRefresh)
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
    getItemMenuList(item) {
      let list = []

      if (item.isDirectory) {
        list.push({
          icon: 'play_arrow', label: this.$t('play'), action: () => {
          }, disabled: true
        })
        list.push({
          icon: 'playlist_add', label: '保存为播放列表',
          action: () => {

          }, disabled: true
        })
      } else {
        list.push({icon: 'play_arrow', label: this.$t('play'), action: () => this.handleItemClick(item)})
        list.push(
          {
            icon: 'playlist_play', label: 'Play next', action: () => {
            }, disabled: true
          })
        list.push({
          icon: 'playlist_add', label: this.$t('msg.add-to-playlist'),
          action: () => {
            bus.$emit(ACTION_ADD_PLAYLIST, {
              items: [item]
            })
          }
        })
      }

      list = [...list, ...[
        {isSeparator: true},
        {icon: 'drive_file_rename_outline', label: this.$t('rename'), action: () => this.actionRenameFile(item)},
        {icon: 'delete', label: this.$t('delete'), action: () => this.actionDeleteFile(item)},
        {isSeparator: true},
      ]]

      if (item.isDirectory) {
        list.push({
          icon: 'archive',
          label: this.$t('download-archive'),
          action: () => bus.$emit(ACTION_DOWNLOAD_FILE, item)
        })
      } else {
        list.push({icon: 'swap_horiz', label: this.$t('replace') + '...', action: () => this.actionReplaceFile(item)})
        list.push({
          icon: 'file_download',
          label: this.$t('download'),
          action: () => bus.$emit(ACTION_DOWNLOAD_FILE, item)
        })
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
    async handleItemClick(item, index) {
      // jump folder
      if (item.isDirectory) {
        await this.setLastPlayId()
        this.directories.push(item)
        return
      }

      if (isSupportedMusicFormat(item.filename)) {
        if (this.$store.state.playingList.length) {
          this.$prompt.create({
            propsData: {
              title: `播放确认`,
              content: `播放歌曲《${item.filename}》将替换当前播放列表，是否继续？`,
            },
            parentEl: this.$el
          }).onConfirm(async () => {
            this.playItem(item, index)
          })
        } else {
          this.playItem(item, index)
        }

      } else {
        this.$prompt.create({
          propsData: {
            title: this.$t('msg.format-not-support'),
            btnConfirm: 'Try'
          },
          parentEl: this.$el
        }).onConfirm(async () => {
          openInBrowser(item.getSource())
        })
      }
    },
    playItem(item, index) {
      this.$store.commit('clearShuffle')
      // format data
      let list = this.fileList.map(i => {
        return new MusicItem(i)
      })
      const playItem = list[index]
      list = list.filter((val) => {
        return isSupportedMusicFormat(val.filename)
      })

      this.$store.commit('setPlayingList', list)
      // set current playing
      bus.$emit(ACTION_PLAY_START, {
        list,
        item: playItem,
        isPlay: true
      })
      this.lastPlayId = playItem.id
      this.setLastPlayId()

    },
    handleItemAction(item) {
      this.$refs.itemMenuRef.open(item)
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
    async actionReplaceFile(sItem) {
      if (!sItem) return
      this.showUploadDialog({
        filename: sItem.filename,
        isOpenChooseDialog: true
      })
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
    showUploadDialog(options) {
      const {
        isUploadFolder = false,
        isOpenChooseDialog = false,
        filename = ''
      } = options || {}
      const path = this.currentPath
      this.uploadConfig = {
        path,
        filename,
        isUploadMultiple: true,
        isUploadFolder
      }

      this.isShowUploadModal = true
      if (isOpenChooseDialog) {
        this.$nextTick(() => {
          this.$refs.fileUpload.chooseFiles()
        })
      }

    },
    async handleLocateFile(item) {
      // console.log(item)

      await this.setLastPlayId(item.id)
      if (item.path !== this.currentPath) {
        this.setDirectories(item.path.split('/').filter(i => i))
      }
    },
    // 拖拽上传
    fileDragover(e) {
      this.showDropzone = true
      e.preventDefault()
    },
    fileDrop(e) {
      e.preventDefault()
      this.showDropzone = false
      const files = Array.from(e.dataTransfer.files)
      // console.log('files', files)
      this.$refs.fileUpload.addFiles(files)
      this.showUploadDialog()
    },
  }
}
</script>

<style scoped>

</style>
