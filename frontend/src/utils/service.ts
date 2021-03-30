import axios from 'axios'

interface Config {
  baseURL?: string;
  withCredentials?: boolean;
  timeout?: number;
  headers?: any;
}

function Service(config: Config) {
  const {
    baseURL,
    withCredentials = false,
    timeout,
    headers
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
      const Authorization = localStorage.getItem('Authorization')
      if (Authorization) config.headers.Authorization = Authorization

      // console.log('config', config)

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
        // @ts-ignore
        const {data: {message: msg} = {}} = response
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
