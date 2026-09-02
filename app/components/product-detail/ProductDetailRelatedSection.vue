<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'
import type { ProductDetail } from '~/data/product'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    title: string
    products: ProductDetail['related']
    class?: string
  }>(),
  { class: '' },
)
</script>

<template>
  <section :class="cn('flex w-full flex-col gap-4', props.class)">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="h-[18px] w-1 rounded-full bg-R-300" />
        <h2 class="text-[16px] font-bold text-T-900">{{ title }}</h2>
      </div>
      <button
        type="button"
        class="flex items-center gap-1 text-[12.5px] text-T-700 transition-colors hover:text-R-300"
      >
        مشاهده همه
        <IconChevronLeft class="size-4" />
      </button>
    </div>

    <div class="flex items-stretch gap-3 overflow-x-auto pb-1 lg:gap-4">
      <NuxtLink
        v-for="item in products"
        :key="item.id"
        :to="`/product/${item.id}`"
        class="w-[172px] shrink-0 lg:w-[238px]"
      >
        <Product :product="item" class="h-full" />
      </NuxtLink>
    </div>
  </section>
</template>
