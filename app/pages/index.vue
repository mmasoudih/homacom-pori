<script setup lang="ts">
import { products } from '~/data/landing'

useHead({
  title: 'فروشگاه اینترنتی هماکام | خرید آنلاین لوازم دیجیتال',
})

const newestProducts = products.slice(0, 8)
const bestsellerProducts = [...products.slice(5), ...products.slice(0, 3)]
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-background">
    <LandingSiteHeader />
    <main class="flex flex-col gap-10 py-10 md:gap-12">
      <LandingHeroCarousel />
      <LandingCategoriesSection id="categories" />
      <LandingProductsCarousel
        title="جدیدترین محصولات"
        :products="newestProducts"
      />
      <LandingBannerRow />
      <LandingProductsCarousel
        title="پرفروش‌ترین محصولات"
        :products="bestsellerProducts"
      />
      <LandingBrandsSection />
      <LandingOffersSection id="offers" />
      <LandingBlogSection />
      <LandingAboutSection />
    </main>
    <LandingSiteFooter id="contact" class="mt-auto" />
  </div>
</template>
