<template>
  <div
    class="file-upload-wrap settings-form"
    @dragover.prevent.stop
    @dragleave.prevent.stop
    @drop.prevent.stop
  >
    <div class="settings-title">
      <div class="title-inner text-overflow">
        {{ $t('upload-to') }}: {{ (uploadConfig.path + uploadConfig.filename) || 'Root dir' }}
      </div>
      <TkButton
        round
        flat
        :disabled="isUploading"
        class="material-icons"
        @click="handleClose"
      >close</TkButton>
    </div>
    <input
      ref="inputRef"
      style="display: none"
      class="input-upload"
      :disabled="isUploading"
      accept="audio/*"
      type="file"
      :webkitdirectory="uploadConfig.isUploadFolder"
      :directory="uploadConfig.isUploadFolder"
      :multiple="uploadConfig.isUploadMultiple"
      @change="handleInputFileChange($event)"
    />

    <div
      class="settings-content"
    >
      <div
        class="upload-actions"
      >
        <TkButton
          :title="uploadConfig.isUploadFolder ? '选择文件夹' : '添加文件'"
          class="material-icons"
          @click="chooseFiles"
        >
          {{ uploadConfig.isUploadFolder ? 'create_new_folder' : 'note_add' }}
        </TkButton>
        <TkButton
          v-show="uploadList.length"
          :title="$t('clear')"
          class="material-icons"
          @click="clearFiles"
        >
          clear_all
        </TkButton>
        <div style="flex:1"></div>
        <TkButton
          v-show="!isUploading"
          :disabled="!uploadList.length"
          @click="batchUpload"
          :title="$t('upload')"
          class="material-icons"
        >file_upload
        </TkButton>
        <TkButton
          v-show="isUploading"
          title="全部取消"
          @click="batchCancel"
          class="material-icons"
        >close</TkButton>
      </div>

      <div
        class="file-upload-list relative-position"
        @dragover.prevent.stop="fileDragover"
        @dragleave.prevent.stop="showDropzone = false"
        @drop.prevent.stop="fileDrop"
      >
        <transition name="fade">
          <FileDropzone v-show="showDropzone"/>
        </transition>

        <FileItem
          v-for="(item, index) in uploadList"
          :key="item.id"
          :item="item"
          @upload="handleItemUpload"
          @remove="handleRemoveItem(item, index)"
          @cancel="removeItemTask"
        />

        <TkEmpty v-show="!uploadList.length" class="cursor-pointer" @click.native="chooseFiles"/>
      </div>
    </div>

    <div class="action-btn-row">
      <div class="progress-box">
        <div class="progress-text">
          {{ $t('progress') }} ({{ successCount }}/{{ uploadList.length }})
        </div>
        <TkProgress :value="progress"></TkProgress>
        <div class="progress-text">
          {{ progress }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {FileUploadItem, UploadStatus} from './enum'
import FileItem from './FileItem'
import {TaskQueue} from '@/utils/task-queue'
import FileDropzone from '../FileDropzone'

export default {
  name: 'FileUpload',
  components: {
    FileItem,
    FileDropzone
  },
  props: {
    uploadConfig: {
      type: Object,
      default() {
        return {
          path: 'Upload',
          filename: '',
          isUploadMultiple: true,
        }
      }
    }
  },
  data() {
    return {
      UploadStatus,
      isUploading: false,
      showDropzone: false,
      uploadList: [],
    }
  },
  computed: {
    successCount() {
      return this.uploadList.filter(item => item.status === UploadStatus.SUCCESS).length || 0
    },
    progress() {
      if (!this.uploadList.length) {
        return 0
      }
      return ((this.successCount / this.uploadList.length) * 100).toFixed(0)
    }
  },
  mounted() {
    this.uploadQueue = new TaskQueue({
      concurrent: 1,
      taskHandler: this.taskHandler
    })
  },
  methods: {
    chooseFiles() {
      this.$refs.inputRef.click()
    },
    handleInputFileChange(e) {
      const files = [...e.target.files]
      if (files.length === 0) return

      this.addFiles(files)

      // clear files
      this.$refs.inputRef.files = new DataTransfer().files
    },
    addFiles(files) {
      if (!files) {
        return
      }
      console.log('addFiles', files)
      if (!this.uploadConfig.isUploadMultiple && this.uploadList.length >= 1) {
        const item = new FileUploadItem(files[0])
        this.uploadList = [item]
        return
      }
      files.forEach(file => {
        const item = new FileUploadItem(file)
        this.uploadList.push(item)
        if (this.isUploading) {
          this.uploadQueue.addTask(item)
        }
      })
    },
    handleItemUpload(item) {
      item.upload(this.uploadConfig)
    },
    handleRemoveItem(item, index) {
      this.uploadList.splice(index, 1)
      this.removeItemTask(item)
    },
    removeItemTask(item) {
      if (item._tqTask) {
        this.uploadQueue.removeTask(item._tqTask)
      }
    },
    batchUpload() {
      if (!this.uploadList.length) {
        this.$toast.error(this.$t('msg.please-select-a-file-to-upload'))
        return
      }

      this.isUploading = true
      this.uploadQueue.addTasks(this.uploadList)
      this.uploadQueue.once('allDone', () => {
        // this.$emit('uploaded')
        this.isUploading = false
      })
    },
    batchCancel() {
      this.uploadQueue.removeAllTask()
      this.uploadList.forEach(item => {
        item.cancelUpload()
      })
      this.isUploading = false
    },
    taskHandler(task) {
      const {data} = task
      return new Promise(async (resolve, reject) => {
        try {
          await data.upload(this.uploadConfig)
          resolve()
        } catch (e) {
          reject(e)
        }
      })
    },
    clearFiles() {
      this.uploadList = this.uploadList.filter(item => {
        return item.status === UploadStatus.UPLOADING || item.status === UploadStatus.ERROR
      })
    },
    handleClose() {
      this.batchCancel()
      this.uploadList = []
      this.$emit('close')
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
      this.addFiles(files)
    },
  },
}
</script>

<style lang="scss" scoped>
.file-upload-wrap {

  .settings-title {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    .title-inner {
      display: flex;
      align-items: center;
      flex: 1;
      height: 34px;
    }
  }

  .upload-actions {
    display: flex;
    align-items: center;

    button + button {
      margin-left: 5px;
    }
  }

  .progress-box {
    font-size: 12px;
    display: flex;
    align-items: center;

    .progress-text {
      min-width: 35px;
      text-align: center;
      color: $border-color;
    }

    .tk-progress-bar {
      flex: 1;
      margin-left: 5px;
      margin-right: 5px;
    }
  }

  .file-upload-list {
    margin-top: 10px;
    border: 1px solid $border-color;
    max-height: 50vh;
    min-height: 168px;
    overflow: auto;
    border-radius: $border-radius;
  }
}
</style>
