import Service from '@/utils/service'
import {HOST_URL} from "@/enum"
import qs from 'qs'

const service = Service({
  baseURL: HOST_URL + '/api'
})

export function getList(params) {
  const {
    path,
    getPlayStat
  } = params
  return service.get('/music/list', {
    params: {
      path,
      getPlayStat
    }
  })
}

export function getDetail(params) {
  const {
    path,
    filename,
    updatePlayStat,
    updateStatOnly
  } = params
  return service.get('/music/detail', {
    params: {
      path,
      filename,
      updatePlayStat,
      updateStatOnly
    }
  })
}

export function fileAction(params) {
  const {
    path,
    filename,
    action,
    actionValue
  } = params
  return service.post('/music/action', {
    path,
    filename,
    action,
    actionValue
  })
}

export function saveLyric(params) {
  const {
    filename,
    lyric
  } = params

  return service.post('/music/save-lyric', {
    filename,
    lyric
  })
}

export function getDownloadUrl(params) {
  return HOST_URL + '/api/music/download?' + qs.stringify(params)
}

export function uploadFile(params, config = {}) {
  const {
    file,
    filename,
    path,
  } = params

  const formData = new FormData();
  formData.append('sampleFile', file);
  formData.append('filename', filename);
  formData.append('path', path);
  return service.post(HOST_URL + '/music/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    ...config
  })
}
