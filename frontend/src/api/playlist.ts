import Service from '@/utils/service'
import {HOST_URL} from "@/enum"

const service = Service({
  baseURL: HOST_URL + '/api/playlist'
})

export function getPlaylist(params?: any) {
  return service.get('/list', {
    params
  })
}

export function addPlaylist(params?: any) {
  return service.post('/add', params)
}

export function deletePlaylist(params?: any) {
  return service.post('/delete', params)
}

export function addPlaylistMusic(params?: any) {
  return service.post('/add-music', params)
}

export function removePlaylistMusic(params?: any) {
  return service.post('/remove-music', params)
}
