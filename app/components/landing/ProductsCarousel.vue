<script setup lang="ts">
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-vue'
import type { Product } from '~/data/landing'
import ProductCard from './ProductCard.vue'

withDefaults(defineProps<{
  title: string
  products: Product[]
  showAllHref?: string
}>(), {
  showAllHref: '#',
})

const scrollRef = ref<HTMLElement>()

function scroll(direction: 1 | -1) {
  const el = scrollRef.value
  if (!el)
    return
  const amount = el.clientWidth * 0.9
  el.scrollBy({ left: direction * amount, behavior: 'smooth' })
}
</script>

<template>
  <section class="mx-auto w-full max-w-[1400px] px-5">
    <div class="rounded-3xl border border-border bg-card p-4 md:p-6">
      <!-- header -->
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="flex flex-col gap-0.5 leading-none">
            <span class="block h-1.5 w-1.5 rounded-full bg-primary" />
            <span class="block h-1.5 w-1.5 rounded-full bg-transparent" />
          </span>
          <h2 class="text-lg font-bold text-foreground md:text-xl">
            {{ title }}
          </h2>
          <span class="mr-1 flex flex-col gap-0.5 leading-none">
            <span class="block h-1.5 w-1.5 rounded-full bg-primary opacity-25" />
            <span class="block h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
        </div>
        <div class="flex items-center gap-3">
          <a :href="showAllHref" class="hidden text-sm font-bold text-primary hover:underline sm:block">
            مشاهده همه
          </a>
          <div class="flex items-center gap-2">
            <button
                              class="flex size-9 cursor-pointer items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
                              aria-label="بعدی"
                              @click="scroll(1)"
            >
              <IconChevronRight class="size-4" />
            </button>
            <button
                              class="flex size-9 cursor-pointer items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary"
                              aria-label="قبلی"
                              @click="scroll(-1)"
            >
              <IconChevronLeft class="size-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- carousel -->
      <div
        ref="scrollRef"
        class="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div
          v-for="product in products"
          :key="product.id"
          class="w-[220px] shrink-0 snap-start sm:w-[240px]"
        >
          <ProductCard :product="product" />
        </div>
      </div>
    </div>
  </section>
</template>
