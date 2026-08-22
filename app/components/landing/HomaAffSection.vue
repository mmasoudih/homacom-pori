<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'
import { homaAffProducts } from '~/data/landing'
</script>

<template>
  <section class="mx-auto w-full max-w-[1401px] overflow-hidden rounded-3xl bg-primary px-[25px] py-[25px]">
    <!-- Title row -->
    <div class="mb-[21px] flex items-center justify-between">
      <LandingSectionTitle title="هما آف" variant="row" light />
    </div>

    <!-- Products row -->
    <div class="relative">
      <div class="flex overflow-hidden">
        <article
          v-for="(product, i) in homaAffProducts"
          :key="i"
          class="flex w-[270px] shrink-0 flex-col items-center gap-4 px-[16px] py-[20px]"
          :class="i > 0 ? 'border-r border-white/20' : ''"
        >
          <!-- Swatches -->
          <div
            v-if="product.colors?.length"
            class="absolute right-[14px] top-[14px] flex flex-col gap-1"
          >
            <span
              v-for="(color, ci) in product.colors"
              :key="ci"
              class="inline-block size-3 rounded-[3px] border border-white/40"
              :style="{ backgroundColor: color }"
            />
          </div>

          <!-- Image -->
          <div class="relative flex h-[190px] w-[190px] items-center justify-center">
            <img
              :src="product.image"
              :alt="product.title"
              class="max-h-full max-w-full object-contain"
            >
          </div>

          <!-- Title -->
          <h3 class="line-clamp-2 h-10 w-[230px] text-center text-[14px] font-bold leading-[20px] text-white">
            {{ product.title }}
          </h3>

          <!-- Price -->
          <div class="flex w-[230px] items-start justify-between">
            <div class="flex flex-col gap-0.5">
              <span
                v-if="product.oldPrice"
                class="text-[14px] font-bold text-white/50 line-through"
              >{{ product.oldPrice }}</span>
              <div class="flex items-baseline gap-1">
                <span class="text-[16px] font-extrabold text-white">{{ product.price }}</span>
                <span class="text-[12px] text-white/70">تومان</span>
              </div>
            </div>
            <span
              v-if="product.discount"
              class="flex size-[42px] items-center justify-center rounded-[10px] bg-[#fde9ec] text-[13px] font-extrabold text-primary"
            >{{ product.discount }}</span>
          </div>

          <!-- Countdown -->
          <div class="flex h-6 w-[224px] items-center justify-between rounded-lg bg-[#fde9ec] px-3 py-0.5">
            <span class="text-[14px] font-bold text-primary" dir="ltr">{{ product.countdown }}</span>
            <span class="text-[11px] font-bold text-primary">هما آف</span>
          </div>
        </article>
      </div>

      <!-- Arrows -->
      <button
        class="absolute -left-[19px] top-1/2 flex size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white text-foreground transition-colors hover:bg-white/90"
        aria-label="قبلی"
      >
        <IconChevronLeft class="size-[18px]" />
      </button>
      <button
        class="absolute -right-[19px] top-1/2 flex size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white text-foreground transition-colors hover:bg-white/90"
        aria-label="بعدی"
      >
        <IconChevronLeft class="size-[18px] rotate-180" />
      </button>
    </div>
  </section>
</template>
