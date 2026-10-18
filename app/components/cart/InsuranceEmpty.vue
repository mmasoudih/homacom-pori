<template>
  <!-- No insurance picked for this line yet. -->
  <div class="flex items-center gap-2 rounded-[8px] border border-dashed border-[#F2DDB4] bg-[#FFFCF7] p-2.5 lg:gap-5">
    <div
      class="hidden size-[39px] shrink-0 items-center justify-center rounded-[10px] border border-[#F2DDB4] bg-[#FFF6E9] lg:flex"
    >
      <img src="/icons/cart/insurance-empty-glyph.svg" alt="" class="size-[17px]">
    </div>

    <div class="flex min-w-0 flex-1 flex-col gap-1">
      <UiTypography as="span" size="mdLg" weight="medium">
        برای این کالا هنوز بیمه‌ای انتخاب نکرده‌اید!
      </UiTypography>
      <UiTypography as="span" size="xsMd" color="muted" class="leading-5">
        جهت ثبت و فعال‌سازی پوشش بیمه برای این محصول می‌توانید دکمه «افزودن بیمه» را انتخاب کنید.
      </UiTypography>
    </div>
  </div>
</template>
