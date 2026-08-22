<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'
import { offersGridRows, offersMeta } from '~/data/landing'
</script>

<template>
  <section class="mx-auto w-full max-w-[1302px]">
    <LandingSectionTitle title="پیشنهاد‌های هماکام" variant="centered" />

    <div class="relative mt-[18px]">
      <div class="grid gap-[18px]" style="grid-template-columns: repeat(6, 202px)">
        <template v-for="(row, ri) in offersGridRows" :key="ri">
          <article
            v-for="(cell, ci) in row"
            :key="`${ri}-${ci}`"
            class="flex h-[252px] w-full flex-col items-center justify-center gap-2 rounded-[20px] border border-[#e5e7eb] bg-white p-4 transition-shadow hover:shadow-md"
          >
            <!-- Image -->
            <div class="flex h-[120px] w-full items-center justify-center">
              <img
                :src="cell.image"
                alt=""
                class="max-h-full max-w-full object-contain"
              >
            </div>

            <!-- Price -->
            <div class="flex w-full items-center justify-between">
              <div class="flex flex-col">
                <span
                  v-if="offersMeta[ri * 6 + ci]?.hasOld"
                  class="text-[13px] font-bold text-[#9ca3af] line-through"
                >87,000,000</span>
                <div class="flex items-baseline gap-1">
                  <span class="text-[14px] font-extrabold text-foreground">87,000,000</span>
                  <span class="text-[11px] text-[#9ca3af]">تومان</span>
                </div>
              </div>
              <span
                v-if="offersMeta[ri * 6 + ci]?.hasOld"
                class="flex h-[22px] items-center justify-center rounded-lg bg-[#fde9ec] px-1 text-[11px] font-extrabold text-primary"
              >%30</span>
            </div>
          </article>
        </template>
      </div>

      <!-- Arrow -->
      <button
        class="absolute -left-[19px] top-1/2 flex size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-foreground transition-colors hover:bg-secondary"
        aria-label="قبلی"
      >
        <IconChevronLeft class="size-[18px]" />
      </button>
    </div>
  </section>
</template>
