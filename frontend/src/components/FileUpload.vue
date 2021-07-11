<template>
  <div class="file-upload-wrap">
    <div class="title-box">
      <b>Upload to:</b> {{ (uploadConfig.path + uploadConfig.filename) || 'Root dir' }}
    </div>

    <form
        class="upload-form"
        id='uploadForm'
        action='javascript:'
        method='post'
        encType="multipart/form-data"
        @submit="handleSubmit"
    >
      <input class="input-styled input-upload" :disabled="isUploading" :ref="setInputRef" type="file"
             name="sampleFile"/>
      <button class="btn-styled" :disabled="isUploading" @click="clearFileInput">Clear</button>
      <button class="btn-styled" type='submit'>Upload</button>
    </form>

    <div class="progress-box">
      <div class="progress-text">
        Progress: {{ progress }}%
      </div>
      <ProgressBar :progress="progress"></ProgressBar>
    </div>
  </div>
</template>

<script>
import {defineComponent, ref, toRefs} from 'vue'
import {uploadFile} from "@/api/music"
import ProgressBar from "@/components/ProgressBar"

export default defineComponent({
  name: 'FileUpload',
  components: {
    ProgressBar
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
  setup(props, context) {
    let input
    const setInputRef = (el) => {
      input = el
    }
    const progress = ref(0)
    const isUploading = ref(false)
    const {uploadConfig} = toRefs(props)
    const handleSubmit = async () => {
      const {files} = input
      if (!files.length) {
        window.$notify.error(`Please select a file to upload`)
        return
      }

      try {
        isUploading.value = true
        progress.value = 0
        const result = await uploadFile({
          file: files[0],
          ...uploadConfig.value
        }, {
          onUploadProgress: (event) => {
            progress.value = Math.round((event.loaded * 100) / event.total)
          }
        })
        console.log('ok', result)
        context.emit('uploaded', result)
      } catch (e) {
        console.error(e)
        window.$notify.error(e)
      } finally {
        isUploading.value = false
      }
    }
    const clearFileInput = () => {
      input.value = ''
      progress.value = 0
    }
    return {
      setInputRef,
      handleSubmit,
      progress,
      clearFileInput,
      isUploading
    }
  }
})
</script>

<style lang="scss" scoped>
.file-upload-wrap {
  padding: 20px;

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
