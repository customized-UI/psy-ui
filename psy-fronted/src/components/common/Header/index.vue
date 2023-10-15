<script lang="ts" setup>
import { Login, MemberModal } from '@/components/common'
import { computed, ref } from 'vue';
import { useAuthStore, useUserStore } from "@/store";
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui'
import useFile from '@/assets/js/images_js'
const authStore = useAuthStore();
const userStore = useUserStore();
const message = useMessage()
let token = ref(authStore.$state.token)
const login = ref<any>()
const member = ref<any>()
const router = useRouter()
const userInfo = computed(() => userStore.userInfo)
const isLogin = (v:any) => {
  if(!token.value) {
    token.value = v
  }
}

const logout = () => {
  authStore.removeToken()
  router.go(0)
}

const showMember = async () => { 
  await userStore.getUserInfo()
  member.value.show(true)
}

const isMember = (v: any) => {
  
}

const showLogin = () => {
  login.value.show()
}

defineExpose({
  showLogin
})
</script>

<template>
  <header
    class="w-[100%] h-20 px-8 bg-[#E1E7EB] backdrop-blur-lg justify-between items-center gap-2.5 inline-flex"
  >
    <div class="justify-start items-center flex">
      <div class="w-12 h-12 relative rounded-[65.33px]">
        <img
          class="w-[30px] h-[30px] p-1 left-[12px] top-[8px] absolute"
          :src="useFile('/src/assets/images/final.png')"
        />
      </div>
      <a href="/">
      <div class="text-black text-lg font-semibold cursor-pointer">Psy-ai</div>
    </a>
    </div>
    <div class="justify-start items-center gap-12 flex">
      <div class="justify-start items-center gap-12 flex">
        <div class="text-black text-sm font-medium cursor-pointer" v-if="token" @click="logout">退出登录</div>
        <div class="text-black text-sm font-medium cursor-pointer" v-if="token" @click="showMember">会员购买</div>
      </div>
      <div
        class="px-4 py-1.5 bg-slate-900 rounded-md justify-center items-center gap-2 flex" v-if="!token"
      >
        <div class="text-white text-sm font-medium leading-normal cursor-pointer" @click="login.show()">Login</div>
      </div>
    </div>
  </header>
  <Login ref="login" @isLogin="isLogin"/>
  <MemberModal ref="member" @isMember="isMember"></MemberModal>
</template>

