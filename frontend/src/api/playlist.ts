import Service from '@/utils/service'
import {HOST_URL} from "@/enum"

const service = Service({
  baseURL: HOST_URL + '/api/playlist'
})

export function getPlaylist(params?: object) {
  return service.get('/list', {
    params
  })
}

export function addPlaylist(params?: object) {
  return service.post('/add', params)
}

export function deletePlaylist(params?: object) {
  return service.post('/delete', params)
}

export function addPlaylistMusic(params?: object) {
  return service.post('/add-music', params)
}

export function removePlaylistMusic(params?: object) {
  return service.post('/remove-music', params)
}
