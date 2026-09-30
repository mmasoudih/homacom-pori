<script setup lang="ts">
import { IconChevronLeft, IconClock } from '@tabler/icons-vue'
import { blogHeroFeatured, blogHeroRow, blogHeroSlides } from '~/data/blog'
import type { BlogPost } from '~/data/blog'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  class?: string
}>(), {
  class: '',
})

const to = (post: BlogPost) => `/blog/${post.categorySlug}/${post.slug}`
const heroOpts = { direction: 'rtl' as const, loop: true, align: 'start' as const }
</script>

<template>
  <section :class="cn('w-full', props.class)">
    <!-- ============================== Desktop ============================= -->
    <div class="mx-auto hidden w-full max-w-[1440px] flex-col gap-[22px] lg:flex lg:px-6">
      <div class="grid grid-cols-3 gap-6">
        <!-- Featured card (design places it at the inline end / physical right) -->
        <BlogPostCard :post="blogHeroFeatured" variant="overlay" class="h-[280px]" />

        <!-- Big slider -->
        <Carousel v-slot="{ scrollNext, scrollPrev }" class="col-span-2" :opts="heroOpts">
          <CarouselContent class="ms-0 h-[280px]">
            <CarouselItem
              v-for="slide in blogHeroSlides"
              :key="slide.slug"
              class="h-full basis-full ps-0"
            >
              <NuxtLink
                :to="to(slide)"
                class="group relative isolate block size-full overflow-hidden rounded-3xl bg-T-300"
              >
                <img :src="slide.image" :alt="slide.title" class="size-full object-cover">
                <span
                  aria-hidden="true"
                  class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/25 to-transparent"
                />
                <span
                  v-if="slide.category"
                  class="absolute left-4 top-4 flex h-7 items-center rounded-full bg-[#ef233c] px-3.5 text-[13px] font-medium text-white"
                >
                  {{ slide.category }}
                </span>
                <div class="absolute inset-x-[25px] bottom-[22px] flex flex-col items-start gap-2 text-white">
                  <h3 class="line-clamp-2 text-[20px] font-bold leading-[30px]">{{ slide.title }}</h3>
                  <span class="flex items-center gap-1.5 text-[13px] text-white/90">
                    <IconClock class="size-[15px]" />
                    {{ slide.age }}
                  </span>
                </div>
              </NuxtLink>
            </CarouselItem>
          </CarouselContent>

          <button
            type="button"
            class="absolute left-8 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center text-white transition-opacity hover:opacity-70"
            aria-label="اسلاید بعدی"
            @click="scrollNext"
          >
            <IconChevronLeft class="size-5" />
          </button>
          <button
            type="button"
            class="absolute right-8 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center text-white transition-opacity hover:opacity-70"
            aria-label="اسلاید قبلی"
            @click="scrollPrev"
          >
            <IconChevronLeft class="size-5 rotate-180" />
          </button>
        </Carousel>
      </div>

      <!-- Overlay row -->
      <div class="grid grid-cols-3 gap-[10px]">
        <BlogPostCard
          v-for="post in blogHeroRow"
          :key="`row-${post.slug}`"
          :post="post"
          variant="overlay"
          class="h-[280px]"
        />
      </div>
    </div>

    <!-- =============================== Mobile ============================= -->
    <Carousel
      v-slot="{ scrollNext, scrollPrev }"
      class="lg:hidden"
      :opts="heroOpts"
    >
      <CarouselContent class="ms-0 h-[243px]">
        <CarouselItem
          v-for="slide in blogHeroSlides"
          :key="`m-${slide.slug}`"
          class="h-full basis-full ps-0"
        >
          <NuxtLink
            :to="to(slide)"
            class="relative isolate block size-full overflow-hidden bg-T-300"
          >
            <img :src="slide.image" :alt="slide.title" class="size-full object-cover">
            <span
              aria-hidden="true"
              class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/25 to-transparent"
            />
            <div class="absolute inset-x-4 bottom-3 flex flex-col items-start gap-1 text-white">
              <h3 class="line-clamp-2 text-[14px] font-bold leading-[21px]">{{ slide.title }}</h3>
              <span class="flex items-center gap-1.5 text-[12px] text-white/90">
                <IconClock class="size-[14px]" />
                {{ slide.age }}
              </span>
            </div>
          </NuxtLink>
        </CarouselItem>
      </CarouselContent>

      <button
        type="button"
        class="absolute left-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center text-white transition-opacity hover:opacity-70"
        aria-label="اسلاید بعدی"
        @click="scrollNext"
      >
        <IconChevronLeft class="size-[18px]" />
      </button>
      <button
        type="button"
        class="absolute right-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center text-white transition-opacity hover:opacity-70"
        aria-label="اسلاید قبلی"
        @click="scrollPrev"
      >
        <IconChevronLeft class="size-[18px] rotate-180" />
      </button>
    </Carousel>
  </section>
</template>
