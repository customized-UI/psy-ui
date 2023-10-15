<script lang="ts" setup>
import { NCard } from "naive-ui";
import { useCopilots } from "@/store";
import { useRouter } from "vue-router";
const useCop = useCopilots();
const router = useRouter();
</script>

<template>
  <div class="relative flex min-h-screen flex-col">
    <header class="sticky top-0 z-40 w-full border-b">
      <div class="container flex flex-col h-24">头部</div>
    </header>
    <div class="z-0 flex flex-1">
      <div class="flex w-screen flex-1">
        <div class="z-50 h-full w-full bg-accent/30 lg:py-4">
          <div class="w-full px-2 md:px-8 xl:px-16">
            <div class="container mx-auto">
              <div class="w-full space-y-6 mt-2">
                <div
                  class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3"
                >
                  <div
                    v-for="item in useCop.list"
                    :key="item.id"
                    @click="
                      router.push({
                        name: `ChatSub`,
                        params: { type: item.value, uuid: 1 },
                      })
                    "
                    class="cursor-pointer p-1 rounded-[10px] border border-border bg-background text-card-foreground shadow-md shadow-accent hover:shadow-xl hover:shadow-accent/95 dark:shadow-background dark:hover:shadow-md transition-all duration-300 dark:hover:border-foreground"
                  >
                    <n-card :title="item.title" :bordered="false">
                      {{ item.description }}
                    </n-card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
