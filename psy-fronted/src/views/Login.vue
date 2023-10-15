<script lang="ts" setup>
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { ref, reactive } from "vue";
import { login, register } from "@/api";
import { useAuthStore } from "@/store";
import { useRoute, useRouter } from "vue-router";
import {
  NSpin,
  NTabs,
  NTabPane,
  NCard,
  NForm,
  NFormItemRow,
  NInput,
  NButton,
  useMessage,
  FormItemRule,
} from "naive-ui";

let loading = ref(false);
const router = useRouter();
const route = useRoute()
const message = useMessage();
const { isMobile } = useBasicLayout();
const authStore = useAuthStore();
const loginFormRef = ref(null);
const registerFormRef = ref(null);
const loginForm = reactive({
  username: "",
  password: "",
});
const loginRules = {
  username: [
    {
      required: true,
      message: "请输入账号",
      trigger: ["input", "blur"],
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: ["input", "blur"],
    },
  ],
};

const registerForm = reactive({
  username: "",
  password: "",
  repassword: "",
  inviteCode: '',
});


if (route.query && route.query.ic) {
  registerForm.inviteCode = route.query.ic
}

const registerRules = {
  username: [
    {
      required: true,
      message: "请输入账号",
      trigger: ["input", "blur"],
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: ["input", "blur"],
    },
  ],
  repassword: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error("请输入重复密码");
        } else if (value !== registerForm.password) {
          return new Error("请保持重复密码与密码一致");
        }
        return true;
      },
      trigger: ["input", "blur"],
    },
  ],
};

const loginSubmit = async () => {
  loginFormRef.value?.validate(async (err: any) => {
    if (!err) {
      await login(loginForm)
        .then(async (res) => {
          if (res.code == 200) {
            await authStore.setToken(res.data.token);
            await message.success("登录成功");
            loading.value = await true;
            await router.push({
              name: "home",
            });
          } else {
            return message.error(res.message);
          }
        })
        .catch((err) => {});
    } else {
      console.log(err);
    }
  });
};

const registerSubmit = async () => {
  registerFormRef.value?.validate(async (err: any) => {
    if (!err) {
      await register(registerForm).then(async (res) => {
        if (res.code == 200) {
          await message.success("注册成功");
          setTimeout(async function () {
            await login(registerForm)
              .then(async (lres) => {
                if (lres.code == 200) {
                  await authStore.setToken(lres.data.token);
                  await message.success("登录成功");
                  loading.value = await true;
                  await router.push({
                    name: "Root",
                  });
                } else {
                  return message.error(lres.message);
                }
              }, 1000)
              .catch((err) => {});
          });
        } else {
          return message.error(res.message);
        }
      });
    }
  });
};
</script>

<template>
  <div class="w-full h-full grid place-items-center bg-black">
    <n-spin :show="loading">
      <div class="bg-white rounded-lg" :class="isMobile ? 'w-80 h-1/2' : 'w-480px h-300px'">
        <n-card>
          <n-tabs
            class="card-tabs"
            default-value="signin"
            size="large"
            animated
            pane-wrapper-style="margin: 0 -4px"
            pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
          >
            <n-tab-pane name="signin" tab="登录">
              <n-form ref="loginFormRef" :model="loginForm" :rules="loginRules">
                <n-form-item-row path="username" label="用户名">
                  <n-input v-model:value="loginForm.username" />
                </n-form-item-row>
                <n-form-item-row path="password" label="密码">
                  <n-input
                    type="password"
                    v-model:value="loginForm.password"
                    show-password-on="click"
                  />
                </n-form-item-row>
              </n-form>
              <n-button
                type="primary"
                block
                secondary
                strong
                @click="loginSubmit"
              >
                登录
              </n-button>
            </n-tab-pane>
            <n-tab-pane name="signup" tab="注册">
              <n-form
                ref="registerFormRef"
                :model="registerForm"
                :rules="registerRules"
              >
                <n-form-item-row path="username" label="用户名">
                  <n-input v-model:value="registerForm.username" />
                </n-form-item-row>
                <n-form-item-row label="密码" path="password">
                  <n-input
                    type="password"
                    v-model:value="registerForm.password"
                    show-password-on="click"
                  />
                </n-form-item-row>
                <n-form-item-row label="重复密码" path="repassword">
                  <n-input
                    type="password"
                    v-model:value="registerForm.repassword"
                    show-password-on="click"
                  />
                </n-form-item-row>
                <n-form-item-row label="邀请码" path="inviteCode">
                  <n-input
                    v-model:value="registerForm.inviteCode"
                    show-password-on="click"
                  />
                </n-form-item-row>
              </n-form>
              <n-button
                type="primary"
                block
                secondary
                strong
                @click="registerSubmit"
              >
                注册
              </n-button>
            </n-tab-pane>
          </n-tabs>
        </n-card>
      </div>
    </n-spin>
  </div>
</template>
