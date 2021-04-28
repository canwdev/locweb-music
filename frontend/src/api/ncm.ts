import Service from '@/utils/service'
import {NCM_API_URL} from "@/enum"

const service = Service({
  baseURL: NCM_API_URL
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
