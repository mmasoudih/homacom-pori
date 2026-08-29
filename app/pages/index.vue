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

    <main class="flex flex-col items-center gap-10 px-4 py-10 pb-24 md:gap-12 md:px-0 xl:pb-10">
      <LandingHeroCarousel />

      <LandingCategoriesSection id="categories" />

      <LandingHomaAffSection />

      <LandingBannerRow :items="banners2" :columns="2" />

      <LandingProductsCarousel
        title="جدیدترین محصولات"
        :products="newestProducts"
      />

      <!-- Strip banner -->
      <a :href="stripBanner.href" class="mx-auto block w-full max-w-[1350px]">
        <img
          :src="stripBanner.image"
          :alt="stripBanner.alt"
          class="h-auto w-full rounded-2xl object-cover"
        >
      </a>

      <LandingBestOfCategorySection />

      <LandingBannerRow :items="banners4" :columns="4" />

      <LandingProductsCarousel
        title="پرفروش‌ترین محصولات"
        :products="bestsellerProducts"
        :pills="bestsellerFilters"
      />

      <LandingOffersSection id="offers" />

      <LandingBannerRow :items="banners3" :columns="3" centered />

      <LandingBrandsSection />

      <LandingBlogSection />

      <LandingCeoSection />
    </main>

    <LandingSiteFooter id="contact" class="mt-auto" />

    <LandingMobileBottomNav />
  </div>
</template>
