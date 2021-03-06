import axios from 'axios'
import {getToken} from './auth'

interface Config {
  baseURL?: string;
  withCredentials?: boolean;
  timeout?: number;
  headers?: any;
  isAuth?: boolean;
}

function Service(config: Config) {
  const {
    baseURL,
    withCredentials = false,
    timeout,
    headers,
    isAuth = true
  } = config || {}

  // 创建 axios 实例
  const service = axios.create({
    baseURL,
    withCredentials, // send cookies when cross-domain requests
    timeout, // request timeout
    headers // 请求头部
  })

  // 请求 拦截器
  service.interceptors.request.use(
    config => {
      if (isAuth) {
        const Authorization = getToken()
        if (Authorization) {
          config.headers.Authorization = Authorization
        }
      }
      return config
    },
    error => Promise.reject(error)
  )

  // 响应 拦截器
  service.interceptors.response.use(
    (response: any) => {
      return response.data
    },
    (error: any) => {
      let message = error.message
      const {response} = error || {}
      if (response) {
        console.log('response',response)
        // @ts-ignore
        const {data: {message: msg} = {}} = response
        console.log('msg',msg)
        if (msg) {
          message = msg
        }
      }
      window.$notify.error(message)
      return Promise.reject(error)
    }
  )

  return service
}

export default Service
