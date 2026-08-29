<script setup lang="ts">
import { brands } from '~/data/landing'
</script>

<template>
  <section class="mx-auto w-full max-w-[1350px] px-4 pt-5 pb-24 md:px-0 md:py-6">
    <LandingSectionTitle title="محبوب‌ترین برندها" variant="row" />

    <!-- Mobile: horizontal scroll logo boxes -->
    <div class="mt-[18px] flex gap-2 overflow-x-auto pb-1 lg:hidden">
      <a
        v-for="brand in brands"
        :key="brand.name + brand.logo"
        href="#"
        class="flex h-[78px] w-[130px] shrink-0 items-center justify-center rounded-[20px] border border-[#e5e7eb] bg-white"
      >
        <img
          :src="brand.logo"
          :alt="brand.name"
          class="h-[49px] w-[65px] object-contain"
        >
      </a>
    </div>

    <!-- Desktop: cards -->
    <div class="relative mt-[18px] hidden overflow-hidden lg:block">
      <div class="flex gap-2">
        <a
          v-for="brand in brands"
          :key="brand.name + brand.logo"
          href="#"
          class="flex w-[166px] shrink-0 flex-col items-center justify-center gap-3 rounded-[20px] border border-[#e5e7eb] bg-white py-4 transition-shadow hover:shadow-md"
        >
          <img
            :src="brand.logo"
            :alt="brand.name"
            class="h-[49px] w-[65px] object-contain"
          >
          <span class="text-[14px] font-medium text-foreground">{{ brand.name }}</span>
        </a>
      </div>
    </div>
  </section>
</template>
