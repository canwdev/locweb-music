import Service from '@/utils/service'
import {HOST_URL} from "@/enum"

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
    updatePlayStat
  } = params
  return service.get('/music/detail', {
    params: {
      path,
      filename,
      updatePlayStat
    }
  })
}
