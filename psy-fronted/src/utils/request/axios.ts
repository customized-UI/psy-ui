import axios, { type AxiosResponse } from 'axios'
import { useAuthStore } from '@/store'
import { useRouter } from 'vue-router'

const router = useRouter()

const service = axios.create({
  // baseURL: 'http://39.108.51.168:3003/',
})

axios.defaults.timeout = 1800000;

service.interceptors.request.use(
  (config) => {
    const token = useAuthStore().token
    if (!config.headers.Authorization) {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error.response)
  },
)

service.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    const res = response
    if (res.status == 200) {
      return res
    } else if (res.status == 401 || res.status == 400) {
      return res
    }
    return response
  },
  async (error) => {
    let res = await error['response']
    if (res.status == 401) {
      await useAuthStore().removeToken()
      return res
    }
    return Promise.reject(error)
  },
)

export default service
