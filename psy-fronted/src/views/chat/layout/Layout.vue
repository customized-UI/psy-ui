<script setup lang="ts">
import { computed } from "vue";
import { NLayout, NLayoutContent } from "naive-ui";
import { useRouter, useRoute } from "vue-router";
import Sider from "./sider/index.vue";
import Permission from "./Permission.vue";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { useAppStore, useAuthStore, useChatStore } from "@/store";
import { Back } from "@/components/common";

const router = useRouter();
const route = useRoute();
const appStore = useAppStore();
const chatStore = useChatStore();
const authStore = useAuthStore();
// router.replace({
//   name: "ChatSub",
//   params: { type: route.params.type, uuid: route.params.uuid ? route.params.uuid : chatStore.active },
// });

const { isMobile } = useBasicLayout();

const collapsed = computed(() => appStore.siderCollapsed);

const needPermission = computed(() => !!authStore.session?.auth && !authStore.token);

const getMobileClass = computed(() => {
  if (isMobile.value) return ["rounded-none", "shadow-none"];
  return ["border", "rounded-md", "shadow-md", "dark:border-neutral-800"];
});

const getContainerClass = computed(() => {
  return ["h-full", { "pl-[260px]": !isMobile.value && !collapsed.value }];
});
</script>

<template>
  <!-- <Header/> -->
  <Back>
    <template #container>
      <Sider />
      <div
      :class="isMobile ? '' : 'ml-[30px] '"
        class="col-span-5 sm:w-[100px] md:col-span-4 lg:max-w-[78%] pt-[16px] flex w-full flex-auto flex-col bg-white rounded-[20px] flex-col justify-start items-start gap-6 inline-flex"
      >
      <RouterView v-slot="{ Component, route }">
        <component :is="Component" :key="route.fullPath" />
      </RouterView>
        <!-- <div
          class="self-stretch  overflow-y-auto no-scrollbar grow shrink basis-0 flex-col justify-start items-start flex"
        >
          <div class="self-stretch p-6 justify-start items-start gap-2.5 inline-flex">
            <div
              class="grow shrink basis-0 justify-start items-start gap-3 flex"
            >
              <div
                class="w-9 pl-[8.45px] pr-[10.45px] py-[7.84px] bg-black rounded-[140px] justify-center items-center flex"
              >
                <div
                  class="w-[17.10px] h-[20.31px] relative flex-col justify-start items-start flex"
                >
                  <div
                    class="w-[14.78px] h-[7.39px] origin-top-left rotate-[39.52deg] rounded-full border border-white"
                  ></div>
                  <div
                    class="w-[14.78px] h-[7.39px] origin-top-left rotate-[-39.52deg] rounded-full border border-white"
                  ></div>
                </div>
              </div>
              <div class="grow shrink basis-0">
                皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为皮亚杰的道德发展理论是关于人类道德认知和行为发展的理论。他认为
              </div>
            </div>
          </div>
          <div
            class="self-stretch px-6 py-3 bg-neutral-100 justify-start items-center gap-3 inline-flex"
          >
            <img class="w-9 h-9 rounded-[60px]" src="https://via.placeholder.com/36x36" />
            <div class="w-[887px] text-neutral-800 text-sm font-normal leading-snug">
              皮亚杰道德发展阶段
            </div>
          </div>
        </div>
        <div
          class="self-stretch h-[104px] p-6 flex-col justify-start items-start gap-2.5 flex"
        >
          <div
            class="self-stretch px-6 py-2.5 bg-white rounded-2xl shadow border border-neutral-800 border-opacity-10 justify-between items-center gap-[754px] inline-flex"
          >
            <div
              class="grow shrink basis-0 text-neutral-800 text-lg font-normal leading-relaxed"
            >
              皮亚杰道德发展阶段
            </div>
            <div class="justify-start items-center gap-2.5 flex">
              <div class="w-9 h-9 bg-neutral-800 rounded-full"></div>
              <div class="w-[20.57px] h-[20.57px] justify-center items-center flex">
                <div class="w-[20.57px] h-[20.57px] relative"></div>
              </div>
            </div>
          </div>
        </div> -->
      </div>
    </template>
  </Back>
  <!-- <div class="h-full  transition-all">
    <div class="h-full overflow-hidden" :class="getMobileClass">
      <NLayout class="z-40 transition" :class="getContainerClass" has-sider>
        <Sider />
        <NLayoutContent class="h-full">
          <RouterView v-slot="{ Component, route }">
            <component :is="Component" :key="route.fullPath" />
          </RouterView>
        </NLayoutContent>
      </NLayout>
    </div>
    <Permission :visible="needPermission" />
  </div> -->
</template>
