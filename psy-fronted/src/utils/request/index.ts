import type { AxiosProgressEvent, AxiosResponse, GenericAbortSignal } from 'axios'
import request from './axios'
import { useAuthStore } from '@/store'
export interface HttpOption {
  url: string
  data?: any
  method?: string
  headers?: any,
  baseURL?: any,
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
  signal?: GenericAbortSignal
  beforeRequest?: () => void
  afterRequest?: () => void
}

export interface Response<T = any> {
code: number
[x: string]: number
code: number
  data: T
  message: string | null
  status: string
}

function http<T = any>(
  { url, data, method, baseURL, headers, onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
) {
  const successHandler = (res: AxiosResponse<Response<T>>) => {
    const authStore = useAuthStore()
    if (res.data.code == 200 || res.data.status === 'Success' || typeof res.data === 'string') 
      return res.data
    
    
    if (res.data.code >= 40000) {
      return res.data
    }

    if(res.status == 200 && res.data && res.data.run) {
      return res.data
    }


    if (res.data.status === 'Unauthorized') {
      authStore.removeToken()
      window.location.reload()
    }

    return Promise.reject(res.data)
  }

  const failHandler = (error: Response<Error>) => {
    afterRequest?.()
    throw new Error(error?.message || 'Error')
  }

  beforeRequest?.()

  method = method || 'GET'

  const params = Object.assign(typeof data === 'function' ? data() : data ?? {}, {})
  return method === 'GET'
    ? request.get(url, { baseURL,params, signal, onDownloadProgress }).then(successHandler, failHandler)
    : method == 'POST'
    ? request.post(url, params, { baseURL, headers, signal, onDownloadProgress }).then(successHandler, failHandler)
    : method == 'PATCH'
    ? request.patch(url, params, { baseURL,headers, signal, onDownloadProgress }).then(successHandler, failHandler)
    : request.delete(url, { baseURL,headers, signal, onDownloadProgress }).then(successHandler, failHandler)
}

export function get<T = any>(
  { url, data, method = 'GET',baseURL, onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
): Promise<Response<T>> {
  return http<T>({
    url,
    method,
    data,
    baseURL,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
  })
}

export function post<T = any>(
  { url, data, method = 'POST',baseURL, headers, onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
): Promise<Response<T>> {
  return http<T>({
    url,
    method,
    data,
    headers,
    baseURL,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
  })
}

export function patch<T = any>(
  { url, data, method = 'PATCH',baseURL, headers, onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
): Promise<Response<T>> {
  return http<T>({
    url,
    method,
    data,
    headers,
    baseURL,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
  })
}


export function deletes<T = any>(
  { url, data, method = 'DELETE',baseURL, headers, onDownloadProgress, signal, beforeRequest, afterRequest }: HttpOption,
): Promise<Response<T>> {
  return http<T>({
    url,
    method,
    data,
    headers,
    baseURL,
    onDownloadProgress,
    signal,
    beforeRequest,
    afterRequest,
  })
}

export default post
