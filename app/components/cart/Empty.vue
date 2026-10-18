<template>
  <div class="flex h-[506px] items-center justify-center rounded-[12px] border border-T-400 bg-T-50 px-6">
    <div class="flex w-[482px] max-w-full flex-col items-center gap-6">
      <img src="/icons/cart/empty-bag.svg" alt="" class="size-14">

      <div class="flex flex-col items-center gap-2 text-center">
        <UiTypography as="p" size="2xl" weight="medium">سبد خرید شما خالی است!</UiTypography>
        <UiTypography as="p" size="lg" color="muted" class="leading-5">
          هنوز کالایی به سبد خود اضافه نکرده‌اید. از تخفیف‌ها و محصولات هماکام دیدن کنید.
        </UiTypography>
      </div>

      <div class="flex items-center gap-3.5">
        <NuxtLink
          to="/search"
          class="flex h-[42px] w-[200px] items-center justify-center gap-1.5 rounded-[12px] border border-T-400 transition-colors hover:border-primary"
        >
          <img src="/icons/cart/tag.svg" alt="" class="h-[19.584px] w-[17.917px]">
          <UiTypography as="span" size="lg" weight="medium">مشاهده تخفیف‌ها</UiTypography>
        </NuxtLink>

        <NuxtLink
          to="/search"
          class="flex h-[42px] w-[198px] items-center justify-center gap-1.5 rounded-[12px] bg-R-300 transition-colors hover:bg-R-400"
        >
          <img src="/icons/cart/bag.svg" alt="" class="size-[17.917px]">
          <UiTypography as="span" size="lg" weight="bold" color="white">مشاهده محصولات</UiTypography>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
