import {uploadFile} from '@/api/music'
import EventEmitter from '@/utils/event-emitter'
import {guid} from '@/utils'
import axios from 'axios'

export const UploadStatus = {
  WAITING: 1,
  UPLOADING: 2,
  SUCCESS: 3,
  ERROR: 4,
}

export class FileUploadItem extends EventEmitter {
  constructor(file) {
    super()
    this.id = guid()
    this.file = file
    this.filename = file.name
    this.progress = 0
    this.status = UploadStatus.WAITING
  }

  async upload(uploadConfig = {}) {
    try {
      if (this.status === UploadStatus.SUCCESS) {
        return
      }
      if (this.status === UploadStatus.UPLOADING) {
        this.cancelUpload()
      }
      this.progress = 0
      this.status = UploadStatus.UPLOADING

      const cancelTokenSource = axios.CancelToken.source();
      this.cancelTokenSource = cancelTokenSource
      const result = await uploadFile({
        file: this.file,
        ...uploadConfig,
        filename: uploadConfig.filename || this.filename
      }, {
        onUploadProgress: (event) => {
          this.progress = Math.round((event.loaded * 100) / event.total)
        },
        cancelToken: cancelTokenSource.token
      })
      this.status = UploadStatus.SUCCESS
      console.log('uploaded', result)
      this.emit('success', result)
    } catch (e) {
      console.error(e)
      this.status = UploadStatus.ERROR
      this.emit('error', e)
    } finally {
      this.isUploading = false
      this.cancelTokenSource = null
    }
  }

  cancelUpload() {
    if (this.status !== UploadStatus.UPLOADING) {
      return
    }
    if (this.cancelTokenSource) {
      this.cancelTokenSource.cancel()
      this.status = UploadStatus.WAITING
    }
  }
}
