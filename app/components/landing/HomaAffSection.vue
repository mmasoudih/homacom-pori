<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'
import { homaAffProducts } from '~/data/landing'
</script>

<template>
  <section class="mx-auto w-full max-w-[1401px] overflow-hidden bg-primary lg:rounded-3xl lg:px-[25px] lg:py-[25px]">
    <!-- Mobile title row -->
    <div class="flex items-center justify-between px-4 pt-[25px] lg:hidden">
      <a
        href="#"
        class="flex items-center gap-1 rounded-full border border-white/30 px-4"
        style="height: 32px"
      >
        <span class="text-[13px] font-semibold text-white">مشاهده همه</span>
        <IconChevronLeft class="size-[14px] text-white" />
      </a>
      <h2 class="text-[16px] font-bold leading-[23px] text-white">هما آف</h2>
      <span class="flex w-[61px] justify-end gap-[3px] text-white">
        <IconChevronLeft class="size-[10px]" />
        <IconChevronLeft class="size-[10px]" />
      </span>
    </div>

    <!-- Desktop title row -->
    <div class="mb-[21px] hidden lg:block">
      <LandingSectionTitle title="هما آف" variant="row" light />
    </div>

    <!-- Mobile products row -->
    <div class="mt-4 flex overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
      <Product
        v-for="(product, i) in homaAffProducts"
        :key="i"
        :product="product"
        variant="vertical"
        tone="inverted"
        show-countdown
        countdown-label="هما آف"
        image-class="bg-T-50"
        class="w-[180px] shrink-0"
      />
    </div>

    <!-- Desktop products row -->
    <div class="relative hidden lg:block">
      <div class="flex overflow-hidden">
        <div
          v-for="(product, i) in homaAffProducts"
          :key="i"
          class="w-[270px] shrink-0 px-[16px] py-[20px]"
          :class="i > 0 ? 'border-r border-white/20' : ''"
        >
          <Product
            :product="product"
            variant="vertical"
            tone="inverted"
            show-countdown
            countdown-label="هما آف"
            image-class="bg-T-50"
          />
        </div>
      </div>

      <!-- Arrows -->
      <button
        class="absolute -left-[19px] top-1/2 flex size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-T-50 text-foreground transition-colors hover:bg-T-50/90"
        aria-label="قبلی"
      >
        <IconChevronLeft class="size-[18px]" />
      </button>
      <button
        class="absolute -right-[19px] top-1/2 flex size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-T-50 text-foreground transition-colors hover:bg-T-50/90"
        aria-label="بعدی"
      >
        <IconChevronLeft class="size-[18px] rotate-180" />
      </button>
    </div>
  </section>
</template>
