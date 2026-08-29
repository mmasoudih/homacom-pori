<script setup lang="ts">
import {
  newestProducts,
  bestsellerProducts,
  banners2,
  banners4,
  banners3,
  stripBanner,
  bestsellerFilters,
} from '~/data/landing'

useHead({
  title: 'فروشگاه اینترنتی هماکام | خرید آنلاین لوازم دیجیتال',
})
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-background">
    <LandingSiteHeader />

    <!--
      Mobile section order follows the Figma "Landing Mobile" frame:
      categories → هما آف → strip → جدیدترین → بهترینها → banner(2) → پرفروش → پیشنهادها → وبلاگ → برندها.
      Desktop keeps DOM order via lg:order-none.
    -->
    <main class="flex flex-col items-center">
      <LandingHeroCarousel class=" pb-5 md:pb-6" />

      <LandingCategoriesSection id="categories" class="order-1 w-full lg:order-none" />

      <LandingHomaAffSection class="order-2 py-5 lg:order-none lg:py-6" />

      <LandingBannerRow :items="banners2" :columns="2" class="order-6 w-full lg:order-none" />

      <LandingProductsCarousel
        title="جدیدترین محصولات"
        :products="newestProducts"
        class="order-4 w-full lg:order-none"
      />

      <!-- Strip banner -->
      <a
        :href="stripBanner.href"
        class="order-3 block w-full max-w-[1350px] py-5 lg:order-none lg:mx-auto lg:py-6"
      >
        <img
          :src="stripBanner.image"
          :alt="stripBanner.alt"
          class="h-auto w-full rounded-none object-cover lg:rounded-2xl"
        >
      </a>

      <LandingBestOfCategorySection class="order-5 w-full lg:order-none" />

      <LandingBannerRow
        :items="banners4"
        :columns="4"
        class="order-7 hidden w-full lg:order-none lg:block"
      />

      <LandingProductsCarousel
        title="پرفروش‌ترین محصولات"
        :products="bestsellerProducts"
        :pills="bestsellerFilters"
        class="order-7 w-full lg:order-none"
      />

      <LandingOffersSection id="offers" class="order-8 w-full lg:order-none" />

      <LandingBannerRow :items="banners3" :columns="3" centered class="order-7 hidden w-full lg:order-none lg:block" />

      <LandingBrandsSection class="order-10 w-full lg:order-none" />

      <LandingBlogSection class="order-9 w-full lg:order-none" />

      <LandingCeoSection class="hidden lg:block" />
    </main>

    <LandingSiteFooter id="contact" class="mt-auto" />

    <LandingMobileBottomNav />
  </div>
</template>
