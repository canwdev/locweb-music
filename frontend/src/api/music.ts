import Service from '@/utils/service'
import {HOST_URL} from "@/enum"

const service = Service({
  baseURL: HOST_URL + '/api'
})

export function getList(params) {
  const {
    path
  } = params
  return service.get('/music/list', {
    params: {
      path
    }
  })
}

export function getDetail(params) {
  const {
    path,
    filename
  } = params
  return service.get('/music/detail', {
    params: {
      path,
      filename
    }
  })
}
