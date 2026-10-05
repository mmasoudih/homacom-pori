<template>
  <div class="flex items-center justify-between gap-4">
    <UiTypography as="h1" size="2xl" weight="semibold">لیست آدرس‌ها</UiTypography>

    <button
      type="button"
      class="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-T-400 bg-T-50 px-4 transition-colors hover:border-T-500"
    >
      <img src="/icons/address-plus-dark.svg" alt="" class="size-[18px] shrink-0" aria-hidden="true">
      <UiTypography as="span" size="md" weight="medium" color="default">افزودن آدرس جدید</UiTypography>
    </button>
  </div>
</template>
