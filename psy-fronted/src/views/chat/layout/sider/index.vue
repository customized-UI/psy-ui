<script setup lang="ts">
import type { CSSProperties } from "vue";
import { computed, ref, watch, h } from "vue";
import add from "@/assets/images/add.svg";
import List from "./List.vue";
import { useAppStore, useChatStore } from "@/store";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { useRoute } from "vue-router";
import { useCopilots } from "@/store";
import { NAvatar, NText, NSelect, SelectRenderTag, SelectRenderLabel } from "naive-ui";
import useFile from "@/assets/js/images_js";
import { router } from "@/router";
const copilotsStore = useCopilots();
const appStore = useAppStore();
const listcomponent = ref()
const chatStore = useChatStore();
const route = useRoute();
const psyname = ref(copilotsStore["authorList"][route.params.type]["title"]);
const { isMobile } = useBasicLayout();
const show = ref(false);

const collapsed = computed(() => appStore.siderCollapsed);

const options = ref([
  {
    label: "弗洛伊德",
    value: "floyd",
    src: "/src/assets/images/floyd.png",
  },
  {
    label: "阿德勒",
    value: "adler",
    src: "/src/assets/images/adler.png",
  },
  {
    label: "荣格",
    value: "jung",
    src: "/src/assets/images/jung.png",
  },
  {
    label: "欧文亚隆",
    value: "yalom",
    src: "/src/assets/images/yalom.png",
  },
  {
    label: "克莱因",
    value: "klein",
    src: "/src/assets/images/klein.png",
  },
  {
    label: "罗杰斯",
    value: "rogers",
    src: "/src/assets/images/rogers.png",
  },
]);
const renderSingleSelectTag: SelectRenderTag = ({ option }) => {
  let src = "";
  if (option.src) {
    src = option.src as string;
  } else {
    src = copilotsStore["authorList"][route.params.type]["src"];
  }
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
      },
    },
    [
      h(NAvatar, {
        src: useFile(src),
        round: true,
        size: 24,
        style: {
          marginRight: "12px",
        },
      }),
      option.label as string,
    ]
  );
};
const renderLabel: SelectRenderLabel = (option) => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
      },
    },
    [
      h(NAvatar, {
        src: useFile(option.src as string),
        round: true,
        size: "small",
      }),
      h(
        "div",
        {
          style: {
            marginLeft: "12px",
            padding: "4px 0",
          },
        },
        [h("div", null, [option.label as string])]
      ),
    ]
  );
};

function handleAdd() {
  chatStore.addHistory(
    { title: "New Chat", uuid: Date.now(), isEdit: false },
    [],
    route.params.type
  );
}

function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value);
}

const getMobileClass = computed<CSSProperties>(() => {
  if (isMobile.value) {
    return {
      position: "fixed",
      zIndex: 50,
    };
  }
  return {};
});

const mobileSafeArea = computed(() => {
  if (isMobile.value) {
    return {
      paddingBottom: "env(safe-area-inset-bottom)",
    };
  }
  return {};
});

watch(
  isMobile,
  (val) => {
    appStore.setSiderCollapsed(val);
  },
  {
    immediate: true,
    flush: "post",
  }
);

watch(psyname, async (val) => {
  await router.push({
    name: "ChatSub",
    params: {
      type: val,
      uuid: 0,
    },
  });
  await listcomponent.value.getGroupsList()
  // console.log(val)
});
</script>

<template>
  <!-- <NLayoutSider
    :collapsed="collapsed"
    :collapsed-width="0"
    :width="260"
    :show-trigger="false"
    collapse-mode="transform"
    position="absolute"
    bordered
    class=" dark hidden md:fixed md:inset-y-0 md:flex md:w-[260px] md:flex-col"
    :style="getMobileClass"
    @update-collapsed="handleUpdateCollapsed"
  >
    <div class="flex flex-col h-full" :style="mobileSafeArea">
      <main class="flex flex-col flex-1 min-h-0">
        <div class="p-4">
          <NButton dashed block @click="handleAdd">
            New chat
          </NButton>
        </div>
        <div class="flex-1 min-h-0 pb-4 overflow-hidden">
          <List />
        </div>
      </main>
      <Footer />
    </div>
  </NLayoutSider> -->
  <!-- <template v-if="isMobile">
    <div v-show="!collapsed" class="fixed inset-0 z-40" @click="handleUpdateCollapsed" />
  </template> -->
  <!-- <PromptStore v-model:visible="show" /> -->

  <div
    v-if="!isMobile"
    id="sidebar"
    class="z-[1000] w-[260px] min-w-[22%] max-w-[21%] bg-slate-100 bg-opacity-95 rounded-[20px] border border-white border-opacity-50 backdrop-blur-[14px] flex-col justify-start items-start inline-flex relative"
  >
    <div class="w-full h-[65px] p-6 justify-start items-center inline-flex">
      <div class="text-neutral-800 text-sm font-semibold">
        <!-- {{ copilotsStore['authorList'][route.params.type]['title']  }} -->

        <n-select
          v-model:value="psyname"
          :options="options"
          :render-label="renderLabel"
          :render-tag="renderSingleSelectTag"
        />
      </div>
    </div>
    <div class="w-full h-12 px-6 flex-col justify-start items-start gap-2.5 inline-flex">
      <div
        class="self-stretch h-12 px-6 py-[13px] bg-slate-900 rounded-xl backdrop-blur-[14px] flex-col justify-start items-start gap-6 flex"
      >
        <div
          class="self-stretch justify-start items-center gap-2 inline-flex cursor-pointer"
          @click="handleAdd"
        >
          <div class="w-5 h-5 justify-center items-center flex">
            <div class="w-5 h-5 relative">
              <img :src="add" alt="" />
            </div>
          </div>
          <div class="grow shrink basis-0 text-white text-sm font-normal leading-[20px]">
            新建对话
          </div>
        </div>
      </div>
    </div>
    <div class="self-stretch p-6 justify-start items-center inline-flex">
      <div class="text-neutral-800 text-sm font-semibold">历史对话</div>
    </div>
    <div
      class="self-stretch flex p-6 overflow-y-auto no-scrollbar px-6 pb-6 flex-col justify-start items-start gap-2.5"
    >
      <List ref="listcomponent"/>
    </div>
  </div>
</template>

<style lang="less">
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
#sidebar {
  .n-select {
    > .n-base-selection {
      width: 170px;
      --n-border: none !important;
      --n-border-active: none !important;
      --n-border-focus: none !important;
      --n-border-hover: none !important;
      --n-box-shadow-active: 0 0 0 2px transparent !important;
      --n-box-shadow-focus: 0 0 0 2px transparent !important;
      > .n-base-selection-label {
        background: transparent !important;
      }
    }
  }
}
</style>
