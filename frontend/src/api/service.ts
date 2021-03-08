import Service from '@/utils/service'
import {HOST_URL} from "@/enum"

const service = Service({
  baseURL: HOST_URL + '/api'
})

export function getInfo() {
  return service.get('/')
}
