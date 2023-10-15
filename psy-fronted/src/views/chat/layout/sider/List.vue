<script setup lang="ts">
import { computed, onMounted } from "vue";
import { NInput, NPopconfirm, NScrollbar } from "naive-ui";
import { SvgIcon } from "@/components/common";
import { useAppStore, useChatStore } from "@/store";
import { useBasicLayout } from "@/hooks/useBasicLayout";
import { fetchGroups } from "@/api";
import { useRoute } from "vue-router";

const { isMobile } = useBasicLayout();

const appStore = useAppStore();
const chatStore = useChatStore();
const route = useRoute();
// const dataSources = reactive({})
const dataSources = computed(() => chatStore.history);
const { uuid } = route.params as { uuid: string };
console.log('zheezzz')
async function getGroupsList() {
  console.log(route.params.type)
  let data = await fetchGroups(route.params.type);
    let id = 0
    if(!uuid && data.data.length) {
      id = await data.data[0]['id']
    } else {
      console.log('执行1')
      await data.data.forEach(async v => {
        if(+route.params.uuid === +v.id) {
          id = await v.id
        } else {
          id = data.data[0]['id']
        }
      });
    }
      await chatStore.addHistoryByGroup(+id, route.params.type, data);
  // }
  // return data.data
  // console.log(dataSources.value)
}

async function handleSelect({ uuid }: Chat.History) {
  if (isActive(uuid)) return;
  await chatStore.setActive(uuid);
  if (chatStore.active) chatStore.updateHistory(chatStore.active, { isEdit: true }, route.params.type);
  

  if (isMobile.value) appStore.setSiderCollapsed(true);
}

function handleEdit({ uuid }: Chat.History, isEdit: boolean, event?: MouseEvent) {
  event?.stopPropagation();
  chatStore.updateHistory(uuid, { isEdit }, route.params.type);
}

function handleDelete(index: number, uuid: number, event?: MouseEvent | TouchEvent) {
  event?.stopPropagation();
  chatStore.deleteHistory(index, uuid);
}

function handleEnter({ uuid }: Chat.History, isEdit: boolean, event: KeyboardEvent) {
  event?.stopPropagation();
  if (event.key === "Enter") chatStore.updateHistory(uuid, { isEdit }, route.params.type);
}

function isActive(uuid: number) {
  return chatStore.active === uuid;
}

defineExpose({
  getGroupsList
})

onMounted(() => {
  getGroupsList();
});
</script>

<template>
  <div
    v-for="(item, index) of dataSources" :key="index"
    :class="isActive(item.uuid) ? 'border-neutral-800' : ''"
    @click="handleSelect(item)"
    class="self-stretch h-12 px-6 py-[13px] bg-white hover:bg-[#f1f1f1] cursor-pointer rounded-xl border  backdrop-blur-[14px] flex-col justify-start items-start gap-6 flex"
  >
    <div class="self-stretch text-neutral-800 text-sm font-normal leading-snug truncate">
      {{ item.title }}
    </div>
  </div>
  <!-- <NScrollbar class="px-4">
    <div class="flex flex-col gap-2 text-sm">
      <template v-if="!dataSources.length">
        <div class="flex flex-col items-center mt-4 text-center text-neutral-300">
          <SvgIcon icon="ri:inbox-line" class="mb-2 text-3xl" />
          <span>{{ $t('common.noData') }}</span>
        </div>
      </template>
      <template v-else>
        <div v-for="(item, index) of dataSources" :key="index">
          <a
            class="relative flex items-center gap-3 px-3 py-3 break-all border rounded-md cursor-pointer hover:bg-neutral-100 group dark:border-neutral-800 dark:hover:bg-[#24272e]"
            :class="isActive(item.uuid) && ['border-[#4b9e5f]', 'bg-neutral-100', 'text-[#4b9e5f]', 'dark:bg-[#24272e]', 'dark:border-[#4b9e5f]', 'pr-14']"
            @click="handleSelect(item)"
          >
            <span>
              <SvgIcon icon="ri:message-3-line" />
            </span>
            <div class="relative flex-1 overflow-hidden break-all text-ellipsis whitespace-nowrap">
              <NInput
                v-if="item.isEdit"
                v-model:value="item.title"
                size="tiny"
                @keypress="handleEnter(item, false, $event)"
              />
              <span v-else>{{ item.title }}</span>
            </div>
            <div v-if="isActive(item.uuid)" class="absolute z-10 flex visible right-1">
              <template v-if="item.isEdit">
                <button class="p-1" @click="handleEdit(item, false, $event)">
                  <SvgIcon icon="ri:save-line" />
                </button>
              </template>
              <template v-else>
                <button class="p-1">
                  <SvgIcon icon="ri:edit-line" @click="handleEdit(item, true, $event)" />
                </button>
                <NPopconfirm placement="bottom" @positive-click="handleDelete(index, item.uuid, $event)">
                  <template #trigger>
                    <button class="p-1">
                      <SvgIcon icon="ri:delete-bin-line" />
                    </button>
                  </template>
                  {{ $t('chat.deleteHistoryConfirm') }}
                </NPopconfirm>
              </template>
            </div>
          </a>
        </div>
      </template>
    </div>
  </NScrollbar> -->
</template>
