import axios from 'axios'
import {getToken} from './auth'
import {toast} from 'react-toastify'

function Service(config: any) {
  const {
    baseURL,
    withCredentials = false,
    timeout,
    headers,
    isAuth = true,
  } = config || {}

  // 创建 axios 实例
  const service = axios.create({
    baseURL,
    withCredentials, // send cookies when cross-domain requests
    timeout, // request timeout
    headers, // 请求头部
  })

  // 请求 拦截器
  service.interceptors.request.use(
    (config) => {
      if (isAuth) {
        const Authorization = getToken()
        if (Authorization) {
          // @ts-ignore
          config.headers.Authorization = Authorization
        }
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  // 响应 拦截器
  service.interceptors.response.use(
    (response) => {
      return response.data
    },
    (error) => {
      let message = error.message
      const {response} = error || {}
      if (response) {
        console.log('response', response)
        // @ts-ignore
        const {data: {message: msg} = {}} = response
        console.log('msg', msg)
        if (msg) {
          message = msg
        }
      }
      if (message) {
        toast.error(message, {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
        })
      }
      return Promise.reject(error)
    }
  )

  return service
}

export default Service
