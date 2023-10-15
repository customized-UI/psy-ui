<script setup lang="ts">
import { useMessage, NModal } from "naive-ui";
import { onMounted, ref } from "vue";
import { Header } from "@/components/common";
import { useScroll } from "@/hooks/useScroll";
import { fetchOtherHistories } from '@/api'
const showModal = ref(false);
const header = ref()
const message = useMessage()
const historiesList = ref([])
const historiesData = ref({
    text: '',
    id: '',
    type: ''
})
const { scrollRef, scrollToBottom, scrollToBottomIfAtBottom } = useScroll();
const showHistories = async (type) => {
    await fetchOtherHistories(type).then(async res => {
        if(!res.data.length) return message.warning('暂无历史记录')
        historiesList.value = await res.data
        historiesData.value = await {
            text: res.data.length > 0 ? res.data[0]['content'] : '暂无更多',
            id: res.data.length > 0 ? res.data[0]['id'] : 0,
            type: type
        }
        showModal.value = await true;
    })
  
  
};

const showLogin = () => {
  header.value.showLogin()
}

const showHistoriesContent = async (item) => {
    historiesData.value.id = item.id
    historiesData.value.text = item.content
}


defineExpose({
    showHistories,
    scrollToBottom,
    showLogin
});
</script>
<template>
  <div class="w-full h-full bg-[#E1E7EB]">
  <Header  ref="header"/>
    <div
      class="w-full h-full bg-[#E1E7EB] border-t border-[#ccc] border-solid border-1"
    >
      <div class="px-[100px] pt-[46px] pb-[100px] h-full flex flex-row">
        <div
          class="w-[416px] h-[450px] p-6 bg-slate-100 bg-opacity-95 rounded-[20px] border border-white border-opacity-50 backdrop-blur-[14px] flex-col justify-start items-start gap-4 inline-flex"
        >
          <div
            class="w-[368px] h-20 flex-col justify-start items-start gap-6 inline-flex"
          >
            <div
              class="self-stretch h-14 flex-col justify-start items-start gap-2.5 flex"
            >
              <slot name="type"></slot>
            </div>
            <div class="w-[368px] justify-center items-center gap-1 inline-flex">
              <div
                class="grow shrink basis-0 self-stretch border border-neutral-800 border-opacity-10"
              ></div>
            </div>
          </div>
          <div
            class="w-[368px] h-[66px] flex-col justify-start items-start gap-2.5 inline-flex"
          >
            <slot name="role">
            </slot>
            <slot name="title">
            </slot>

            <slot name="grade">
            </slot>

            <div
              class="w-[368px] h-11 pt-2 justify-between items-center gap-2.5 inline-flex"
            >
              <slot name="button">
              </slot>
            </div>
          </div>
        </div>
        <div
        id="scrollRef" ref="scrollRef"
          class="w-full h-full overflow-hidden overflow-y-auto no-scrollbar px-8 py-[23px] ml-[32px] bg-white rounded-2xl justify-start items-start gap-6"
        >
          
          <slot name="loading"></slot>
          <slot name="empty"></slot>
          <slot name="content"></slot>
          <slot name="translate"></slot>
          <slot name="answer"></slot>
          
        </div>
      </div>
    </div>
  </div>
  <n-modal id="historyModal" v-model:show="showModal" preset="card">
    <div
      class="w-[285px] h-[800px] p-6 overflow-hidden overflow-y-auto no-scrollbar bg-slate-100 bg-opacity-95 rounded-tl-[20px] rounded-tr rounded-bl-[20px] rounded-br border border-white border-opacity-50 backdrop-blur-[14px] flex-col gap-2.5 inline-flex"
    >
      <div class="w-[237px] h-[31px] pb-3.5 justify-start items-center inline-flex">
        <div class="text-neutral-800 text-sm font-semibold">历史记录</div>
      </div>
      <div
        v-for="item in historiesList" :key="item.id"
        @click="showHistoriesContent(item)"
        :class="historiesData.id === item.id ? 'border-black' : ''"
        class="w-[237px] h-[57px] px-6 py-2 bg-neutral-50 rounded-xl border  backdrop-blur-[14px] flex-col gap-6 inline-flex cursor-pointer"
      >
        <div class="text-neutral-800 text-sm font-normal">
            <p class="w-[180px] overflow-hidden whitespace-nowrap overflow-ellipsis" v-if="item.title">{{ item.title }}</p>
            <p class="w-[180px] overflow-hidden whitespace-nowrap overflow-ellipsis" v-if="item.role">{{ item.role }}</p>
            <p class="w-[180px] overflow-hidden whitespace-nowrap overflow-ellipsis" v-if="item.grade">{{ item.grade }}</p>
        </div>
      </div>
    </div>
    <div
      class="w-[1000px] h-[800px] overflow-hidden overflow-y-auto no-scrollbar px-8 py-[23px] bg-white rounded-tl rounded-tr-2xl rounded-bl rounded-br-2xl gap-6 inline-flex"
    >
        <v-md-preview :text="historiesData.text"></v-md-preview>
    </div>
  </n-modal>
</template>
