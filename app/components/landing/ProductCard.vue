<script setup lang="ts">
import type { Product } from '~/data/landing'

defineProps<{
  product: Product
}>()
</script>

<template>
  <article class="group relative flex w-[260px] shrink-0 flex-col px-5 pt-4 pb-0">
    <!-- Swatches -->
    <div
      v-if="product.colors?.length"
      class="absolute left-0 top-4 flex flex-col gap-[4px]"
    >
      <span
        v-for="(color, ci) in product.colors"
        :key="ci"
        class="inline-block size-3 rounded-[3px] border border-[#c8ccd2]"
        :style="{ backgroundColor: color }"
      />
    </div>

    <!-- Image -->
    <div class="mx-auto flex h-[190px] w-[190px] items-center justify-center">
      <img
        :src="product.image"
        :alt="product.title"
        class="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
      >
    </div>

    <!-- Title -->
    <h3 class="line-clamp-2 mt-[12px] h-10 text-[14px] font-bold leading-[20px] text-foreground">
      {{ product.title }}
    </h3>

    <!-- Price row -->
    <div class="mt-[8px] flex h-[42px] items-start justify-between">
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
        class="flex h-[25px] items-center justify-center rounded-2xl bg-[#fde9ec] px-1 text-[13px] font-extrabold text-primary"
      >{{ product.discount }}</span>
    </div>
  </article>
</template>
