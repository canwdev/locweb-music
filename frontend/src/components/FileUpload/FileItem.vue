<template>
  <div class="file-item">
    <div class="file-info">
      <div class="file-title">
        <div class="_title text-overflow">{{ item.filename }}</div>
        <div class="_subtitle text-overflow">
          {{ item.progress }}%
          {{ item.parentPath || '' }}
        </div>
      </div>
      <div class="file-actions">
        <TkButton
          v-if="item.status === UploadStatus.WAITING || item.status === UploadStatus.ERROR"
          flat
          round
          :title="$t('upload')"
          class="material-icons"
          @click="$emit('upload', item)"
        >
          file_upload
        </TkButton>
        <TkButton
          v-else-if="item.status === UploadStatus.UPLOADING"
          flat
          round
          class="material-icons"
          @click="cancelUpload"
          :title="'Cancel'"
        >
          close
        </TkButton>

        <TkButton
          v-if="item.status !== UploadStatus.UPLOADING"
          round
          flat
          :title="$t('clear')"
          class="material-icons"
          @click="$emit('remove', item)"
        >clear_all
        </TkButton>
      </div>
    </div>
    <div class="file-progress">
      <TkProgress
        :theme="item.status === UploadStatus.ERROR ? 'error' : null"
        :value="item.progress"
      ></TkProgress>
    </div>
  </div>
</template>

<script>
import {UploadStatus} from './enum'

export default {
  name: 'FileItem',
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      UploadStatus
    }
  },
  methods: {
    cancelUpload() {
      this.item.cancelUpload()
      this.$emit('cancel', this.item)
    }
  }
}
</script>

<style lang="scss" scoped>
.file-item {
  padding: 10px;
  position: relative;

  & + .file-item {
    border-top: 1px solid $border-color;
  }

  .file-info {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .file-title {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      ._subtitle {
        margin-top: 5px;
        color: $border-color;
        font-size: 12px;
      }
    }

    .file-actions {
      display: flex;
      align-items: center;
      button + button {
        margin-left: 5px;
      }
    }
  }

  .file-progress {
    font-size: 12px;

    .tk-progress-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      height: 100%;
      z-index: 0;
      border-radius: 0;
      background: transparent;

      ::v-deep .progress {
        background: $primary-opacity;
      }
    }
  }
}
</style>
