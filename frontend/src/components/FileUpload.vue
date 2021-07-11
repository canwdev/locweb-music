<template>
  <div class="file-upload-wrap">
    <form
        class="upload-form"
        id='uploadForm'
        action='javascript:'
        method='post'
        encType="multipart/form-data"
        @submit="handleSubmit"
    >
      <input class="input-styled" :disabled="isUploading" :ref="setInputRef" type="file" name="sampleFile"/>
      <button class="btn-styled" :disabled="isUploading" @click="clearFileInput">Clear</button>
      <button class="btn-styled" type='submit'>Upload</button>
    </form>

    <div class="progress-box">
      <div class="progress-text">
        Progress: {{progress}}%
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
            const percentCompleted = Math.round((event.loaded * 100) / event.total)
            console.log(percentCompleted)
            progress.value = percentCompleted
          }
        })
        console.log('ok', result)
        context.emit('uploaded', result)
      } catch (e) {
        console.error(e)
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

  .upload-form {
    display: flex;
    align-items: center;
    height: 30px;
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
