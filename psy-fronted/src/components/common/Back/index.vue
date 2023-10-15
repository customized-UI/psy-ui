<script setup lang="ts">
import { Header } from "@/components/common";
import e8 from "@/assets/images/Ellipse 8.svg";
import e9 from "@/assets/images/Ellipse 9.svg";
import { useRoute } from "vue-router";
import { ref } from "vue";

const route = useRoute();
const header = ref()
const isChatPage = ref(false);
if (route.name == "ChatSub") {
  isChatPage.value = true;
}

const showLogin = () => {
  header.value.showLogin()
}

defineExpose({
  showLogin
})

</script>

<template>
  <div class="w-full h-full bg-[#E1E7EB]">
    
  <Header ref="header"/>
  <div class="w-full h-full bg-[#E1E7EB]">

    <div
      class="px-[100px] pt-[20px] pb-[140px] h-full relative"
      :class="isChatPage ? 'flex flex-auto' : ''"
    >
      <slot name="container" />
    </div>
  </div>
    
    <div
      class="w-[163px] h-[73px] absolute top-[46.9px] right-[202px] transform rotate-27 flex-shrink-0 fill-ffc1f1 opacity-80 filter blur-77"
    >
      <img :src="e8" alt="" />
    </div>
    <div
    style="z-index: -100;"
      class="w-[193px] h-[130px] absolute top-[88px] left-[188px] transform rotate-27 flex-shrink-0 fill-ffc1f1 opacity-80 filter blur-77"
    >
      <img :src="e9" alt="" />
    </div>
  </div>
</template>

<style lang="less"></style>
