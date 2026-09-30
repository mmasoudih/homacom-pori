<script setup lang="ts">
import { blogPosts } from '~/data/landing'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
</script>

<template>
  <section class="mx-auto w-full max-w-[1440px] px-4 py-5 lg:px-0 lg:py-6">
    <LandingSectionTitle title="وبلاگ" variant="row" to="/blog" />

    <!-- Mobile: horizontal scroll -->
    <Carousel
      class="mt-[18px] lg:hidden"
      :opts="{ direction: 'rtl', align: 'start', containScroll: 'trimSnaps', dragFree: true }"
    >
      <CarouselContent class="-ms-3">
        <CarouselItem
          v-for="(post, i) in blogPosts"
          :key="i"
          class="w-[222px] shrink-0 basis-auto ps-3"
        >
          <NuxtLink to="/blog" class="group block overflow-hidden rounded-2xl border border-T-400 bg-T-50">
            <!-- Image -->
            <div class="aspect-[210/151] w-full overflow-hidden">
              <img
                :src="post.image"
                :alt="post.title"
                class="h-full w-full object-cover"
              >
            </div>

            <!-- Content -->
            <div class="flex flex-col gap-3 px-4 py-3">
              <h3 class="line-clamp-2 min-h-[44px] text-[14px] font-bold leading-[22px] text-foreground">
                {{ post.title }}
              </h3>
              <div class="flex items-center justify-between border-t border-T-400 pt-3">
                <span class="text-[12px] text-T-600">{{ post.date }}</span>
                <span class="text-[12px] font-medium text-foreground transition-colors group-hover:text-primary">
                  ادامه مطلب
                </span>
              </div>
            </div>
          </NuxtLink>
        </CarouselItem>
      </CarouselContent>
    </Carousel>

    <!-- Desktop: grid -->
    <div class="mt-[18px] hidden grid-cols-1 gap-[18px] lg:grid lg:grid-cols-4">
      <NuxtLink
        v-for="(post, i) in blogPosts"
        :key="i"
        class="group overflow-hidden rounded-2xl border border-T-400 bg-T-50"
      >
        <!-- Image -->
        <div class="aspect-[324/180] w-full overflow-hidden">
          <img
            :src="post.image"
            :alt="post.title"
            class="h-full w-full object-cover transition-transform group-hover:scale-105"
          >
        </div>

        <!-- Content -->
        <div class="flex flex-col gap-3 px-4 py-3">
          <h3 class="line-clamp-2 min-h-[44px] text-[16px] leading-[22px] text-foreground">
            {{ post.title }}
          </h3>
          <div class="flex items-center justify-between pt-3">
            <span class="text-[14px] text-T-800">{{ post.date }}</span>
            <span class="text-[14px] text-R-300 font-medium transition-colors group-hover:underline">
              ادامه مطلب
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>
