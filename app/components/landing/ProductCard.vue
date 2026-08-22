<script setup lang="ts">
import { IconStarFilled, IconShoppingCart } from '@tabler/icons-vue'
import type { Product } from '~/data/landing'
import { formatPrice } from '~/utils/format'

withDefaults(defineProps<{
  product: Product
  horizontal?: boolean
}>(), {
  horizontal: false,
})
</script>

<template>
  <article
    class="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-primary/15 bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
  >
    <a href="#" class="flex flex-1 flex-col">
      <div class="relative mb-4 flex items-center justify-center">
        <img
          :src="product.image"
          :alt="product.title"
          loading="lazy"
          class="size-44 object-contain transition-transform duration-500 group-hover:scale-105"
        >
        <span
          v-if="product.discount"
          class="absolute right-0 top-0 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-white"
        >
          ٪{{ product.discount }}
        </span>
      </div>
      <h3 class="mb-4 line-clamp-2 flex-1 text-sm leading-6 text-foreground">
        {{ product.title }}
      </h3>
    </a>

    <div class="mt-auto flex flex-col gap-3 border-t border-dashed border-border pt-3">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-1.5 text-amber-400">
          <IconStarFilled class="size-4" />
          <span class="text-sm font-bold text-foreground">{{ product.rating }}</span>
        </div>
        <div class="flex flex-col items-end gap-0.5">
          <span v-if="product.oldPrice" class="text-xs text-destructive line-through">
            {{ formatPrice(product.oldPrice) }}
          </span>
          <span class="flex items-baseline gap-1">
            <span class="text-base font-extrabold text-foreground">
              {{ formatPrice(product.price) }}
            </span>
            <span class="text-xs text-muted-foreground">تومان</span>
          </span>
        </div>
      </div>
      <button
        type="button"
        class="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
      >
        <IconShoppingCart class="size-4" />
        افزودن به سبد
      </button>
    </div>
  </article>
</template>
