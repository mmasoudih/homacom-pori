<script setup lang="ts">
import { COMPARE_MAX, compareSpecGroups } from '~/data/compare'

const { items, remove } = useCompare()

const dialogOpen = ref(false)

const columnCount = COMPARE_MAX

useHead({
  title: 'مقایسه محصولات | هماکام',
})
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-background">
    <LandingSiteHeader />

    <main class="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 pb-28 pt-6 lg:px-6 lg:pb-16 lg:pt-10">
      <h1 class="text-end text-[18px] font-bold text-T-900 lg:text-[20px]">
        مقایسه محصولات
      </h1>

      <!-- Product slots -->
      <div class="-mx-4 mt-5 overflow-hidden rounded-[20px] border border-T-400 bg-T-50 lg:mx-0">
        <div class="overflow-x-auto">
          <div class="grid w-max grid-cols-[repeat(4,50vw)] gap-px bg-T-300 lg:w-full lg:grid-cols-[repeat(4,minmax(0,1fr))]">
            <template v-for="i in columnCount" :key="i">
              <CompareProductSlot
                v-if="items[i - 1]"
                :product="items[i - 1]!"
                @remove="remove"
              />
              <CompareAddSlot
                v-else-if="i - 1 === items.length"
                @add="dialogOpen = true"
              />
              <div v-else class="bg-T-50" />
            </template>
          </div>
        </div>
      </div>

      <!-- Specs comparison -->
      <CompareSpecsTable
        v-if="items.length"
        class="mt-6"
        :products="items"
        :column-count="columnCount"
        :spec-groups="compareSpecGroups"
      />

      <!-- Marketing band -->
      <CompareSeoBand class="mt-6" />
    </main>

    <LandingSiteFooter />
    <LandingMobileBottomNav />

    <CompareAddProductDialog v-model:open="dialogOpen" />
  </div>
</template>
