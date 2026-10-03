<script setup lang="ts">
defineProps<{
  query: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 py-14 text-center">
    <img src="/icons/search-off.svg" alt="" class="size-14">
    <UiTypography as="p" size="lg" weight="medium" color="default">
      نتیجه‌ای یافت نشد!
    </UiTypography>
    <UiTypography as="p" size="lg" weight="medium" color="subtle">
      متأسفانه محصولی با عنوان <span class="text-T-900">«{{ query }}»</span> پیدا نشد.
    </UiTypography>
  </div>
</template>
