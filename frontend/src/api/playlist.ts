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
