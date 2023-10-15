import { defineStore } from 'pinia'
import { getLocalState, setLocalState } from './helper'
import { router } from '@/router'
import { addGroup, fetchHistories, editGroup, addHistories, deleteGroup } from '@/api'
import { Response } from '@/utils/request'

export const useChatStore = defineStore('chat-store', {
  state: (): Chat.ChatState => getLocalState(),

  getters: {
    getChatHistoryByCurrentActive(state: Chat.ChatState) {
      const index = state.history.findIndex(item => item.uuid === state.active)
      if (index !== -1)
        return state.history[index]
      return null
    },

    getChatByUuid(state: Chat.ChatState) {
      return (uuid?: number) => {
        if (uuid)
        console.log('')
          return state.chat.find(item => item.uuid === uuid)?.data ?? []
          // return state.chat.find(item => item.uuid === state.active)?.data ?? []
      }
    },
  },

  actions: {
    setUsingContext(context: boolean) {
      this.usingContext = context
      this.recordState()
    },

    async addHistoryByGroup(uuid:number, type: any, data: Response<any>) {
      console.log('addHistoryByGroup被执行了', uuid)
      this.history = []
      this.chat = await []
      this.input = await []
      if (!data.data.length) {
        let history = await addGroup('New Chat', type)
        await this.history.unshift({
          uuid: history.data.id,
          isEdit: false,
          title: history.data.name
        })
        this.active = await history.data.id
        await this.reloadRoute(history.data.id)
       this.search = await ''
      } else if(data.data.length && this.search) {
        this.history = await data.data.map((v: { id: any; name: any }) => {
          return {
            uuid: v.id,
            isEdit: false,
            title: v.name
          }
        })
        let history = await addGroup(this.search, type)
        await this.history.unshift({
          uuid: history.data.id,
          isEdit: false,
          title: history.data.name
        })
        this.history.forEach(v => {
          this.chat.push({
            uuid: v['uuid'],
            data: []
          })
        })
        // return console.log(this.chat, '987654321')
        this.active = await history.data.id
        await this.reloadRoute(history.data.id)
      } else {
        this.history = await data.data.map((v: { id: any; name: any }) => {
          return {
            uuid: v.id,
            isEdit: false,
            title: v.name
          }
        })
        // return console.log(data.data,uuid)
        const index = this.history.findIndex(item => item.uuid === uuid)
        this.active = await index == -1 ? this.history[0]['uuid'] : uuid
        await this.reloadRoute(this.active)
        let histories = await fetchHistories(this.active)
        this.input = []
        let chatData: { dateTime: string; text: any; inversion: boolean; error: boolean; conversationOptions: null; requestOptions: { prompt: any; options: null } }[] = []
        if (histories.data.length) {
          histories.data.forEach((v: { message: any; role: string }) => {
            this.input.push({
              content: v.message,
              role: v.role
            })
            chatData.push({
              dateTime: new Date().toLocaleString(),
              text: v.message,
              inversion: v.role == 'user' ? true : false,
              error: false,
              conversationOptions: null,
              requestOptions: { prompt: v.message, options: null },
            })
          });
        }
        this.history.forEach(v => {
          this.chat.push({
            uuid: v['uuid'],
            data: uuid == v['uuid'] ? chatData : []
          })
        })
      }
    },

    async addHistory(history: Chat.History, chatData: Chat.Chat[] = [], type:any) {
      console.log('addHistory被用了')
      this.input = await []
      let historydata = await addGroup('New Chat',type)
        this.history.unshift({
          uuid: historydata.data.id,
          isEdit: false,
          title: historydata.data.name
        })
        this.active = historydata.data.id
        this.chat.unshift({ uuid: historydata.data.id, data: chatData })
        this.reloadRoute(historydata.data.id)
      // this.history.unshift(history)
      // this.chat.unshift({ uuid: history.uuid, data: chatData })
      // this.active = history.uuid
      // this.reloadRoute(history.uuid)
    },

    async updateHistory(uuid: number, edit: Partial<Chat.History>, type: any) {
      console.log('updateHistory被调用了')
      let histories = await fetchHistories(uuid)
      this.input = []
      let chatData: { dateTime: string; text: any; inversion: boolean; error: boolean; conversationOptions: null; requestOptions: { prompt: any; options: null } }[] = []
      if (histories.data.length) {
        histories.data.forEach((v: { message: any; role: string }) => {
          this.input.push({
            content: v.message,
            role: v.role
          })
          chatData.push({
            dateTime: new Date().toLocaleString(),
            text: v.message,
            inversion: v.role == 'user' ? true : false,
            error: false,
            conversationOptions: null,
            requestOptions: { prompt: v.message, options: null },
          })
        });
      }
      console.log(chatData, '这里有多少'+chatData.length)
      const index = this.history.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.history[index] = { ...this.history[index], ...edit }
        this.chat[index]['data'] = chatData
        // return console.log(edit)
        if(!edit['isEdit']) {
          await editGroup(uuid, this.history[index]['title'], type)
        }
        this.recordState()
      }
    },

    async deleteHistory(index: number, uuid: number) {
      console.log('deleteHistory被用了')
      this.history.splice(index, 1)
      this.chat.splice(index, 1)
      await deleteGroup(uuid)
      if (this.history.length === 0) {
        this.active = null
        this.reloadRoute()
        return
      }

      if (index > 0 && index <= this.history.length) {
        const uuid = this.history[index - 1].uuid
        this.active = uuid
        this.reloadRoute(uuid)
        return
      }

      if (index === 0) {
        if (this.history.length > 0) {
          const uuid = this.history[0].uuid
          this.active = uuid
          this.reloadRoute(uuid)
        }
      }

      if (index > this.history.length) {
        const uuid = this.history[this.history.length - 1].uuid
        this.active = uuid
        this.reloadRoute(uuid)
      }
    },

    async setActive(uuid: number) {
      console.log('setActive')
      this.active = uuid
      return await this.reloadRoute(uuid)
    },

    getChatByUuidAndIndex(uuid: number, index: number) {
      console.log('getChatByUuidAndIndex被用了')
      if (!uuid || uuid === 0) {
        if (this.chat.length)
          return this.chat[0].data[index]
        return null
      }
      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1)
        return this.chat[chatIndex].data[index]
      return null
    },

    async addChatByUuid(uuid: number, chat: Chat.Chat, type: any) {
      console.log('addChatByUuid被用了')
      if (!uuid || uuid === 0) {
        if (this.history.length === 0) {
          const uuid = Date.now()
          this.history.push({ uuid, title: chat.text, isEdit: false })
          this.chat.push({ uuid, data: [chat] })
          this.active = uuid
          this.recordState()
        }
        else {
          this.chat[0].data.push(chat)
          if (this.history[0].title === 'New Chat') {
            this.history[0].title = chat.text
            await editGroup(uuid ? uuid : this.history[0].uuid, chat.text, type)
            this.recordState()
          }
            
        }
      } else {
      }

      const index = this.chat.findIndex(item => item.uuid === uuid)
      const messageData = {
        role: chat.inversion ? 'user' : 'assistant',
        message: chat.text,
        groupsId: uuid
      }
      if(chat.text) {
        this.input.push({
          content: chat.text,
          role: chat.inversion ? 'user' : 'assistant',
        })
      }
      if (index !== -1) {
        this.chat[index].data.push(chat)
        if (this.history[index].title && this.history[index].title === 'New Chat') {
          this.history[index].title = chat.text
          await editGroup(uuid, chat.text, type)
        }
        if(chat.text) {
          await addHistories(messageData)
        }
        this.recordState()
      }
    },

    async updateChatByUuid(uuid: number, index: number, chat: Chat.Chat) {
      console.log('updateChatByUuid被用了')
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          this.chat[0].data[index] = chat
          this.recordState()
        }
        return
      }
      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      const messageData = {
        role: chat.inversion ? 'user' : 'assistant',
        message: chat.text,
        groupsId: uuid
      }
      if(chat.text && !chat.isContinute) {
        this.input.push({
          content: chat.text,
          role: chat.inversion ? 'user' : 'assistant',
        })
      }
      if (chatIndex !== -1) {
        this.chat[chatIndex].data[index] = chat
        this.recordState()
        if(chat.text && !chat.isContinute) {
          await addHistories(messageData)
        }
      }
    },

    updateChatSomeByUuid(uuid: number, index: number, chat: Partial<Chat.Chat>) {
      console.log('updateChatSomeByUuid被用了')
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          this.chat[0].data[index] = { ...this.chat[0].data[index], ...chat }
          this.recordState()
        }
        return
      }

      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1) {
        this.chat[chatIndex].data[index] = { ...this.chat[chatIndex].data[index], ...chat }
        this.recordState()
      }
    },

    deleteChatByUuid(uuid: number, index: number) {
      console.log('deleteChatByUuid被用了')
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          this.chat[0].data.splice(index, 1)
          this.recordState()
        }
        return
      }

      const chatIndex = this.chat.findIndex(item => item.uuid === uuid)
      if (chatIndex !== -1) {
        this.chat[chatIndex].data.splice(index, 1)
        this.recordState()
      }
    },

    clearChatByUuid(uuid: number) {
      console.log('clearChatByUuid被用了')
      if (!uuid || uuid === 0) {
        if (this.chat.length) {
          this.chat[0].data = []
          this.recordState()
        }
        return
      }

      const index = this.chat.findIndex(item => item.uuid === uuid)
      if (index !== -1) {
        this.chat[index].data = []
        this.recordState()
      }
    },

    async reloadRoute(uuid?: number) {
      console.log('reloadRoute')
      // this.recordState()
      await router.push({ name: 'ChatSub', params: { uuid } })
    },

    recordState() {
      // setLocalState(this.$state)
    },
  },
})
