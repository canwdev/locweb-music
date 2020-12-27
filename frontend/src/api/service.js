import Service from '@/utils/service'
import {HOST_URL} from "@/enum/index.ts"

const service = new Service({
  baseURL: HOST_URL + '/api'
})

export function getInfo() {
  return service.get('/')
}
