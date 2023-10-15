<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { fetchCharge, addOtherHistories, fetchOtherText, checkToken } from "@/api";
import { SubBack } from "@/components/common";
import { useMessage, NSpin, NSelect } from "naive-ui";
import { useRoute } from "vue-router";
import { useAuthStore, useCopilots } from "@/store";
import useFile from '@/assets/js/images_js'
import { createParser } from "eventsource-parser";
const authStore = useAuthStore();
const copilotsStore = useCopilots();
const message = useMessage()
const route = useRoute()
const title = ref("");
const role = ref("");
const text = ref(``);
const translateText = ref(``)
const answerText = ref('')
const grade = ref('')
const historyData = ref({
  title: "",
  role: "",
  text: "",
  translateText: "",
  answerText: "",
  grade: ""
})
const subBack = ref()
const isLoading = ref(false);
const isBuilding = ref(false) // 正在生成
const showHistories = () => {
  subBack.value.showHistories(route.name)
}
let controller = new AbortController();

const options = ref([
  {
    value: '入门',
    label: '入门'
  },
  {
    value: '初级',
    label: '初级'
  },
  {
    value: '中级',
    label: '中级'
  },
  {
    value: '高级',
    label: '高级'
  }
])

const buildData = async () => {
  if (isLoading.value || isBuilding.value) return
  if (route.name == 'Charge' && !title.value && !role.value) {
    return message.warning("请输入书名和作者")
  }

  if (route.name == 'Learn' && !grade.value && !title.value) {
    return message.warning('请输入主题以及英语水平')
  }

  isLoading.value = await true
  isBuilding.value = await true
  await fetchCharge(route.name, { title: title.value, role: role.value, grade: grade.value }).then(
    async (res) => {
      text.value = ''
      translateText.value = ''
      answerText.value = ''
      const reader = res.body?.getReader()
      const parser = createParser(async (event) => {
        if (event.type === "event") {
          try {
            let json = await JSON.parse(event.data);
            if (json.type == 'tokens') {
              isLoading.value = await false
              text.value = text.value + json.content.tokens.text
              await subBack.value.scrollToBottom()
            } else if (json.type == 'block_execution') {
            } else if (json.type == 'final') {
              historyData.value = { ...historyData.value, title: title.value, role: role.value, grade: grade.value, text: text.value }
              isLoading.value = await false
              isBuilding.value = await false
              // console.log(text.value,'在这里')
              await addOtherHistories({ role: role.value, title: title.value, content: text.value, grade: grade.value, type: route.name })
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
          // console.log(new TextDecoder().decode(value))
        }
      } catch {

      } finally {
        reader.releaseLock(); // (E)
      }
    }
  ).catch(error => {
    isLoading.value = false
    message.error('连接超时,请稍后再试')
  })
};

const toFetchOther = async (type: string) => {
  if (isLoading.value || isBuilding.value) return
  if (type == 'translate' && translateText.value) return
  if (type == 'answer' && answerText.value) return
  let msgArr: { role: string; content: string; }[] = []
  if (!grade.value && !title.value) {
    return message.error('请先生成文章')
  }
  if (type == 'translate') {
    msgArr = [
      {
        role: "user",
        content: `My level is ${historyData.value.grade} and the requirement is ${historyData.value.title}`
      },
      {
        role: 'assistant',
        content: text.value
      },
      {
        role: 'user',
        content: '查看文章翻译'
      }
    ]
  } else if (type == 'answer') {
    if (!historyData.value.translateText) {
      msgArr = [
        {
          role: "user",
          content: `My level is ${historyData.value.role} and the requirement is ${historyData.value.title}`
        },
        {
          role: 'assistant',
          content: historyData.value.text
        },
        {
          role: 'user',
          content: '查看答案'
        }
      ]
    } else {
      msgArr = [
        {
          role: "user",
          content: `My level is ${historyData.value.role} and the requirement is ${historyData.value.title}`
        },
        {
          role: 'assistant',
          content: historyData.value.text
        },
        {
          role: 'user',
          content: '查看文章翻译'
        },
        {
          role: 'assistant',
          content: historyData.value.translateText
        },
        {
          role: 'user',
          content: '查看答案'
        }
      ]
    }
  }
  const data = {
    messages: msgArr,
    signal: controller.signal,
  }
  isBuilding.value = await true
  let textvalue = ''
  await fetchOtherText(data).then(async res => {
    translateText.value = translateText.value ? translateText.value : ''
    answerText.value = answerText.value ? answerText.value : ''
    const reader = res.body?.getReader()
    const parser = createParser(async (event) => {
      if (event.type === "event") {
        try {
          let json = await JSON.parse(event.data);
          if (json.type == 'tokens') {
            isLoading.value = await false
            if (type == 'translate') {
              translateText.value = translateText.value + json.content.tokens.text
            } else if (type == 'answer') {
              answerText.value = answerText.value + json.content.tokens.text
            }
            textvalue = textvalue + json.content.tokens.text
            await subBack.value.scrollToBottom()
          } else if (json.type == 'final') {
            historyData.value = { ...historyData.value, title: title.value, role: role.value, grade: grade.value, text: textvalue }
            isLoading.value = await false
            isBuilding.value = await false
            await addOtherHistories({ role: role.value, title: title.value, content: textvalue, grade: grade.value, type: route.name })
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
      }
    } catch {

    } finally {
      reader.releaseLock(); // (E)
    }
  }).catch(error => {
    isLoading.value = false
    message.error('连接超时,请稍后再试')
  })
}

onMounted(async () => {
  if (!authStore.getToken()) {
    return subBack.value.showLogin();
  } else {
    try {
      await checkToken({ token: authStore.getToken() });
    } catch (error) {
      message.warning("您的登录有效期已过,请重新登录");
      subBack.value.showLogin();
      throw error;
    }
    options.value = [
      {
        value: '入门',
        label: '入门'
      },
      {
        value: '初级',
        label: '初级'
      },
      {
        value: '中级',
        label: '中级'
      },
      {
        value: '高级',
        label: '高级'
      }
    ]
  }
})

onUnmounted(() => {
  controller.abort();
})



</script>

<template>
  <SubBack ref="subBack">
    <template #type>
      <div class="w-[304px] justify-start items-center gap-4 inline-flex">
        <div class="w-14 h-14 relative">
          <div class="w-14 h-14 left-0 top-0 absolute inline-flex items-center justify-center bg-white rounded-[20px]">
            <img width="40" :src="useFile(copilotsStore['CLP_CONFIG'][route.name]['src'])">
          </div>
        </div>
        <div class="text-neutral-800 text-base font-semibold leading-tight">
          {{ copilotsStore['CLP_CONFIG'][route.name]['typeCN'] }}
        </div>
      </div>
    </template>
    <template #role v-if="copilotsStore['CLP_CONFIG'][route.name]['showRole']">
      <div class="w-[304px] justify-between items-center gap-48 inline-flex">
        <div class="text-neutral-800 text-sm font-normal leading-tight">
          {{ copilotsStore['CLP_CONFIG'][route.name]['role'] }}
        </div>
      </div>
      <div class="self-stretch justify-start items-center gap-2 inline-flex">
        <div class="grow shrink basis-0 flex-col justify-start items-center gap-1 inline-flex">
          <div
            class="self-stretch px-3 py-2 bg-white rounded-lg border border-neutral-800 border-opacity-10 justify-start items-center gap-2 inline-flex">
            <input class="grow shrink basis-0 text-neutral-800 text-sm font-normal leading-tight outline-none"
              v-model="role" type="text" :placeholder="`输入${copilotsStore['CLP_CONFIG'][route.name]['role']}`" />
          </div>
        </div>
      </div>
    </template>
    <template #title v-if="copilotsStore['CLP_CONFIG'][route.name]['showTitle']">
      <div class="w-[304px] justify-between items-center gap-48 inline-flex">
        <div class="text-neutral-800 text-sm font-normal leading-tight">
          {{ copilotsStore['CLP_CONFIG'][route.name]['title'] }}
        </div>
      </div>
      <div class="self-stretch justify-start items-center gap-2 inline-flex">
        <div class="grow shrink basis-0 flex-col justify-start items-center gap-1 inline-flex">
          <div
            class="self-stretch px-3 py-2 bg-white rounded-lg border border-neutral-800 border-opacity-10 justify-start items-center gap-2 inline-flex">
            <input v-if="!copilotsStore['CLP_CONFIG'][route.name]['titleIsAreaText']"
              class="grow shrink basis-0 text-neutral-800 text-sm font-normal leading-tight outline-none" v-model="title"
              :type="'text'" :placeholder="`请输入${copilotsStore['CLP_CONFIG'][route.name]['title']}...`" />
            <textarea v-if="copilotsStore['CLP_CONFIG'][route.name]['titleIsAreaText']" style="resize:none;"
              class="w-full grow shrink basis-0 h-[76px] text-neutral-800 text-sm font-normal leading-tight outline-none"
              v-model="title" :type="'text'" :placeholder="`请输入${copilotsStore['CLP_CONFIG'][route.name]['title']}...`" />
          </div>
        </div>
      </div>
    </template>
    <template #grade v-if="copilotsStore['CLP_CONFIG'][route.name]['showGrade']">
      <div class="w-[368px] h-[66px] flex-col justify-start items-start gap-2.5 inline-flex">
        <div class="w-[304px] justify-between items-center gap-48 inline-flex">
          <div class="text-neutral-800 text-sm font-normal leading-tight">
            {{ copilotsStore['CLP_CONFIG'][route.name]['grade'] }}
          </div>
        </div>
        <div class="self-stretch justify-start items-center gap-2 inline-flex">
          <div class="grow shrink basis-0 flex-col justify-start items-center gap-1 inline-flex">
            <div
              class="self-stretch px-3 bg-white rounded-lg border border-neutral-800 border-opacity-10 justify-start items-center gap-2 inline-flex">
              <div class="grow shrink basis-0 text-neutral-800 text-sm font-normal leading-tight">
                <n-select placeholder="请选择英语水平" id="gradeSelect" v-model:value="grade" :options="options" />
              </div>
              <div class="w-4 h-4 relative"></div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #button>
      <div class="px-4 py-1.5 bg-slate-900 rounded-md justify-center items-center gap-2 flex cursor-pointer"
        @click="buildData">
        <n-spin style="--n-text-color:#fff; --n-color:#fff" :show="isLoading">
          <div class="text-white text-sm font-medium leading-normal">
            生成
          </div>
        </n-spin>
      </div>
      <div class="text-zinc-600 text-sm font-normal leading-tight cursor-pointer flex flex-row">
        <div @click="showHistories">
          历史记录
        </div>
        <div v-if="route.name == 'Learn'" class="ml-[5px]" @click="toFetchOther('translate')">
          查看翻译
        </div>
        <div v-if="route.name == 'Learn'" class="ml-[5px]" @click="toFetchOther('answer')">
          查看答案
        </div>
      </div>
    </template>
    <template #loading v-if="isLoading">
      <div class="loading h-full flex flex-col items-center justify-center">
        <img :src="useFile('/src/assets/images/loading.gif')" alt="">
        <p class="text-zinc-600 text-lg font-normal">生成中...</p>
      </div>
    </template>
    <template #empty v-if="!text && !isLoading">
      <div class="loading h-full flex flex-col items-center justify-center">
        <img :src="useFile('/src/assets/images/Notioly.png')" alt="">
        <p class="text-black text-lg font-normal">请在左侧输入信息，点击“生成”</p>
      </div>

    </template>
    <template #content>
      <v-md-preview :text="text"></v-md-preview>
    </template>
    <template #translate v-if="translateText">
      <div
        class="w-full mt-2 p-4 bg-zinc-100 rounded-[10px] ml-[10px] flex-col justify-start items-start gap-2.5 inline-flex">
        <div class="self-stretch">
          <v-md-preview :text="translateText"></v-md-preview>
        </div>
      </div>
    </template>
    <template #answer v-if="answerText">
      <div
        class="w-full mt-2 p-4 bg-zinc-100 rounded-[10px] ml-[10px] flex-col justify-start items-start gap-2.5 inline-flex">
        <div class="self-stretch">
          <v-md-preview :text="answerText"></v-md-preview>
        </div>
      </div>
    </template>
  </SubBack>
</template>

<style lang="less">
#historyModal {
  width: 1300px;
  height: 800px;
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

#gradeSelect {
  >.n-base-selection {
    --n-border: none !important;
    --n-border-active: none !important;
    --n-border-focus: none !important;
    --n-border-hover: none !important;
    --n-box-shadow-active: 0 0 0 2px transparent !important;
    --n-box-shadow-focus: 0 0 0 2px transparent !important;
  }
}
</style>
