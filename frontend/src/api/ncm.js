import Service from '@/utils/service'
import {NCM_API_URL} from '@/enum'

const service = Service({
  baseURL: NCM_API_URL,
  withCredentials: false,
  isAuth: false
})

export function searchMusic(params) {
  return service.get('/search', {
    params
  })
}

export function getLyric(params) {
  return service.get('/lyric', {
    params
  })
}

export function checkMusic(params) {
  return service.get('/check/music', {
    params
  })
}

export function getMusicData(params) {
  return service.get('/song/url', {
    params
  })
}

export function getSongDetail(params) {
  return service.get('/song/detail', {
    params
  })
}
