<script setup lang="ts">
import { NModal } from "naive-ui";
import { ref } from "vue";
import Pay from './pay.vue'
import Profile from './profile.vue'
const showMember = ref(false);
const canCloseByMask = ref(true)
const selectType = ref(1);
const selectClass = ref("border-neutral-800");
const modalClass = ref('width:800px')
const isBuying = ref(false)
const show = (type: boolean) => {
  selectType.value = 1
  modalClass.value = 'width:800px'
  showMember.value = type;
};


const changeSelect = (type: number) => {
  if (selectType.value == 2 && !canCloseByMask.value) {
    return 
  } else {
    selectType.value = type
  }
  
}

//在付费信息栏用户点击购买的时候页面宽度需要变小展示付款页面
const changeShowPay = (type) => {
  canCloseByMask.value = type
}

const changeShowProfile = (type: number) => { 
  selectType.value = type
}

defineExpose({
  show,
});
</script>

<template>
  <n-modal v-model:show="showMember" preset="card" id="MemberModal" :style="modalClass" :mask-closable="canCloseByMask">
    <div class="w-[1224px] h-[600px] justify-start items-start gap-2.5 inline-flex rounded-[20px]">
      <div
        class="w-[260px] self-stretch bg-slate-100 bg-opacity-95 rounded-[20px] border border-white border-opacity-50 backdrop-blur-[14px] flex-col justify-start items-start inline-flex"
      >
        <div class="self-stretch p-6 justify-start items-center inline-flex">
          <div class="text-neutral-800 text-sm font-semibold">Profile</div>
        </div>
        <div
          class="self-stretch h-[130px] px-6 pb-6 flex-col justify-start items-start gap-2.5 flex"
        >
          <div
            @click="changeSelect(1)"
            :class="selectType == 1 ? 'border-neutral-800' : ''"
            class="self-stretch px-6 py-[13px] border cursor-pointer bg-white rounded-xl backdrop-blur-[14px] justify-start items-center gap-2 inline-flex"
          >
            <div class="w-[18px] h-[18px] justify-center items-center flex">
              <div class="w-[18px] h-[18px] relative"></div>
            </div>
            <div
              class="grow shrink basis-0 text-neutral-800 text-sm font-normal leading-snug"
            >
              个人信息
            </div>
          </div>
          <div
            @click="changeSelect(2)"
            :class="selectType == 2 ? selectClass : ''"
            class="self-stretch px-6 py-[13px] border cursor-pointer bg-white rounded-xl backdrop-blur-[14px] justify-start items-center gap-2 inline-flex"
          >
            <div class="w-[18px] h-[18px] justify-center items-center flex">
              <div class="w-[18px] h-[18px] relative"></div>
            </div>
            <div
              class="grow shrink basis-0 text-neutral-800 text-sm font-normal leading-snug"
            >
              付费信息
            </div>
          </div>
        </div>
      </div>
      <Pay ref="pay" @changeShowPay="changeShowPay" @changeShowProfile="changeShowProfile" v-if="selectType == 2"/>
      <Profile @changeShowProfile="changeShowProfile" @show="show" v-if="selectType == 1"/>
    </div>
  </n-modal>
</template>

<style lang="less">
#MemberModal,
#QRCodeModal {
  height: 600px;
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
#QRCodeModal {
  width: 300px;
  height: 300px;
  .n-card__content {
    position: relative;
    > .qr {
      width: 100%;
      height: 100%;
      object-fit: cover;
      position: absolute;
      z-index: 1;
    }
    > .wx {
      width: 60px;
      height: 60px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 2;
    }
  }
}
</style>
