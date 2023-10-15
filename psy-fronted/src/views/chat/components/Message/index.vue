<script setup lang="ts">
import { computed, ref } from "vue";
import TextComponent from "./Text.vue";
import { copyText } from "@/utils/format";
import { useIconRender } from "@/hooks/useIconRender";
import { useCopilots } from "@/store";
import { useRoute } from "vue-router";
import avatar from '@/assets/images/avatar.png'
import useFile from '@/assets/js/images_js'
const route = useRoute()
const copilotsStore = useCopilots();

interface Props {
  dateTime?: string;
  text?: string;
  inversion?: boolean;
  error?: boolean;
  loading?: boolean;
}

interface Emit {
  (ev: "regenerate"): void;
  (ev: "delete"): void;
}

const props = defineProps<Props>();

const emit = defineEmits<Emit>();

const { iconRender } = useIconRender();

const textRef = ref<HTMLElement>();

const asRawText = ref(props.inversion);

const messageRef = ref<HTMLElement>();

const options = computed(() => {
  const common = [
    {
      label: t("chat.copy"),
      key: "copyText",
      icon: iconRender({ icon: "ri:file-copy-2-line" }),
    },
    {
      label: t("common.delete"),
      key: "delete",
      icon: iconRender({ icon: "ri:delete-bin-line" }),
    },
  ];

  if (!props.inversion) {
    common.unshift({
      label: asRawText.value ? t("chat.preview") : t("chat.showRawText"),
      key: "toggleRenderType",
      icon: iconRender({
        icon: asRawText.value ? "ic:outline-code-off" : "ic:outline-code",
      }),
    });
  }

  return common;
});

function handleSelect(key: "copyText" | "delete" | "toggleRenderType") {
  switch (key) {
    case "copyText":
      copyText({ text: props.text ?? "" });
      return;
    case "toggleRenderType":
      asRawText.value = !asRawText.value;
      return;
    case "delete":
      emit("delete");
  }
}

function handleRegenerate() {
  messageRef.value?.scrollIntoView();
  emit("regenerate");
}
</script>

<template>
  <div
    ref="messageRef"
    class="self-stretch w-full overflow-y-auto no-scrollbar grow shrink basis-0 flex-col justify-start items-start flex"
  >
    <div class="self-stretch w-full px-6 pt-3 pb-1 justify-start items-start gap-2.5 inline-flex" style="background: var(--background-color-background-color-secondary, #F7F7F7);" v-if="!inversion">
        <div
          class="w-9 rounded-[140px] justify-center items-center flex"
        >
            <img :src="useFile(copilotsStore['authorList'][route.params.type]['src'])" alt="">
        </div>
        <div class="grow shrink basis-0 mt-[6px]">
          <TextComponent
          ref="textRef"
          :inversion="inversion"
          :error="error"
          :text="text"
          :loading="loading"
          :as-raw-text="asRawText"
        />
        </div>
    </div>
    <div
    v-else
      class="self-stretch px-6 py-3 justify-start items-center gap-3 inline-flex"
    >
      <img class="w-9 h-9 rounded-[60px]" :src="avatar" />
      <div class="w-[887px] text-neutral-800 text-sm font-normal leading-snug">
        <TextComponent
          ref="textRef"
          :inversion="inversion"
          :error="error"
          :text="text"
          :loading="loading"
          :as-raw-text="asRawText"
        />
      </div>
    </div>
  </div>
  <!-- <div
    ref="messageRef"
    class="flex w-full mb-6 overflow-hidden"
    :class="[{ 'flex-row-reverse': inversion }]"
  >
    <div
      class="flex items-center justify-center flex-shrink-0 h-8 overflow-hidden rounded-full basis-8"
      :class="[inversion ? 'ml-2' : 'mr-2']"
    >
      <AvatarComponent :image="inversion" />
    </div>
    <div class="overflow-hidden text-sm " :class="[inversion ? 'items-end' : 'items-start']">
      <p class="text-xs text-[#b4bbc4]" :class="[inversion ? 'text-right' : 'text-left']">
        {{ dateTime }}
      </p>
      <div
        class="flex items-end gap-1 mt-2"
        :class="[inversion ? 'flex-row-reverse' : 'flex-row']"
      >
        <TextComponent
          ref="textRef"
          :inversion="inversion"
          :error="error"
          :text="text"
          :loading="loading"
          :as-raw-text="asRawText"
        />
        <div class="flex flex-col">
        </div>
      </div>
    </div>
  </div> -->
</template>
