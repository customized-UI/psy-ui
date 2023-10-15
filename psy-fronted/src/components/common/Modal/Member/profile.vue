<script setup lang="ts">
import pb from '@/assets/images/profileback.png'
import { useUserStore } from "@/store";
import { computed } from 'vue';
import moment from 'moment'
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const emit = defineEmits(["changeShowProfile", "show"]);
const memberTime = userInfo.value.memberTime ? moment(userInfo.value.memberTime).format('YYYY-MM-DD HH:mm:ss') : null
const toBuy = () => {
  emit("changeShowProfile", 2)
}

const closeModal = (type: any) => {
  emit("show", type)
}
</script>

<template>
  <div class="w-[530px] h-[600px] bg-white rounded-[20px] flex-col justify-start items-start gap-6 inline-flex">
    <div class="self-stretch grow shrink basis-0 flex-col justify-start items-start gap-6 flex">
      <div class="w-[530px] h-36 relative" :style="`background:url(${pb}) center no-repeat;border-radius:20px 20px 0 0`">
        <!-- <img class="w-[530px] h-36 left-0 top-0 absolute"  /> -->
        <div class="w-[473px] left-[32px] top-[40px] absolute justify-between items-center gap-4 inline-flex">
          <div class="h-16 justify-start items-center gap-4 flex">
            <img class="w-16 h-16 rounded-[60px]" src="https://via.placeholder.com/64x64" />
            <div class="flex-col justify-center items-start gap-1 inline-flex">
              <div class="text-neutral-800 text-lg font-normal">{{ userInfo.nickname }}</div>
              <div class="text-zinc-600 text-sm font-normal leading-tight" v-if="memberTime">到期时间 {{ memberTime }}</div>
            </div>
          </div>
          <div
            class="w-[88px] h-10 px-4 py-1.5 bg-white rounded-md border border-neutral-800 justify-center items-center gap-2 flex cursor-pointer"
            @click="toBuy()">
            <div class="text-neutral-800 text-sm font-normal leading-normal">{{ !memberTime ? '购买' : '续费' }}</div>
          </div>
        </div>
      </div>
      <div class="self-stretch h-60 px-8 flex-col justify-start items-start gap-6 flex">
        <div class="h-16 relative">
          <div class="w-[466px] h-9 left-0 top-[28px] absolute">
            <div
              class="w-[466px] h-9 left-0 top-0 absolute bg-white rounded-lg border border-neutral-800 border-opacity-10">
            </div>
            <div class="w-[144.17px] left-[17.48px] top-[8px] absolute text-slate-300 text-sm font-normal leading-tight">
              {{ userInfo.nickname }}</div>
          </div>
          <div class="w-[40.78px] left-0 top-0 absolute text-neutral-800 text-sm font-normal leading-tight">昵称</div>
        </div>
        <div class="h-16 relative">
          <div class="w-[466px] h-9 left-0 top-[28px] absolute">
            <div
              class="w-[466px] h-9 left-0 top-0 absolute bg-white rounded-lg border border-neutral-800 border-opacity-10">
            </div>
            <div class="w-[144.17px] left-[17.48px] top-[8px] absolute text-slate-300 text-sm font-normal leading-tight">
              {{ userInfo.username }}</div>
          </div>
          <div class="w-[61.16px] left-0 top-0 absolute text-neutral-800 text-sm font-normal leading-tight">手机号</div>
        </div>
        <!-- <div class="h-16 relative">
        <div class="w-[466px] h-9 left-0 top-[28px] absolute">
          <div class="w-[466px] h-9 left-0 top-0 absolute bg-white rounded-lg border border-neutral-800 border-opacity-10"></div>
          <div class="w-[144.17px] left-[17.48px] top-[8px] absolute text-slate-300 text-sm font-normal leading-tight">1881181888</div>
        </div>
        <div class="w-[61.16px] left-0 top-0 absolute text-neutral-800 text-sm font-normal leading-tight">邮箱</div>
      </div> -->
      </div>
    </div>
    <div class="self-stretch h-[72px] pb-4 flex-col justify-start items-start gap-4 flex">
      <div class="w-[764px] h-[0px] border border-neutral-800 border-opacity-10"></div>
      <div class="px-8 justify-start items-start gap-3 inline-flex">
        <!-- <div class="w-[88px] h-10 px-4 py-1.5 bg-neutral-800 rounded-md justify-center items-center gap-2 flex cursor-pointer">
        <div class="text-white text-sm font-normal leading-normal">保存</div>
      </div> -->
      <div
        class="w-[88px] h-10 px-4 py-1.5 bg-white rounded-md border border-neutral-800 border-opacity-10 justify-center items-center gap-2 flex cursor-pointer" @click="closeModal(false)">
        <div class="text-neutral-800 text-sm font-normal leading-normal">关闭</div>
      </div>
    </div>
  </div>
</div></template>