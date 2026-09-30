<script setup lang="ts">
import { IconChevronLeft } from '@tabler/icons-vue'
import type { BlogPost } from '~/data/blog'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  title: string
  posts: BlogPost[]
  /** «مشاهده همه» target — omitted for the mixed «جدیدترین مقالات» row. */
  href?: string
  class?: string
}>(), {
  href: '',
  class: '',
})
</script>

<template>
  <section :class="cn('w-full', props.class)">
    <div class="mx-auto w-full max-w-[1440px] px-4 lg:px-6">
      <!-- Mobile title row -->
      <div class="flex items-center justify-between lg:hidden">
        <h2 class="flex items-center gap-[9px] text-[16px] font-bold leading-[23px] text-foreground">
          <span class="relative block h-4 w-[17px]" aria-hidden="true">
            <span class="absolute inset-y-0 left-0 w-[4.65px] rounded-[8px] bg-primary" />
            <span class="absolute inset-y-[20%] left-2 w-[4.65px] rounded-[8px] bg-primary opacity-25" />
          </span>
          {{ title }}
        </h2>
        <NuxtLink
          v-if="href"
          :to="href"
          class="flex items-center gap-1 text-[13px] font-semibold text-primary"
        >
          مشاهده همه
          <IconChevronLeft class="size-4" />
        </NuxtLink>
      </div>

      <!-- Desktop title row -->
      <LandingSectionTitle v-if="href" class="hidden lg:flex" :title="title" variant="row" :to="href" />
      <div v-else class="hidden items-center gap-[9px] lg:flex">
        <span class="relative block h-4 w-[17px] rotate-180" aria-hidden="true">
          <span class="absolute inset-y-[20%] left-2 w-[4.65px] rounded-[8px] bg-primary opacity-25" />
          <span class="absolute inset-y-0 left-0 w-[4.65px] rounded-[8px] bg-primary" />
        </span>
        <h2 class="text-xl font-bold leading-[29px] text-foreground">{{ title }}</h2>
      </div>

      <!-- Mobile: draggable row -->
      <Carousel
        class="mt-6 lg:hidden"
        :opts="{ direction: 'rtl', align: 'start', containScroll: 'trimSnaps', dragFree: true }"
      >
        <CarouselContent class="-ms-[9px]">
          <CarouselItem
            v-for="post in posts"
            :key="`m-${post.slug}`"
            class="w-[209px] shrink-0 basis-auto ps-[9px]"
          >
            <BlogPostCard :post="post" variant="compact" class="h-full" />
          </CarouselItem>
        </CarouselContent>
      </Carousel>

      <!-- Desktop: 4-up grid -->
      <div class="mt-8 hidden gap-[18px] lg:grid lg:grid-cols-4">
        <BlogPostCard
          v-for="post in posts"
          :key="`d-${post.slug}`"
          :post="post"
        />
      </div>
    </div>
  </section>
</template>
