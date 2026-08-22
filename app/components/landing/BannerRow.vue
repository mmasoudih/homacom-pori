<script setup lang="ts">
import { bannerImages } from '~/data/landing'
</script>

<template>
  <section class="mx-auto max-w-[1400px] px-5">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <a href="#" class="group relative block aspect-[1350/300] overflow-hidden rounded-3xl md:aspect-[666/200]">
        <img
          :src="bannerImages.bannerOne"
          alt="بنر هماکام"
          loading="lazy"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        >
      </a>
      <a href="#" class="group relative block aspect-[1350/300] overflow-hidden rounded-3xl md:aspect-[666/200]">
        <img
          :src="bannerImages.bannerTwo"
          alt="بنر هماکام"
          loading="lazy"
          class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        >
      </a>
    </div>
  </section>
</template>
