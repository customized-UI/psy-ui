<script setup lang="ts">
import { NModal, NCountdown, CountdownProps, useMessage } from "naive-ui";
import { computed, ref } from "vue";
import { sendCode, login } from '@/api'
import left from "@/assets/images/ArrowNarrowLeft.svg";
import { useAuthStore } from "@/store";
import { useRoute, useRouter } from "vue-router";
import useFile from '@/assets/js/images_js'
const authStore = useAuthStore();
const message = useMessage();
const router = useRouter();
const route = useRoute();
const emitLogin = defineEmits(['isLogin'])
let showLogin = ref(false);
let showCodeCheck = ref(false);
let showPhoneFocus = ref(false);
let isValidPhoneNumber = ref(true);
let timeActive = ref(false)
let isValidCode = ref(false)
let isEmptyIndex = ref('')
const reg = ref(/^1[3456789]\d{9}$/);
let phone = ref("");
const renderCountdown: CountdownProps['render'] = ({
      seconds
}) => {
    return `${String(seconds).padStart(2, '03')}秒后重新获取`
}

const countdownFinish = () => {
    timeActive.value = false
}

let code = ref(["", "", "", ""]);

const show = () => {
  showLogin.value = true;
};

const getCode = async () => {
    // showCodeCheck.value = reg.value.test(phone.value);
    if (reg.value.test(phone.value)) {
        await sendCode({ phone: phone.value }).then(async (res) => {
            if (res.code == 200) {
                timeActive.value = true
                showCodeCheck.value = true
            } else {
                showCodeCheck.value = false
            }
        })
    }
};

const tologin = async () => {
    for (let i in code.value) {
        if (code.value[i] === '') {
            isValidCode.value = true
            return isEmptyIndex.value = i
        } else {
          isValidCode.value = false
        }
    }
    if (!isValidCode.value) {
        let codevalue = code.value.join('')
        await login({ phone: phone.value, code:codevalue }).then(async (res) => {
            if (res.code == 200) {
                await authStore.setToken(res.data.token);
                await message.success("登录成功");
                emitLogin('isLogin', res.data.token)
                showLogin.value = await false
            } else {
                isValidCode.value =true
            }
        })
    }
}

const phoneInput = (event) => {
//   console.log(event);
};

const phoneFocus = (event) => {
  showPhoneFocus.value = true;
};

const phoneBlur = (event) => {
  showPhoneFocus.value = false;
  isValidPhoneNumber.value = reg.value.test(phone.value);
};

const handleInput = (index, event) => {
  if (event.target.value.length > 1) {
    code.value[index] = event.target.value.slice(0, 1);
  }
  if (event.target.value) {
    if (index < code.value.length - 1) {
      event.target.nextElementSibling.focus();
    }
  } else {
    if (index > 0) {
      event.target.previousElementSibling.focus();
    }
  }
};
const handleKeyDown = (index, event) => {
  if (event.key === "Backspace" && !code.value[index]) {
    if (index > 0) {
      code.value[index - 1] = "";
      event.target.previousElementSibling.focus();
    }
  }
};

defineExpose({
  show,
});
</script>

<template>
  <n-modal v-model:show="showLogin" preset="card" id="loginModal" :mask-closable="route.name == 'home' ? true : false">
    <div
      class="w-[400px] h-[508.14px] p-8 bg-white rounded-2xl flex-col justify-start items-center gap-16 inline-flex"
    >
      <div
        class="w-[336px] h-[340.14px] flex-col justify-start items-center gap-10 inline-flex"
      >
        <div class="self-stretch justify-start items-center gap-1 inline-flex">
          <div class="w-5 h-5 justify-center items-center flex">
            <div
              class="w-5 h-5 relative cursor-pointer"
              v-if="showCodeCheck"
              @click="showCodeCheck = false; timeActive = false"
            >
              <img :src="left" alt="" />
            </div>
          </div>
          <div class="text-neutral-800 text-lg font-medium">登录</div>
        </div>
        <div
          class="px-[23px] py-[19px] rounded-[60.50px] justify-start items-center gap-2.5 inline-flex"
        >
          <div class="w-[38px] h-[45.14px] relative">
            <img
            class="w-[40px] h-[40px] p-1 left-[10px] top-[4px] absolute"
            :src="useFile('/src/assets/images/final.png')"
          />
          </div>
          <div class="text-neutral-800 text-2xl font-medium">Psy-ai</div>
        </div>
        <div class="flex-col justify-start items-center gap-8 flex" v-if="!showCodeCheck">
          <div
            class="w-[336px] h-10 relative border border-2 rounded-[8px]"
            :class="
              showPhoneFocus
                ? 'border-[#000]'
                : !isValidPhoneNumber
                ? 'border-[red]'
                : 'border-[#EDEDED]'
            "
          >
            <div
              class="w-px h-5 left-[82px] top-[10px] absolute bg-neutral-800 bg-opacity-10"
            ></div>
            <div
              class="left-[16px] top-[10px] absolute justify-start items-center gap-1 inline-flex"
            >
              <div class="text-neutral-800 text-sm font-normal leading-tight">+ 86</div>
              <div class="w-4 h-4 relative opacity-80"></div>
            </div>
            <div
              class="w-[226px] left-[91px] top-[10px] absolute text-zinc-600 text-sm font-normal leading-tight"
            >
              <input
                class="grow shrink basis-0 w-full text-neutral-800 text-sm font-normal leading-tight outline-none"
                type="number"
                placeholder="请输入手机号"
                v-model="phone"
                @input="phoneInput($event)"
                @focus="phoneFocus($event)"
                @blur="phoneBlur($event)"
              />
            </div>
            <div
              class="left-0 top-[44px] absolute text-red-500 text-xs font-normal leading-none"
              v-if="!isValidPhoneNumber"
            >
              手机号格式有误，请检查后重新输入
            </div>
          </div>
          <div class="flex-col justify-start items-center gap-4 flex">
            <div
              class="w-[336px] h-10 px-4 py-1.5 bg-slate-900 rounded-md justify-center items-center gap-2 inline-flex cursor-pointer"
              @click="getCode"
            >
              <div class="text-white text-sm font-medium leading-normal">
                <span v-if="!timeActive">获取验证码</span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="w-[336px] h-[152px] flex-col justify-start items-center gap-8 inline-flex"
          v-if="showCodeCheck"
        >
          <div class="w-[198px] mx-auto">
            <div class="justify-start items-start gap-3 flex">
              <!-- <div class="w-10 h-10 relative border border-[#EDEDED] rounded-[8px]" v-for="(item,index) in code" :key="index"> -->
              <input
                class="w-10 h-10 relative border border-2 rounded-[8px] text-center"
                :class="isEmptyIndex && +isEmptyIndex == index ? 'border-[red]' : isValidCode ? 'border-[red]' : 'border-[#EDEDED]'"
                type="number"
                maxlength="1"
                v-for="(item, index) in code"
                :key="index"
                v-model="code[index]"
                @input="handleInput(index, $event)"
                @keydown="handleKeyDown(index, $event)"
              />
              <!-- </div> -->
            </div>
          </div>
          
          <n-countdown
              v-if="timeActive"
              :render="renderCountdown"
              :duration="60000"
              :active="timeActive"
              :on-finish="countdownFinish"
          />
          <div class="text-red-500 text-xs font-normal leading-none" v-if="isValidCode">
            验证码有误，请重新输入
          </div>
          <div class="flex-col justify-start items-center gap-4 flex">
            <div
              class="w-[336px] h-10 px-4 py-1.5 bg-slate-900 rounded-md justify-center items-center gap-2 inline-flex cursor-pointer"
               @click="tologin"
            >
              <div class="text-white text-sm font-medium leading-normal">登录</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<style lang="less">
#loginModal {
  width: 400px;
  height: 508.14px;
  border-radius: 20px;
  background: rgba(225, 231, 235, 0.8) !important;
  backdrop-filter: blur(5px);

  .n-card-header {
    display: none;
  }

  .n-card__content {
    padding: 0 !important;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
