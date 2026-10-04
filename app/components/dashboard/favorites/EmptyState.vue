<template>
  <div class="flex min-h-[640px] flex-col items-center justify-center gap-4 px-4 py-20 text-center">
    <img
      src="/icons/favorites-heart-off.svg"
      alt=""
      class="size-[50px] shrink-0"
      aria-hidden="true"
    >

    <div class="flex flex-col gap-2">
      <UiTypography as="h3" size="xl" weight="medium">لیست موردعلاقه‌های شما خالی است</UiTypography>
      <UiTypography as="p" size="md" weight="regular" color="subtle" class="max-w-[420px] leading-[22px]">
        از بین محصولات، کالاهای موردعلاقه خودتان را پیدا کنید و به لیست اضافه کنید
      </UiTypography>
    </div>

    <div class="mt-2 flex flex-wrap items-center justify-center gap-3">
      <NuxtLink
        to="/"
        class="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-white transition-colors hover:bg-primary/90"
      >
        <img src="/icons/favorites-tag.svg" alt="" class="size-[18px] shrink-0" aria-hidden="true">
        <UiTypography as="span" size="md" weight="bold" color="inherit">مشاهده محصولات</UiTypography>
      </NuxtLink>
      <NuxtLink
        to="/"
        class="flex h-11 items-center justify-center gap-2 rounded-xl border border-T-400 bg-T-50 px-6 text-T-800 transition-colors hover:border-T-500"
      >
        <img src="/icons/favorites-discount.svg" alt="" class="size-[18px] shrink-0" aria-hidden="true">
        <UiTypography as="span" size="md" weight="bold" color="inherit">مشاهده تخفیف‌ها</UiTypography>
      </NuxtLink>
    </div>
  </div>
</template>
