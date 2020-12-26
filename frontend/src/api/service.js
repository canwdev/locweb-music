import Service from '@/utils/service'
import {HOST_URL} from "@/api/config"

const service = new Service({
  baseURL: HOST_URL + '/api'
})

export function getInfo() {
  return service.get('/')
}
