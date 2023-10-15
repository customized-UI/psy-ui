<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { fetchOrderId, checkPay, getNotify, finishPay } from "@/api";
import MEMBER_TYPE from "@/config/member";
import { useMessage, NDivider } from "naive-ui";
import { useUserStore } from "@/store";
import useFile from "@/assets/js/images_js";
import moment from "moment";

const emit = defineEmits(["changeShowPay", "changeShowProfile"]);
const message = useMessage();
const showQRCode = ref(false);
const showSelectPay = ref(true);
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo)
const orderId = ref("");
const payAmount = ref(MEMBER_TYPE[0]['amount']);
const payDescription = ref(MEMBER_TYPE[0]['description']);
const PaySelectType = ref(MEMBER_TYPE[0]['value']);
const PayDuration = ref(MEMBER_TYPE[0]['duration']);
const expiredTime = ref(userInfo.value.memberTime ? moment(userInfo.value.memberTime).add(MEMBER_TYPE[0]['duration'], 'days').format('YYYY-MM-DD HH:mm:ss') : moment(new Date).add(MEMBER_TYPE[0]['duration'], 'days').format('YYYY-MM-DD HH:mm:ss'))
let QRCode = ref("");
let intervalId: string | number | NodeJS.Timer | undefined;
//购买会员
const buy = async (amount: any, duration: number, description: string) => {
  let pay = await fetchOrderId({ amount, duration, description });
  emit("changeShowPay", false);
  showSelectPay.value = false;
  QRCode.value = await pay.data.qrcode;
  orderId.value = await pay.data.orderId;
  showQRCode.value = await true;

  //  intervalId = setInterval(async () => {
  //       // 调用查询支付结果的方法
  //   let result = await getNotify()
  //   if (result.data && result.data.event_type && result.data.event_type == 'TRANSACTION.SUCCESS') {
  //     message.success('您已完成支付')
  //     await finishPay({duration})
  //     clearInterval(intervalId)
  //   }
  // }, 3000);
};

const checkOrder = async (orderId: any, duration: any) => {
  // let textresult = await getNotify();
  let checkResult = await checkPay({ orderId, duration });
  if (checkResult.data.code == 200) {
    showQRCode.value = await false;
    showSelectPay.value = await true;
    await userStore.getUserInfo();
    message.success('恭喜您已成功付款!')
    emit("changeShowProfile", 1);
    emit("changeShowPay", true);
    return true;
  } else {
    return message.error("请确认您是否已经付款了");
  }
};

const backtoBuy = async () => {
  emit("changeShowPay", true);
  showSelectPay.value = true;
};

const selectPayType = async (item: any) => {
  // await clearInterval(intervalId);
  PaySelectType.value = await item.value;
  payAmount.value = item.amount;
  payDescription.value = item.description;
  PayDuration.value = item.duration
  expiredTime.value = userInfo.value.memberTime ? moment(userInfo.value.memberTime).add(item.duration, 'days').format('YYYY-MM-DD HH:mm:ss') : moment(new Date).add(item.duration, 'days').format('YYYY-MM-DD HH:mm:ss')
  // await buy(item.amount, item.duration, item.description);
};
</script>
<template>
  <!-- <div class="w-full h-full flex flex-row">
    <div
      class="inline-flex flex-col justify-start items-center mr-auto w-[350px] bg-[#fff] pt-[40px]  rounded-tl-[20px] rounded-bl-[20px]"
    >
      <img :src="useFile('/src/assets/images/final.png')" width="60" alt="" />
      <span
        class="font-semibold text-[20px] leading-6 text-black flex items-center justify-center"
      >
        Psy-ai会员
      </span>
    </div>
    <div class="inline-flex flex-col bg-[#fff] w-[650px] rounded-tr-[20px] rounded-br-[20px]">
      <div class="flex flex-col p-12 w-full overflow-auto min-w-full">
        <span class="flex items-center justify-start font-semibold text-xl text-black"
          >标准会员</span
        >
        <div class="w-full mt-8 inline-flex justify-between relative items-end">
          <div class="w-full flex items-stretch flex-wrap justify-between px-2">
            <div
              class="inline-flex items-start flex-col p-4 border rounded-lg relative cursor-pointer w-[170px]"
              :class="PaySelectType === item.value ? 'border-neutral-800' : 'border-opacity-300'"
              v-for="item in MEMBER_TYPE"
              :key="item.value"
              @click="selectPayType(item)"
            >
              <div class="flex items-center justify-start flex-wrap">
                {{ item.durationText }}
              </div>
              <div class="flex items-center justify-start flex-wrap font-semibold">
                {{ item.amountText }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <n-divider />
      <div class="inline-flex  px-12 " v-if="PaySelectType">
        <div class="font-semibold text-xl leading-xl text-black whitespace-nowrap">支付</div>
        <div class="ml-10 flex-shrink-0 w-48 h-48 p-2 border border-gray-300 rounded-lg overflow-hidden relative">
          <img :src="QRCode" class="qr" style="width: 100%;"/>
        </div>
        <div class="ml-8 inline-flex flex-col items-start justify-center">
          <div class="mt-4 inline-flex items-end flex-wrap">
            <div class="whitespace-nowrap text-sm leading-8 text-black">支付金额</div>
            <div class="mx-4 font-bold text-2xl leading-10 text-black">{{ payAmount }}</div>
          </div>
        <div class="mt-28 inline-flex items-center justify-start whitespace-nowrap flex-wrap">
          <span>扫码支付:微信支付</span>
        </div>
        </div>
      </div>
    </div>
  </div> -->
  <div
    v-if="showSelectPay"
    class="grow shrink basis-0 self-stretch p-6 bg-white rounded-[20px] justify-start items-start gap-6 flex flex-col"
  >
    <div class="text-black text-sm font-medium leading-tight">会员权益</div>
    <div
      class="w-[482px] h-[164px] p-4 bg-slate-100 rounded-md flex-col justify-center items-start gap-2 inline-flex"
    >
      <div class="justify-start items-center gap-2 inline-flex">
        <div class="w-3.5 h-3.5 relative">
          <img :src="useFile('/src/assets/images/d1.svg')" />
        </div>
        <div class="text-neutral-800 text-[12px] font-normal leading-tight">
          无限制与心理学巨头聊天
        </div>
      </div>
      <div class="justify-start items-center gap-2 inline-flex">
        <div class="w-3.5 h-3.5 relative">
          <img :src="useFile('/src/assets/images/d2.svg')" />
        </div>
        <div class="text-neutral-800 text-[12px] font-normal leading-tight">
          无限制生成内容
        </div>
      </div>
      <div class="justify-start items-center gap-2 inline-flex">
        <div class="w-3.5 h-3.5 relative">
          <img :src="useFile('/src/assets/images/d3.svg')" />
        </div>
        <div class="text-neutral-800 text-[12px] font-normal leading-tight">历史记录</div>
      </div>
      <div class="justify-start items-center gap-2 inline-flex">
        <div class="w-3.5 h-3.5 relative">
          <img :src="useFile('/src/assets/images/d4.svg')" />
        </div>
        <div class="text-neutral-800 text-[12px] font-normal leading-tight">
          每次生成最多 6,000 个单词
        </div>
      </div>
      <div class="justify-start items-center gap-2 inline-flex">
        <div class="w-3.5 h-3.5 relative">
          <img :src="useFile('/src/assets/images/d5.svg')" />
        </div>
        <div class="text-neutral-800 text-[12px] font-normal leading-tight">
          专属客户服务
        </div>
      </div>
    </div>
    <div class="text-black text-[14px] font-bold leading-tight">
      会员：有效期至{{ expiredTime }}
    </div>
    <div class="text-black text-[14px] font-bold leading-tight">
      请选择套餐
    </div>
    <div class="flex flex-row">
      <div
        v-for="item in MEMBER_TYPE"
        :key="item.value"
        @click="selectPayType(item)"
        :class="PaySelectType === item.value ? 'border-2 border-black' : 'border-2 border-opacity-10'"
        class="w-[150px] h-[94px] p-4 rounded-lg border border-neutral-800 mr-[10px] flex-col justify-center items-start gap-2 inline-flex cursor-pointer"
      >
        <div class="flex-col justify-center items-start gap-2 flex">
          <div class="text-neutral-800 text-sm font-medium">
            {{ item.durationText }}
          </div>
          <div>
            <span class="text-neutral-800 text-2xl font-medium">&yen;{{ item.amountText }}</span>
            <span class="text-neutral-800 text-sm font-medium line-through" v-if="item.oldAmountText">&yen;{{ item.oldAmountText }}</span>
          </div>
        </div>
      </div>
    </div>
    <div @click="buy(payAmount, PayDuration, payDescription)" class="w-[74px] h-9 py-1.5 cursor-pointer bg-neutral-800 rounded-md border border-neutral-800 border-opacity-10 justify-center items-center gap-2 inline-flex">
      <div class="text-white text-sm font-medium leading-normal">下一步</div>
    </div>
    <!-- <div
      v-for="item in MEMBER_TYPE"
      :key="item.value"
      @click="selectPayType(item.value)"
      :class="PaySelectType === item.value ? 'border-neutral-800' : 'border-opacity-10'"
      class="w-[286px] h-[550px] cursor-pointer p-6 rounded-xl border  flex-col justify-start items-start gap-6 inline-flex"
    >
      <div
        class="self-stretch grow shrink basis-0 flex-col justify-between items-start gap-6 flex"
      >
        <div class="self-stretch h-[374px] flex-col justify-start items-start gap-6 flex">
          <div class="justify-center items-center gap-2.5 inline-flex">
            <div class="text-neutral-800 text-lg font-medium leading-normal">{{ item.durationText }}</div>
          </div>
          <div class="justify-center items-center gap-2.5 inline-flex">
            <div>
            <span style="text-zinc-600 text-lg font-normal leading-normal">{{ item.amountText }}</span>
            </div>
          </div>
          
          <div
          @click="buy(item.amount, item.duration, item.description)"
            class="self-stretch px-4 py-1.5 bg-neutral-800 rounded-md border border-neutral-800 border-opacity-10 justify-center items-center gap-2 inline-flex"
          >
            <div class="text-white text-sm font-normal leading-normal">购买</div>
          </div>
          <div
            class="self-stretch h-[218px] flex-col justify-start items-start gap-2.5 flex"
          >
            <div class="text-neutral-800 text-sm font-normal leading-normal">
              包括特性：
            </div>
            <div
              class="self-stretch h-[184px] flex-col justify-start items-start gap-2 flex"
            >
              <div v-for="(sub, index) in item.character" :key="index" class="self-stretch justify-between items-center gap-2.5 inline-flex">
                <div class="text-zinc-600 text-sm font-normal leading-normal">
                  包括特性：{{ sub.value }}
                </div>
                <div class="justify-start items-start gap-2.5 flex">
                  <div class="w-4 h-4 relative">
                    <img
                      class="w-[15.33px] h-[15.33px] left-[0.33px] top-[0.33px] absolute"
                      :src="!sub.include ? check : ischeck"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
  <div
    v-if="!showSelectPay"
    class="grow shrink basis-0 self-stretch bg-white rounded-[20px] flex-col justify-start items-start inline-flex"
  >
    <div
      class="self-stretch h-[52px] pt-3.5 bg-neutral-100 flex-col justify-start items-start gap-3.5 flex"
      style="border-radius: 20px 20px 0 0"
    >
      <div
        class="pl-8 justify-start items-center gap-1 inline-flex cursor-pointer"
        @click="backtoBuy()"
      >
        <div class="w-4 h-4 justify-center items-center flex">
          <div class="w-4 h-4 relative">
            <img :src="useFile('/src/assets/images/left.svg')" alt="" />
          </div>
        </div>
        <div class="text-neutral-800 text-sm font-normal leading-normal">付款信息</div>
      </div>
      <div class="self-stretch h-[0px] border border-neutral-800 border-opacity-10"></div>
    </div>
    <div
      class="self-stretch grow shrink basis-0 p-8 flex-col justify-start items-start gap-6 flex"
    >
      <div class="flex-col justify-start items-start gap-4 flex">
        <div class="justify-start items-start gap-6 inline-flex">
          <div class="w-[50px] text-neutral-800 text-sm font-normal leading-normal">
            订单号
          </div>
          <div class="text-neutral-800 text-sm font-normal leading-normal">
            {{ orderId }}
          </div>
        </div>
        <div class="justify-start items-start gap-6 inline-flex">
          <div class="w-[50px] text-neutral-800 text-sm font-normal leading-normal">
            产品名
          </div>
          <div class="text-neutral-800 text-sm font-normal leading-normal">
            {{ payDescription }}
          </div>
        </div>
        <div class="justify-start items-start gap-6 inline-flex">
          <div class="w-[50px] text-neutral-800 text-sm font-normal leading-normal">
            价格
          </div>
          <div class="text-neutral-800 text-sm font-normal leading-normal">
            {{ payAmount }}CNY
          </div>
        </div>
      </div>
      <div class="flex-col justify-start items-start gap-2.5 flex">
        <div class="text-neutral-800 text-sm font-medium leading-normal">微信支付码</div>
        <div class="w-[200px] h-[200px] bg-zinc-300">
          <img :src="QRCode" class="qr" style="width: 100%" />
        </div>
      </div>
      <div class="justify-start items-start gap-6 inline-flex">
        <div
          @click="checkOrder(orderId, PayDuration)"
          class="px-4 py-1.5 bg-neutral-800 rounded-md border border-neutral-800 border-opacity-10 justify-center items-center gap-2 flex cursor-pointer"
        >
          <div class="text-white text-sm font-medium leading-normal">已成功支付</div>
        </div>
        <div
          @click="backtoBuy()"
          class="px-4 py-1.5 bg-neutral-800 rounded-md border border-neutral-800 border-opacity-10 justify-center items-center gap-2 flex cursor-pointer"
        >
          <div class="text-white text-sm font-medium leading-normal">取消支付</div>
        </div>
      </div>
    </div>
  </div>
</template>
