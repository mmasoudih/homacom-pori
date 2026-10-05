<template>
  <div class="flex flex-col items-center gap-4 px-4 pt-[210px] text-center">
    <img
      src="/icons/favorites-heart-off.svg"
      alt=""
      class="size-[50px] shrink-0"
      aria-hidden="true"
    >
    <div class="flex flex-col gap-2">
      <UiTypography as="h3" size="xl" weight="medium">لیست موردعلاقه‌های شما خالی است</UiTypography>
      <UiTypography as="p" size="md" weight="regular" color="subtle" class="max-w-[340px] leading-[22px]">
        از بین محصولات، کالاهای موردعلاقه خودتان را پیدا کنید و به لیست اضافه کنید
      </UiTypography>
    </div>
    <div class="mt-2 flex items-center justify-center gap-3">
      <NuxtLink
        to="/"
        class="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-[13px] font-bold text-white transition-colors hover:bg-primary/90"
      >
        <img src="/icons/favorites-tag.svg" alt="" class="size-[18px] shrink-0" aria-hidden="true">
        مشاهده محصولات
      </NuxtLink>
      <NuxtLink
        to="/"
        class="flex h-11 items-center justify-center gap-2 rounded-xl border border-T-300 bg-T-50 px-5 text-[13px] font-semibold text-T-800 transition-colors hover:border-T-500"
      >
        <img src="/icons/favorites-discount.svg" alt="" class="size-[18px] shrink-0" aria-hidden="true">
        مشاهده تخفیف‌ها
      </NuxtLink>
    </div>
  </div>
</template>
