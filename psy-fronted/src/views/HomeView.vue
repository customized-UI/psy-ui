<script setup lang="ts">
import { Back } from "@/components/common";
import { onMounted, onUnmounted, ref } from "vue";
import up from "@/assets/images/updropdown.svg";
import { useRouter } from "vue-router";
import { useAuthStore, useCopilots, useChatStore } from "@/store";
import { useMessage } from "naive-ui";
import useFile from "@/assets/js/images_js";
import { checkToken } from "@/api";
const authStore = useAuthStore();
const message = useMessage();
const copilotsStore = useCopilots();
const chatStore = useChatStore();
const isChat: any = ref(true);
const showSelectModal: any = ref(false);
const router = useRouter();
const searchValue = ref("");
const back = ref();
const searchData = ref({
  name: "弗洛伊德",
  type: "floyd",
  uuid: "1",
  src: "/src/assets/images/floyd.png",
});

async function changeChat(type: boolean) {
  isChat.value = type;
  searchValue.value = "";
  showSelectModal.value = false;
}

const selectPerson = async (item: { title: any; value: any; id: any; src: any }) => {
  searchData.value = {
    name: item.title,
    type: item.value,
    uuid: item.id,
    src: item.src,
  };
  showSelectModal.value = false;
};

const goChat = async (item: any) => {
  if (!authStore.getToken()) {
    return back.value.showLogin();
  } else {
    try {
      await checkToken({ token: authStore.getToken() });
    } catch (error) {
      message.warning("您的登录有效期已过,请重新登录");
      back.value.showLogin();
      throw error;
    }
    if (!searchData.value.name) {
      showSelectModal.value = true;
      return message.warning("请先选择想要问的人物");
    }
    let obj = {
      name: "ChatSub",
      params: {
        type: item.type,
        uuid: item.id,
      },
    };
    if (searchData.value.name) {
      chatStore.search = await searchValue.value;
    }
    await router.push(obj);
  }
};

const keyboardDownBack = (event) => {
  if (event.key == "Enter") {
    event.preventDefault();
    if (isChat.value) {
      goChat(searchData.value);
    } else {
      goSearch('search');
    }
  }
};

const goCharge = async (type: string) => {
  //判断token是否有效

  if (!authStore.getToken()) {
    return back.value.showLogin();
  } else {
    try {
      await checkToken({ token: authStore.getToken() });
    } catch (error) {
      message.warning("您的登录有效期已过,请重新登录");
      back.value.showLogin();
      throw error;
    }
    router.push({
      name: type,
    });
  }
};

const goSearch = async (type) => {
  if (!authStore.getToken()) {
    return back.value.showLogin();
  } else {
    try {
      await checkToken({ token: authStore.getToken() });
    } catch (error) {
      message.warning("您的登录有效期已过,请重新登录");
      back.value.showLogin();
      throw error;
    }
    if(type == 'history') {
      copilotsStore.isSearchHistroy = await true
      await router.push({
        name: "Search",
      });
    } else {
      if (!searchValue.value) return message.warning("请输入要查询的资料");
      chatStore.search = await searchValue.value;
      copilotsStore.isSearchHistroy = await false
      await router.push({
        name: "Search",
      });
    }
    
  }
};

onMounted(() => {
  document.addEventListener("keydown", keyboardDownBack, true);
});

onUnmounted(() => {
  document.removeEventListener("keydown", keyboardDownBack, true);
});
</script>

<template>
  <Back ref="back">
    <template #container>
      <h3 class="text-center font-sans text-3xl font-semibold text-gray-800">
        心理咨询师 AI 助理
      </h3>
      <div
        class="w-[286px] mt-[26px] h-9 p-1.5 mx-auto bg-slate-600 bg-opacity-5 rounded-lg justify-start items-start gap-0.5 flex"
      >
        <div
          class="w-[136px] px-3 h-6 justify-center items-center flex cursor-pointer"
          :class="isChat ? 'bg-white rounded' : 'rounded-sm'"
          @click="changeChat(true)"
        >
          <div class="text-slate-600 text-sm font-normal">与心理学巨头聊天</div>
        </div>
        <div
          class="w-[136px] h-6 px-3 justify-center items-center flex cursor-pointer"
          :class="!isChat ? 'bg-white rounded' : 'rounded-sm'"
          @click="changeChat(false)"
        >
          <div class="text-slate-600 text-sm font-normal">资料库查询</div>
        </div>
      </div>
      <div class="w-[994px] mx-auto relative z-[100]">
        <div
          class="w-[994px] p-[10px] mt-[23px] bg-white bg-opacity-30 rounded-[80px] shadow border border-white backdrop-blur-[6px] relative"
        >
          <div class="flex flex-row items-center" v-if="isChat">
            <div
              class="w-20 h-14 p-2 rounded-[80px] justify-start items-center gap-2 inline-flex relative cursor-pointer"
              :class="showSelectModal ? 'bg-gray-200' : ''"
              @click="showSelectModal = !showSelectModal"
            >
              <img class="w-10 h-10 rounded-full" :src="useFile(searchData.src)" />
              <div
                class="w-4 h-4 absolute"
                :class="
                  showSelectModal
                    ? 'left-[75px] top-[38px] origin-top-left rotate-180'
                    : 'left-[60px]'
                "
              >
                <img :src="up" alt="" />
              </div>
            </div>
            <div class="w-px h-5 gap-2 bg-neutral-800 ml-[30px]"></div>
            <div class="text-neutral-800 text-lg font-normal ml-[25px]">
              <input
                class="w-[700px] h-[40px] bg-transparent outline-none"
                :placeholder="`${
                  searchData.name
                    ? '与' + searchData.name + '对话，请输入你想要发送的内容'
                    : ''
                }`"
                type="text"
                v-model="searchValue"
              />
            </div>
            <div
              class="w-[36px] h-[36px] bg-neutral-900 rounded-full items-center justify-center inline-flex ml-auto cursor-pointer"
              @click="goChat(searchData)"
              @keydown="handleKeydown"
            >
              <img :src="useFile('/src/assets/images/searchbtn.svg')" class="ml-[4px]" width="20" height="20" alt="" />
            </div>
          </div>
          <div class="h-14 flex flex-row items-center" v-if="!isChat">
            <input
              class="w-full h-[40px] pl-[24px] bg-transparent outline-none text-lg font-normal"
              placeholder="请输入要查询的资料"
              type="text"
              v-model="searchValue"
            />
            <div class="w-6 h-6 inline-flex ml-auto mr-[10px] cursor-pointer" @click="goSearch('history')">
              <img :src="useFile('/src/assets/images/historybtn.svg')" alt="" />
            </div>
            <div
              class="w-[36px] h-[36px] bg-neutral-900 rounded-full items-center justify-center inline-flex ml-auto cursor-pointer"
              @click="goSearch('search')"
            >
              <img :src="useFile('/src/assets/images/ziliaosearch.svg')" alt="" />
            </div>
          </div>
        </div>
        <div
          class="w-[994px] h-[169px] mt-[15px] z-[100] absolute bg-white bg-opacity-90 rounded-[32px] shadow border border-white backdrop-blur-[6px]"
          v-if="showSelectModal"
        >
          <div class="text-neutral-800 mt-[20px] ml-[20px] text-sm font-normal">
            与心理学巨头聊天
          </div>
          <div
            class="w-[994px] h-[100px] mt-[15px] px-5 justify-between items-start gap-[21px]"
          >
            <div
              v-for="item in copilotsStore.authorList"
              :key="item.id"
              @click="selectPerson(item)"
              class="w-[100px] h-[100px] flex-col justify-center items-center gap-3 inline-flex"
            >
              <img class="w-[60px] h-[60px] rounded-full" :src="useFile(item.src)" />
              <div class="text-zinc-600 text-sm font-normal">{{ item.title }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-[1208px] mt-[61px] mx-auto">
        <div class="text-slate-800 text-base font-semibold">💬 自我修养和专业发展</div>
      </div>
      <div class="w-[1208px] mt-[10px] mx-auto justify-start items-start gap-4 flex">
        <div class="w-full space-x-6 mt-2">
          <div class="flex flex-row flex-wrap gap-6">
            <div
              @click="goCharge(index)"
              v-for="(item, index) in copilotsStore['CLP_CONFIG']"
              :key="index"
              class="flex flex-col w-[284px] h-[180px] p-[24px] items-start gap-y-8 rounded-lg border-2 border-white bg-slate-100 bg-opacity-90 backdrop-blur-[14px] cursor-pointer"
            >
              <div class="flex h-132 p-0 flex-col items-start gap-6 alignSelf-stretch">
                <div class="w-[56px] h-[56px] flex-shrink-0 rounded-[20px] bg-white">
                  <div
                    class="h-[56px] leading-[56px] flex justify-center items-center text-black text-[26px] font-normal text-center"
                  >
                    <img width="40" :src="useFile(item.src)"/>
                  </div>
                  <div
                    class="w-[236px] mt-[19px] leading-[19px] text-slate-800 text-base font-medium"
                  >
                    {{ item.typeCN }}
                  </div>
                  <div class="w-[236px] text-gray-500 text-sm font-light">
                    {{ item.des }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="w-[1208px] mt-[61px] mx-auto">
        <div class="text-slate-800 text-base font-semibold">💬 打造宣传个人 IP 引流</div>
        <div class="w-[1208px] mt-[10px] mx-auto justify-start items-start gap-4 flex">
          <div class="w-full space-x-6 mt-2">
            <div class="flex flex-row flex-wrap gap-6">
              <div
                class="flex flex-col w-[284px] h-[126px] p-[24px] items-start gap-y-8 rounded-lg border-2 border-white bg-slate-100 bg-opacity-90 backdrop-blur-[14px]">
                <div class="flex h-132 p-0 flex-col items-start">
                  <div class="flex flex-row">
                    <img class="w-[32px] h-[32px]" :src="xhs" alt="" />
                    <p class="text-black ml-[10px] font-sans text-base leading-[32px] font-normal font-normal">
                      小红书爆款标题 🔥
                    </p>
                  </div>
                  <div class="w-[235px] h-[34px] mt-[12px] text-gray-500 text-sm font-light">
                    生成让傻逼看了就想点进来的小红书标题
                  </div>
                </div>
              </div>
              <div
                class="flex flex-col w-[284px] h-[126px] p-[24px] items-start gap-y-8 rounded-lg border-2 border-white bg-slate-100 bg-opacity-90 backdrop-blur-[14px]">
                <div class="flex h-132 p-0 flex-col items-start">
                  <div class="flex flex-row">
                    <img class="w-[32px] h-[32px]" :src="xhs" alt="" />
                    <p class="text-black ml-[10px] font-sans text-base leading-[32px] font-normal font-normal">
                      小红书爆款标题 🔥
                    </p>
                  </div>
                  <div class="w-[235px] h-[34px] mt-[12px] text-gray-500 text-sm font-light">
                    生成让傻逼看了就想点进来的小红书标题
                  </div>
                </div>
              </div>
              <div
                class="flex flex-col w-[284px] h-[126px] p-[24px] items-start gap-y-8 rounded-lg border-2 border-white bg-slate-100 bg-opacity-90 backdrop-blur-[14px]">
                <div class="flex h-132 p-0 flex-col items-start">
                  <div class="flex flex-row">
                    <img class="w-[32px] h-[32px]" :src="xhs" alt="" />
                    <p class="text-black ml-[10px] font-sans text-base leading-[32px] font-normal font-normal">
                      小红书爆款标题 🔥
                    </p>
                  </div>
                  <div class="w-[235px] h-[34px] mt-[12px] text-gray-500 text-sm font-light">
                    生成让傻逼看了就想点进来的小红书标题
                  </div>
                </div>
              </div>
              <div
                class="flex flex-col w-[284px] h-[126px] p-[24px] items-start gap-y-8 rounded-lg border-2 border-white bg-slate-100 bg-opacity-90 backdrop-blur-[14px]">
                <div class="flex h-132 p-0 flex-col items-start">
                  <div class="flex flex-row">
                    <img class="w-[32px] h-[32px]" :src="xhs" alt="" />
                    <p class="text-black ml-[10px] font-sans text-base leading-[32px] font-normal font-normal">
                      小红书爆款标题 🔥
                    </p>
                  </div>
                  <div class="w-[235px] h-[34px] mt-[12px] text-gray-500 text-sm font-light">
                    生成让傻逼看了就想点进来的小红书标题
                  </div>
                </div>
              </div>
              <div
                class="flex flex-col w-[284px] h-[126px] p-[24px] items-start gap-y-8 rounded-lg border-2 border-white bg-slate-100 bg-opacity-90 backdrop-blur-[14px]">
                <div class="flex h-132 p-0 flex-col items-start">
                  <div class="flex flex-row">
                    <img class="w-[32px] h-[32px]" :src="xhs" alt="" />
                    <p class="text-black ml-[10px] font-sans text-base leading-[32px] font-normal font-normal">
                      小红书爆款标题 🔥
                    </p>
                  </div>
                  <div class="w-[235px] h-[34px] mt-[12px] text-gray-500 text-sm font-light">
                    生成让傻逼看了就想点进来的小红书标题
                  </div>
                </div>
              </div>
              <div
                class="flex flex-col w-[284px] h-[126px] p-[24px] items-start gap-y-8 rounded-lg border-2 border-white bg-slate-100 bg-opacity-90 backdrop-blur-[14px]">
                <div class="flex h-132 p-0 flex-col items-start">
                  <div class="flex flex-row">
                    <img class="w-[32px] h-[32px]" :src="xhs" alt="" />
                    <p class="text-black ml-[10px] font-sans text-base leading-[32px] font-normal font-normal">
                      小红书爆款标题 🔥
                    </p>
                  </div>
                  <div class="w-[235px] h-[34px] mt-[12px] text-gray-500 text-sm font-light">
                    生成让傻逼看了就想点进来的小红书标题
                  </div>
                </div>
              </div>
              <div
                class="flex flex-col w-[284px] h-[126px] p-[24px] items-start gap-y-8 rounded-lg border-2 border-white bg-slate-100 bg-opacity-90 backdrop-blur-[14px]">
                <div class="flex h-132 p-0 flex-col items-start">
                  <div class="flex flex-row">
                    <img class="w-[32px] h-[32px]" :src="xhs" alt="" />
                    <p class="text-black ml-[10px] font-sans text-base leading-[32px] font-normal font-normal">
                      小红书爆款标题 🔥
                    </p>
                  </div>
                  <div class="w-[235px] h-[34px] mt-[12px] text-gray-500 text-sm font-light">
                    生成让傻逼看了就想点进来的小红书标题
                  </div>
                </div>
              </div>
              <div
                class="flex flex-col w-[284px] h-[126px] p-[24px] items-start gap-y-8 rounded-lg border-2 border-white bg-slate-100 bg-opacity-90 backdrop-blur-[14px]">
                <div class="flex h-132 p-0 flex-col items-start">
                  <div class="flex flex-row">
                    <img class="w-[32px] h-[32px]" :src="xhs" alt="" />
                    <p class="text-black ml-[10px] font-sans text-base leading-[32px] font-normal font-normal">
                      小红书爆款标题 🔥
                    </p>
                  </div>
                  <div class="w-[235px] h-[34px] mt-[12px] text-gray-500 text-sm font-light">
                    生成让傻逼看了就想点进来的小红书标题
                  </div>
                </div>
              </div>
              <div
                class="flex flex-col w-[284px] h-[126px] p-[24px] items-start gap-y-8 rounded-lg border-2 border-white bg-slate-100 bg-opacity-90 backdrop-blur-[14px]">
                <div class="flex h-132 p-0 flex-col items-start">
                  <div class="flex flex-row">
                    <img class="w-[32px] h-[32px]" :src="xhs" alt="" />
                    <p class="text-black ml-[10px] font-sans text-base leading-[32px] font-normal font-normal">
                      小红书爆款标题 🔥
                    </p>
                  </div>
                  <div class="w-[235px] h-[34px] mt-[12px] text-gray-500 text-sm font-light">
                    生成让傻逼看了就想点进来的小红书标题
                  </div>
                </div>
              </div>
              <div
                class="flex flex-col w-[284px] h-[126px] p-[24px] items-start gap-y-8 rounded-lg border-2 border-white bg-slate-100 bg-opacity-90 backdrop-blur-[14px]">
                <div class="flex h-132 p-0 flex-col items-start">
                  <div class="flex flex-row">
                    <img class="w-[32px] h-[32px]" :src="xhs" alt="" />
                    <p class="text-black ml-[10px] font-sans text-base leading-[32px] font-normal font-normal">
                      小红书爆款标题 🔥
                    </p>
                  </div>
                  <div class="w-[235px] h-[34px] mt-[12px] text-gray-500 text-sm font-light">
                    生成让傻逼看了就想点进来的小红书标题
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </template>
  </Back>
</template>

<style lang="less"></style>
