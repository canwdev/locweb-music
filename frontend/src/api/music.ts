import Service from '@/utils/service'
import {HOST_URL} from "@/enum/index"

const service = new Service({
  baseURL: HOST_URL + '/api'
})

export function getList(params) {
  return service.get('/music/list', {params})
}
