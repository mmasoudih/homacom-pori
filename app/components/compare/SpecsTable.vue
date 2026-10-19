<script setup lang="ts">
import type { SearchProduct } from '~/data/search'
import type { CompareSpecGroup } from '~/data/compare'
import { specValue } from '~/data/compare'

const props = defineProps<{
  products: SearchProduct[]
  specGroups: CompareSpecGroup[]
}>()

function valueAt(index: number, key: string): string {
  const product = props.products[index]
  return product ? specValue(product, key) : ''
}
</script>

<template>
  <div class="-mx-4 flex flex-col gap-2 lg:mx-0 lg:gap-8 lg:rounded-[20px] lg:bg-T-50 lg:px-6 lg:py-8">
    <section v-for="group in specGroups" :key="group.title" class="flex flex-col gap-0.5 lg:gap-3">
      <!-- Section header -->
      <div
        class="flex h-[50px] items-center bg-[#FFF2F4] px-3 text-start text-[14px] font-semibold text-primary lg:rounded-lg"
      >
        {{ group.title }}
      </div>

      <!-- Rows (horizontally scrollable on mobile, one column per product) -->
      <div class="overflow-x-auto scrollbar-none lg:overflow-visible">
        <div class="flex flex-col">
          <div
            v-for="(row, ri) in group.rows"
            :key="row.key"
            class="flex w-full gap-0 lg:gap-4"
            :class="ri % 2 === 0 ? 'lg:bg-T-100' : ''"
          >
            <div
              v-for="(product, pi) in products"
              :key="product.id"
              class="flex h-[75px] w-[50vw] shrink-0 flex-col justify-center gap-2.5 rounded-lg px-3 py-3 text-start lg:w-[calc((100%-3rem)/4)]"
              :class="ri % 2 === 0 ? 'bg-T-100' : 'bg-transparent'"
            >
              <!-- The first product column carries the spec label (RTL start). -->
              <span
                v-if="pi === 0"
                class="line-clamp-1 h-5 text-[14px] font-medium leading-5 text-T-900"
              >{{ row.label }}</span>
              <span v-else class="h-5" aria-hidden="true" />

              <span class="line-clamp-1 text-[12.5px] leading-[18px] text-T-800">
                {{ valueAt(pi, row.key) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
