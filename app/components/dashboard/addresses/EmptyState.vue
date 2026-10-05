<template>
  <div class="flex min-h-[640px] flex-col items-center justify-center gap-4 px-4 py-20 text-center">
    <img src="/icons/address-pin-off.svg" alt="" class="size-[50px] shrink-0" aria-hidden="true">

    <div class="flex flex-col gap-2">
      <UiTypography as="h3" size="xl" weight="medium">لیست آدرس‌ها خالی است</UiTypography>
      <UiTypography as="p" size="md" weight="regular" color="subtle" class="max-w-[420px] leading-[22px]">
        آدرس‌های تحویل خود را مدیریت کنید؛ هنگام ثبت سفارش، یکی را انتخاب کنید
      </UiTypography>
    </div>

    <button
      type="button"
      class="mt-2 flex h-11 items-center justify-center gap-2 rounded-xl border border-primary bg-T-50 px-6 text-primary transition-colors hover:bg-R-50"
    >
      <img src="/icons/address-plus.svg" alt="" class="size-[18px] shrink-0" aria-hidden="true">
      <UiTypography as="span" size="md" weight="bold" color="inherit">افزودن آدرس جدید</UiTypography>
    </button>
  </div>
</template>
