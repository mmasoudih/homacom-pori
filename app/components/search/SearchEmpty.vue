<script setup lang="ts">
defineProps<{
  query: string
  /** True when `query` is a category name rather than a text search. */
  categoryListing?: boolean
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 py-14 text-center">
    <img src="/icons/search-off.svg" alt="" class="size-14">
    <UiTypography as="p" size="lg" weight="medium" color="default">
      نتیجه‌ای یافت نشد!
    </UiTypography>
    <UiTypography as="p" size="lg" weight="medium" color="subtle">
      <template v-if="categoryListing">
        متأسفانه در دسته <span class="text-T-900">«{{ query }}»</span> هنوز محصولی ثبت نشده است.
      </template>
      <template v-else>
        متأسفانه محصولی با عنوان <span class="text-T-900">«{{ query }}»</span> پیدا نشد.
      </template>
    </UiTypography>
  </div>
</template>
