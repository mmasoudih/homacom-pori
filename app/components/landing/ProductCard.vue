<script setup lang="ts">
import type { Product } from '~/data/landing'

defineProps<{
  product: Product
}>()
</script>

<template>
  <article class="group relative flex w-[180px] shrink-0 flex-col pt-3 md:w-[260px] md:px-5 md:pt-4">
    <!-- Swatches -->
    <div
      v-if="product.colors?.length"
      class="absolute right-4 top-3 flex flex-col gap-[4px] md:left-0 md:right-auto md:top-4"
    >
      <span
        v-for="(color, ci) in product.colors"
        :key="ci"
        class="inline-block size-[10px] rounded-[3px] border border-[#c8ccd2] md:size-3"
        :style="{ backgroundColor: color }"
      />
    </div>

    <!-- Image -->
    <div class="mx-auto flex size-[140px] items-center justify-center rounded-[20px] md:size-[190px] md:rounded-none">
      <img
        :src="product.image"
        :alt="product.title"
        class="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
      >
    </div>

    <!-- Title -->
    <h3 class="line-clamp-2 mt-[14px] h-10 text-[14px] font-bold leading-[20px] text-foreground md:mt-[12px]">
      {{ product.title }}
    </h3>

    <!-- Price row -->
    <div class="mt-[14px] flex h-[42px] items-start justify-between md:mt-[8px]">
      <div class="flex flex-col">
        <span
          v-if="product.oldPrice"
          class="text-[14px] font-bold text-[#9ca3af] line-through"
        >{{ product.oldPrice }}</span>
        <div class="flex items-baseline gap-1">
          <span class="text-[16px] font-extrabold text-foreground">{{ product.price }}</span>
          <span class="text-[12px] text-[#9ca3af]">تومان</span>
        </div>
      </div>
      <span
        v-if="product.discount"
        class="flex h-[21px] w-[38px] items-center justify-center rounded-lg bg-[#fde9ec] text-[12px] font-extrabold text-primary md:h-[25px] md:w-auto md:rounded-2xl md:px-1 md:text-[13px]"
      >{{ product.discount }}</span>
    </div>
  </article>
</template>
