import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post, get, patch, deletes } from '@/utils/request'
import { useSettingStore } from '@/store'
import { useCopilots } from '@/store'
import { RouteRecordName } from 'vue-router'

const baseURL = import.meta.env.VITE_APP_API_BASE_URL

export function login<T = any>(data: any) {
  return post<T>({
    // url: '/api/auth/sign-in',
    url: 'auth/login',
    baseURL,
    data,
  })
}

export function sendCode<T = any>(data: any) {
  return post<T>({
    url: 'auth/send-code',
    baseURL,
    data
  })
}

export function register<T = any>(data: any) {
  return post<T>({
    url: 'auth/sign-up',
    baseURL,
    data,
  })
}

export function fetchUserData<T = any>() {
  return get<T>({
    url: `user/info`,
    baseURL,
  })
}

export function fetchGroups<T = any>(type: any) {
  return get<T>({
    url: `user/groups/list`,
    baseURL,
    data: {
      type
    }
  })
}

export function fetchHistories<T = any>(id: number) { 
  return get<T>({
    url: `user/histories/${id}`,
    baseURL,
  })
}

export function fetchOtherHistories<T = any>(type: string) { 
  return get<T>({
    url: `user/otherhistories/list`,
    data: {
      type
    },
    baseURL,
  })
}

export function addGroup<T = any>(
  name: string,
  type: string
) {
  return post<T>({
    url: `user/addgroup`,
    baseURL,
    data: {
      name,
      type,
    }
  })
}

export function editGroup<T = any>(
  id: number, name: string, type: string
) {
  return patch<T>({
    url: `user/editgroup/${id}`,
    baseURL,
    data: {
      name,
      type,
    }
  })
}

export function deleteGroup<T = any>(
  id: number
) {
  return deletes<T>({
    url: `user/deleteGroup/${id}`,
    baseURL,
  })
}

export function addHistories<T = any>(data: {role: string, message: string, groupsId: number}) {
  return post<T>({
    url: `user/addhistories`,
    baseURL,
    data: data
  })
}

export function addOtherHistories<T = any>(data: { role: string, title: string, type: string, content: string, grade: string,arraydata:any }) {
  return post<T>({
    url: `user/addotherhistories`,
    baseURL,
    data: data
  })
}

export async function fetchChatAPIProcess<T = any>(
  params: {
    input: any,
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    type: any
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {

  const settingStore = useSettingStore()
  const groupsData = useCopilots().authorList[params.type]
  let messageArr = await [...params.input]
  await messageArr.push({
    role: "user",
    content: params.prompt,
 })
  if (groupsData.data.data && groupsData.data.data.inputs) {
    groupsData.data.data.inputs = [
      {
        messages: messageArr
     }
    ]
  }
  return fetch(groupsData.data.url, {
    method: 'POST',
    headers: groupsData.data.headers,
    body: JSON.stringify({
      ...groupsData.data.data
    })
  })
  // return post<T>({
  //   url: groupsData.data.url,
  //   headers: groupsData.data.headers,
  //   data: groupsData.data.data,
  // })
}

export function fetchCharge<T = any>(type: any, params: {
  title: string,
  role: string
  grade: string
  signal?: GenericAbortSignal
},
) {
  const groupsData = useCopilots().copilotsObj[type]
  if (groupsData.data && groupsData.data.inputs) {
    let input = {}
    if (type == 'Charge') {
      input = {
        messages: [{
          role: "user",
          content: {
            book: params.title,
            author: params.role,
          }
        }]   
      } 
    } else if (type == 'Learn') {
      input = {
        messages:[
          {
            role: "user",
            content: `My level is ${params.grade} and the requirement is ${params.title}`
          }
        ]
      }
    } else if (type == 'Plan') {
      input = {
        messages: [{
          role: "user",
          content: {
            content: params.title,
            tutor: params.role,
            level: params.grade
          }
        }]   
      } 
    } else if (type == 'Video') {
      input = {
        messages:[
          {
            role: "user",
            content: `${params.title}`
          }
        ]
      }
    }
    groupsData.data.inputs = [
      input
    ]
  }
  return fetch(groupsData.url, {
    method: 'POST',
    headers: groupsData.headers,
    body: JSON.stringify({
      ...groupsData.data
    })
  })
  // return post<T>({
  //   url: groupsData.url,
  //   headers: groupsData.headers,
  //   data: groupsData.data,
  // })
}

export function fetchSearch<T = any>(type: any, keyword: string) {
  const groupsData = useCopilots().copilotsObj[type]
  if(groupsData.data && groupsData.data.inputs) {
    groupsData.data.inputs = [
      {
        messages:[
          {
            role: "user",
            content: `${keyword}`
          }
        ]
      }
    ]
  }
  return fetch(groupsData.url, {
    method: 'POST',
    headers: groupsData.headers,
    body: JSON.stringify({
      ...groupsData.data
    })
  })
  // return post<T>({
  //   url: groupsData.url,
  //   headers: groupsData.headers,
  //   data: groupsData.data,
  // })
}

export function fetchOtherText<T>(data: any) { //英语学习中获取中文翻译或者答案
  const groupsData = useCopilots().copilotsObj['Learn']
  if (groupsData.data && groupsData.data.inputs) {
    groupsData.data.inputs = [
      data
    ]
  }
  return fetch(groupsData.url, {
    method: 'POST',
    headers: groupsData.headers,
    body: JSON.stringify({
      ...groupsData.data
    })
  })
  // return post<T>({
  //   url: groupsData.url,
  //   headers: groupsData.headers,
  //   data: groupsData.data,
  // })
}

export function fetchOrderId<T>(data: any) {
  return post<T>({
    url: 'pay/create-order',
    baseURL,
    data,
  })
}

export function fetchGetPayCode<T>(data: any) {
  return post<T>({
    url: 'pay/get-paycode',
    baseURL,
    data,
  })
}

export function checkPay<T>(data: any) {
  return post<T>({
    url: 'pay/check-pay',
    baseURL,
    data,
  })
}

export function getNotify<T>() {
  return get<T>({
    url: 'pay/notify',
    baseURL,
  })
}

export function checkToken<T>(data: any) {
  return post<T>({
    url: 'auth/check-token',
    baseURL,
    data,
  })
}

export function finishPay<T>(data:any) {
  return post<T>({
    url: 'pay/finish-pay',
    baseURL,
    data
  })
}
