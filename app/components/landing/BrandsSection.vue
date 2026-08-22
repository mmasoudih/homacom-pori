<script setup lang="ts">
import { brands } from '~/data/landing'
</script>

<template>
  <section class="mx-auto w-full max-w-[1350px]">
    <LandingSectionTitle title="محبوب‌ترین برندها" variant="row" />

    <div class="relative mt-[18px] overflow-hidden">
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
