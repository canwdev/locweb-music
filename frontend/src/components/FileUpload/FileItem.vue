<template>
  <div class="file-item">
    <div class="file-info">
      <div class="file-title text-overflow">{{ item.filename }}</div>
      <div class="file-actions">
        <TkButton
          v-if="item.status === UploadStatus.WAITING || item.status === UploadStatus.ERROR"
          size="xs"
          @click="$emit('upload', item)"
        >
          上传
        </TkButton>
        <TkButton
          v-else-if="item.status === UploadStatus.UPLOADING"
          size="xs"
          class="btn-with-progress"
          @click="cancelUpload"
        >
          <div class="progress-text">{{ item.progress }}%</div>
          <div class="btn-text">取消</div>
        </TkButton>

        <TkButton v-if="item.status !== UploadStatus.UPLOADING" size="xs" @click="$emit('remove', item)">

          {{ item.status === UploadStatus.SUCCESS ? '完成' : $t('clear') }}
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
    }

    .file-actions {
      button + button {
        margin-left: 5px;
      }

      .btn-with-progress {
        display: inline-block;
        min-width: 50px;

        .progress-text {
          display: inline-block;
        }

        .btn-text {
          display: none;
        }

        &:hover {
          .progress-text {
            display: none;
          }

          .btn-text {
            display: inline-block;
          }
        }
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
