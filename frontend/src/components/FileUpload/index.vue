<template>
  <div class="file-upload-wrap settings-form">
    <div class="settings-title">
      <div class="title-inner text-overflow"><b>{{ $t('upload-to') }}:</b> {{ (uploadConfig.path + uploadConfig.filename) || 'Root dir' }}</div>
      <TkButton
        round
        flat
        :disabled="isUploading"
        @click="handleClose"
      ><i class="material-icons">close</i></TkButton>
    </div>
    <input
      ref="inputRef"
      style="display: none"
      class="input-upload"
      :disabled="isUploading"
      accept="audio/*"
      type="file"
      :webkitdirectory="isUploadFolder"
      :directory="isUploadFolder"
      multiple
      @change="handleInputFileChange($event)"
    />

    <div class="settings-content">
      <div
        class="upload-actions"
      >
        <TkButton @click="chooseFiles">添加文件</TkButton>
        <TkButton v-show="uploadList.length" @click="clearFiles">{{ $t('clear') }} All</TkButton>
        <div style="flex:1"></div>
        <TkButton
          v-show="!isUploading"
          :disabled="!uploadList.length" @click="batchUpload">Batch {{ $t('upload') }}</TkButton>
        <TkButton v-show="isUploading" @click="batchCancel">全部取消</TkButton>
      </div>

      <div v-show="uploadList.length" class="file-upload-list">
        <FileItem
          v-for="(item, index) in uploadList"
          :key="item.id"
          :item="item"
          @upload="handleItemUpload"
          @remove="handleRemoveItem(item, index)"
          @cancel="removeItemTask"
        />
      </div>
    </div>

    <div class="action-btn-row">
      <div class="progress-box">
        <div class="progress-text">
          {{ $t('progress') }} ({{successCount}}/{{uploadList.length}})
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

export default {
  name: 'FileUpload',
  components: {
    FileItem
  },
  props: {
    uploadConfig: {
      type: Object,
      default() {
        return {
          path: 'Upload',
          filename: ''
        }
      }
    }
  },
  data() {
    return {
      UploadStatus,
      isUploading: false,
      isUploadFolder: false,
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

      console.log('>>> handleInputFileChange', files)

      if (this.isUploadFolder) {
        // this.uploadFolders(files)
      } else {
        this.addFiles(files)
      }

      // clear files
      this.$refs.inputRef.files = new DataTransfer().files
    },
    addFiles(files) {
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
    }
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
    overflow: auto;
    border-radius: $border-radius;
  }
}
</style>
