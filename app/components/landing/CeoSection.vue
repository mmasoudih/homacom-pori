<script setup lang="ts">
import { ceoSection } from '~/data/landing'
</script>

<template>
  <section class="mx-auto w-full max-w-[1350px] px-[45px] py-8">
    <div class="flex flex-col gap-2">
      <h2 class="text-xl font-bold text-foreground">{{ ceoSection.title }}</h2>
      <p class="text-[14px] leading-[24px] text-T-700">
        {{ ceoSection.body }}
      </p>
      <a
        href="#"
        class="mt-1 text-left text-[14px] font-medium text-primary transition-colors hover:underline"
      >نمایش بیشتر</a>
    </div>
  </section>
</template>
