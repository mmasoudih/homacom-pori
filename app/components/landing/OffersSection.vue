<script setup lang="ts">
import { products } from '~/data/landing'
import ProductCard from './ProductCard.vue'
import SectionTitle from './SectionTitle.vue'

const tabs = [
  { id: 'all', label: 'همه' },
  { id: 'gt200', label: 'بیشتر از ۲۰۰ میلیون' },
  { id: 'lte200', label: 'تا ۲۰۰ میلیون' },
  { id: 'lte100', label: 'تا ۱۰۰ میلیون' },
] as const

type TabId = typeof tabs[number]['id']

const active = ref<TabId>('all')

const filtered = computed(() => {
  switch (active.value) {
    case 'gt200':
      return products.filter(p => p.price > 200_000_000)
    case 'lte200':
      return products.filter(p => p.price <= 200_000_000 && p.price > 100_000_000)
    case 'lte100':
      return products.filter(p => p.price <= 100_000_000)
    default:
      return products
  }
})

const showAll = ref(false)
</script>

<template>
  <section class="mx-auto w-full max-w-[1400px] px-5">
    <div class="rounded-3xl border border-border bg-card p-4 md:p-6">
      <div class="mb-6 flex flex-col items-center gap-5">
        <SectionTitle title="پیشنهادهای هماکام" />
        <div class="flex flex-wrap items-center justify-center gap-2">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="[
              'cursor-pointer rounded-xl px-4 py-2 text-sm font-medium transition-colors',
              active === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-secondary',
            ]"
            @click="active = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <div v-if="filtered.length" class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <ProductCard
          v-for="product in (showAll ? filtered : filtered.slice(0, 8))"
          :key="product.id"
          :product="product"
        />
      </div>
      <p v-else class="py-16 text-center text-sm text-muted-foreground">
        محصولی در این بازه قیمت پیدا نشد.
      </p>

      <div v-if="filtered.length > 8" class="mt-8 text-center">
        <button
          class="cursor-pointer rounded-xl border border-primary/30 px-8 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          @click="showAll = !showAll"
        >
          {{ showAll ? 'نمایش کمتر' : 'نمایش بیشتر' }}
        </button>
      </div>
    </div>
  </section>
</template>
