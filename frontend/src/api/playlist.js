import Service from '@/utils/service'
import {HOST_URL} from '@/enum'

const service = Service({
  baseURL: HOST_URL + '/api/playlist'
})

export function getPlaylist(params) {
  return service.get('/list', {
    params
  })
}

export function addPlaylist(params) {
  return service.post('/add', params)
}

export function deletePlaylist(params) {
  return service.post('/delete', params)
}

export function addPlaylistMusic(params) {
  return service.post('/add-music', params)
}

export function removePlaylistMusic(params) {
  return service.post('/remove-music', params)
}
