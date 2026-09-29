<script setup lang="ts">
import type { SearchProduct } from '~/data/search'
import type { CompareSpecGroup } from '~/data/compare'
import { specValue } from '~/data/compare'

const props = defineProps<{
  products: SearchProduct[]
  columnCount: number
  specGroups: CompareSpecGroup[]
}>()

function valueAt(index: number, key: string): string {
  const product = props.products[index]
  return product ? specValue(product, key) : ''
}
</script>

<template>
  <div class="overflow-hidden rounded-[20px] border border-T-400 bg-T-50">
    <div class="overflow-x-auto">
      <div class="min-w-max lg:min-w-0">
        <template v-for="group in specGroups" :key="group.title">
          <!-- Section header -->
          <div class="bg-R-10 px-4 py-3.5 text-end text-[14px] font-bold text-R-300 lg:text-[15px]">
            {{ group.title }}
          </div>

          <!-- Rows -->
          <div
            v-for="(row, ri) in group.rows"
            :key="row.key"
            class="grid grid-cols-[108px_repeat(4,145px)] lg:grid-cols-[180px_repeat(4,minmax(0,1fr))]"
            :class="ri % 2 === 0 ? 'bg-T-50' : 'bg-T-100'"
          >
            <div
              class="sticky start-0 z-10 px-4 py-5 text-end text-[12.5px] font-bold text-T-900 lg:text-[13px]"
              :class="ri % 2 === 0 ? 'bg-T-50' : 'bg-T-100'"
            >
              {{ row.label }}
            </div>

            <div
              v-for="i in columnCount"
              :key="i"
              class="px-3 py-5 text-center text-[12.5px] text-T-700 lg:text-[13px]"
            >
              {{ valueAt(i - 1, row.key) }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
