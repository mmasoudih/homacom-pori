<script setup lang="ts">
import { ref } from 'vue'
import { IconChevronLeft } from '@tabler/icons-vue'
import { homaAffProducts } from '~/data/landing'

const affRow = ref<HTMLElement | null>(null)

function scrollAff(step: number) {
  affRow.value?.scrollBy({ left: step, behavior: 'smooth' })
}
</script>

<template>
  <section class="relative isolate mx-auto w-full max-w-[1401px] overflow-hidden bg-R-300 before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-[url(/icons/texture.svg)] before:bg-repeat before:opacity-[0.05] before:content-[''] lg:rounded-3xl lg:px-[25px] lg:py-[25px]">
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
      <LandingSectionTitle title="هما آف" variant="row" light indicator="right" indicator-color="white" />
    </div>

    <!-- Mobile products row -->
    <div class="mt-4 flex overflow-x-auto px-4 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
      <Product
        v-for="(product, i) in homaAffProducts"
        :key="i"
        :product="product"
        variant="vertical"
        show-countdown
        countdown-label="هما آف"
        image-class="bg-T-50"
        :href="product.id ? `/product/${product.id}` : ''"
        class="w-[180px] shrink-0"
        :class="[
            i === 0 ? 'rounded-none rounded-tr-3xl rounded-br-3xl' : '',
            i === homaAffProducts.length - 1 ? 'rounded-none rounded-tl-3xl rounded-bl-3xl' : '',
            i > 0 && i < homaAffProducts.length - 1 ? 'rounded-none' : '',
        ]"
      />
    </div>

    <!-- Desktop products row -->
    <div class="relative hidden lg:block">
      <div
        ref="affRow"
        class="flex overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <Product
          v-for="(product, i) in homaAffProducts"
          :key="i"
          :product="product"
          variant="vertical"
          show-countdown
          countdown-label="هما آف"
          image-class="bg-T-50"
          discount-placement="inline"
          :href="product.id ? `/product/${product.id}` : ''"
          class="w-[270px] shrink-0"
          :class="[
            i === 0 ? 'rounded-none rounded-tr-3xl rounded-br-3xl' : '',
            i === homaAffProducts.length - 1 ? 'rounded-none rounded-tl-3xl rounded-bl-3xl' : '',
            i > 0 && i < homaAffProducts.length - 1 ? 'rounded-none' : '',
          ]"
        />
      </div>

      <!-- Arrows -->
      <button
        class="absolute -left-[19px] top-1/2 flex size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-T-50 text-foreground shadow-md transition-colors hover:bg-T-50/90"
        aria-label="قبلی"
        @click="scrollAff(-270)"
      >
        <IconChevronLeft class="size-[18px]" />
      </button>
      <button
        class="absolute -right-[19px] top-1/2 flex size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-T-50 text-foreground shadow-md transition-colors hover:bg-T-50/90"
        aria-label="بعدی"
        @click="scrollAff(270)"
      >
        <IconChevronLeft class="size-[18px] rotate-180" />
      </button>
    </div>
  </section>
</template>
