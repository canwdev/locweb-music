<template>
  <div class="file-upload-wrap">
    <div class="title-box">
      <b>{{ $t('upload-to') }}:</b> {{ (uploadConfig.path + uploadConfig.filename) || 'Root dir' }}
    </div>

    <form
      id="uploadForm"
      class="upload-form"
      action="javascript:"
      method="post"
      encType="multipart/form-data"
      @submit="handleSubmit"
    >
      <input
        ref="inputRef"
        class=" input-upload"
        :disabled="isUploading"
        type="file"
        name="sampleFile"
      />
      <TkButton type="button" :disabled="isUploading" @click="clearFileInput">{{ $t('clear') }}</TkButton>
      <TkButton type="submit">{{ $t('upload') }}</TkButton>
    </form>

    <div class="progress-box">
      <div class="progress-text">
        {{ $t('progress') }}: {{ progress }}%
      </div>
      <TkProgress :value="progress"></TkProgress>
    </div>
  </div>
</template>

<script>
import {uploadFile} from '@/api/music'

export default {
  name: 'FileUpload',
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
      progress: 0,
      isUploading: false,

    }
  },
  methods: {
    async handleSubmit() {
      const input = this.$refs.inputRef
      const files = input.files
      if (!files.length) {
        this.$toast.error(this.$t('msg.please-select-a-file-to-upload'))
        return
      }

      try {
        this.isUploading = true
        this.progress = 0
        const result = await uploadFile({
          file: files[0],
          ...this.uploadConfig
        }, {
          onUploadProgress: (event) => {
            this.progress = Math.round((event.loaded * 100) / event.total)
          }
        })
        console.log('ok', result)
        this.$emit('uploaded', result)
      } catch (e) {
        console.error(e)
        this.$toast.error(e)
      } finally {
        this.isUploading = false
      }
    },
    clearFileInput() {
      this.$refs.inputRef.files = new DataTransfer().files
      this.progress = 0
    }
  },
}
</script>

<style lang="scss" scoped>
.file-upload-wrap {
  padding: 20px;
  max-width: 500px;
  border-radius: $border-radius;

  .title-box {
    margin-bottom: 10px;
  }

  .upload-form {
    display: flex;
    align-items: center;
    height: 30px;

    .input-upload {
      width: 100%;
      flex: 1;
    }

    input, button {
      height: 100%;
      display: block;
    }

    button {
      margin-left: 5px;
    }
  }

  .progress-box {
    margin-top: 10px;

    .progress-text {
      margin-bottom: 5px;
    }
  }
}
</style>
