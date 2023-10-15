<script setup lang="ts">
import { Back } from '@/components/common';
import { onMounted, onUnmounted, ref } from 'vue';
import { useMessage, NCollapse, NCollapseItem } from 'naive-ui';
import { addOtherHistories, fetchSearch, fetchOtherHistories } from '@/api';
import { useRoute } from 'vue-router'
import { useChatStore, useCopilots } from '@/store';
import useFile from '@/assets/js/images_js'
import { createParser } from 'eventsource-parser';
import { useScroll } from "@/hooks/useScroll";
const message = useMessage()
const copilotsStore = useCopilots();
const searchObj = ref({
    searchValue: '',
    searchText: '',
    searchRetrievals: [],
    isSelect: 0,
})
const isLoading = ref(false)
const isBuilding = ref(false) // 正在生成
const historiesList = ref([])
const route = useRoute()
const chatStore = useChatStore();
const { scrollRef, scrollToBottom, scrollToBottomIfAtBottom } = useScroll();
const search = async () => {
    if (isLoading.value || isBuilding.value) return
    if (!searchObj.value.searchValue) return message.warning('请输入要搜索的资料')
    await fetchOtherHistories(route.name).then(async res => {
        historiesList.value = await res.data
    })
    if(searchObj.value.searchValue) {
        searchObj.value = {
            searchValue: searchObj.value.searchValue,
            searchText: '',
            searchRetrievals: [],
            isSelect: 0,
        }
    }
    isLoading.value = await true
    isBuilding.value = await true
    await fetchSearch(route.name, searchObj.value.searchValue).then(async res => {
      const reader = res.body?.getReader()
      const parser = createParser(async (event) => {
        if (event.type === "event") {
          try {
              let json = await JSON.parse(event.data);
            console.log(json)
            if (json.type == 'tokens') {
              isLoading.value = false
                searchObj.value.searchText = searchObj.value.searchText + json.content.tokens.text
                
                scrollToBottom();
            } else if (json.type == 'block_execution') {
                if(json.content.block_type == 'output') {
                    if (json.content.execution && json.content.execution.length) {
                        if (json.content.execution[0][0]['value']["content"]) {
                            searchObj.value.searchText = await json.content.execution[0][0]['value']["content"]
                            scrollToBottom();
                        }
                        if (json.content.execution[0][0]['value']["retrievals"]) {
                            searchObj.value.searchRetrievals = await json.content.execution[0][0]['value']["retrievals"]
                        }
                    }
                }
                
            } else if (json.type == 'final') {
              isLoading.value =  false
              isBuilding.value =  false
              await addOtherHistories({ role: '', title: searchObj.value.searchValue, content: searchObj.value.searchText, type: route.name, arraydata: searchObj.value.searchRetrievals })
                await fetchOtherHistories(route.name).then(async res => {
                    historiesList.value = await res.data
                })
            }
            
          } catch (error) {
            console.log(error);
            message.error('出错了,请联系管理员')
          }
        }
      });
      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break
          }
          parser.feed(new TextDecoder().decode(value))
        //   console.log(new TextDecoder().decode(value))
        }
      } catch {
        
      } finally {
        reader.releaseLock(); // (E)
      }
        // if (res.run && res.run.status && res.run.status.run == 'succeeded') {
        //     for (let i of res["run"]["traces"]) {
        //       if (i[0].indexOf("OUTPUT") > -1) {
        //           if (i[1] && i[1].length) {
        //             searchObj.value.searchText = await i[1][0][0]["value"]["content"]
        //             if(i[1][0][0]["value"]["retrievals"]) {
        //                 searchObj.value.searchRetrievals = await i[1][0][0]["value"]["retrievals"]
        //             }
        //             isLoading.value = await false
        //             await addOtherHistories({ role: '', title: searchObj.value.searchValue, content: i[1][0][0]["value"]["content"], type: route.name, arraydata: i[1][0][0]["value"]["retrievals"] })
                    
        //             await fetchOtherHistories(route.name).then(async res => {
        //                 historiesList.value = await res.data
        //             })
        //           }
        //       }
        //     }
        // } else {
        //     isLoading.value = await false
        //     message.error('请求失败,请稍后再试')
        // }
    })
}

const selectHistory = async (item) => {
    searchObj.value = {
        searchValue: item.title,
        isSelect: item.id,
        searchText: item.content,
        searchRetrievals: item.arraydata
    }
}

const keyboardDownBack = (event) => {
  if(event.key == 'Enter') {
    event.preventDefault();
    search()
  }
}

onMounted(async () => {
    document.addEventListener('keydown', keyboardDownBack, true)
    if(chatStore.search) {
        searchObj.value.searchValue = await chatStore.search
        await search()
    }
    await fetchOtherHistories(route.name).then(async res => {
        historiesList.value = await res.data
    })
    if(copilotsStore.isSearchHistroy) {
        searchObj.value = {
            searchValue: historiesList.value[0].title,
            isSelect: historiesList.value[0].id,
            searchText: historiesList.value[0].content,
            searchRetrievals: historiesList.value[0].arraydata
        }
    }
})

onUnmounted(() => {
  document.removeEventListener('keydown', keyboardDownBack, true)
})

</script>

<template>
    <Back>
        <template #container>
            <div class="w-[1343px] h-full relative flex flex-col">
                <div
                    class="w-[994px] h-[72px] px-3 left-0 top-0  bg-white bg-opacity-30 rounded-[80px] shadow border border-white backdrop-blur-[6px] flex flex-row justify-center items-center">
                    <input class="w-full h-[40px] pl-[18px] bg-transparent outline-none text-lg font-normal" placeholder="请输入要查询的资料"
                        type="text" v-model="searchObj.searchValue">
                    <div class="w-[36px] h-[36px] bg-neutral-900 rounded-full  items-center justify-center inline-flex ml-auto cursor-pointer"
                        @click="search">
                        <img :src="useFile('/src/assets/images/ziliaosearch.svg')" class="ml-[2px]" alt="">
                    </div>
                </div>
                <div  id="scrollRef" ref="scrollRef"
                    class="w-[994px] h-full px-8 py-6 mt-[25px] bg-white rounded-2xl flex-col justify-start items-start gap-2.5 inline-flex overflow-hidden overflow-y-auto no-scrollbar">

                    <div class="loading w-full h-full flex flex-col items-center justify-center" v-if="isLoading">
                        <img :src="useFile('/src/assets/images/loading.gif')" alt="">
                        <p class="text-zinc-600 text-lg font-normal">生成中...</p>
                    </div>
                    <div class="loading w-full h-full flex flex-col items-center justify-center" v-if="!isLoading && !searchObj.searchText">
                        <img :src="useFile('/src/assets/images/Notioly.png')" alt="">
                        <p class="text-black text-lg font-normal">请在顶部输入搜索内容，点击搜索</p>
                    </div>
                    <v-md-preview v-if="!isLoading" :text="searchObj.searchText"></v-md-preview>
                    <div v-if="!isLoading">
                        <n-collapse>
                            <n-collapse-item title="回答基于以下文档" name="3">
                                <div class="w-[930px] text-neutral-500 text-xs font-normal" v-for="item in (searchObj.searchRetrievals as any)" :key="item.created">
                                    <div class="mb-[10px]" v-for="(sub, index) in item.chunks" :key="index">
                                        {{ item.document_id }} : {{ sub.text }}
                                    </div>
                                </div>
                            </n-collapse-item>
                        </n-collapse>
                    </div>
                </div>
                <div
                    class="w-[285px] h-full px-6 pt-4 pb-12 left-[1058px] top-0 absolute bg-slate-100 bg-opacity-95 rounded-[20px] border border-white border-opacity-50 backdrop-blur-[14px]">
                    <div class="self-stretch pb-3.5 justify-start items-center inline-flex">
                        <div class="text-neutral-800 text-sm font-normal">历史记录</div>
                    </div>
                    <div class="flex flex-col h-full py-4 overflow-hidden overflow-y-auto no-scrollbar gap-2.5">
                        <div
                            v-for="item in (historiesList as any)"
                            :key="item.id"
                            @click="selectHistory(item)"
                            :class="searchObj.isSelect == item.id ? 'border-neutral-800' : ''"
                            class="px-6 py-5 bg-neutral-50 rounded-xl border-2  backdrop-blur-[14px] cursor-pointer">
                            <div class="text-neutral-800 text-sm font-normal">
                                {{ item.title }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

</Back></template>