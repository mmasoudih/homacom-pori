<script setup lang="ts">
import { IconClock } from '@tabler/icons-vue'
import type { BlogPost } from '~/data/blog'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  post: BlogPost
  /**
   * `grid`    — desktop row card (cover + chip + title + meta).
   * `compact` — mobile carousel card (smaller type, 3-line title, no chip).
   * `overlay` — hero card: the cover fills the box and the copy sits on top.
   */
  variant?: 'grid' | 'compact' | 'overlay'
  class?: string
}>(), {
  variant: 'grid',
  class: '',
})

const to = computed(() => `/blog/${props.post.categorySlug}/${props.post.slug}`)
</script>

<template>
  <!-- ============================== Overlay ============================== -->
  <NuxtLink
    v-if="variant === 'overlay'"
    :to="to"
    :class="cn(
      'group relative isolate block h-full w-full overflow-hidden rounded-3xl bg-T-300',
      props.class,
    )"
  >
    <img
      :src="post.image"
      :alt="post.title"
      class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
    >
    <span
      aria-hidden="true"
      class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 via-black/25 to-transparent"
    />

    <!-- Category chip (physical top-left, as designed) -->
    <span
      class="absolute left-4 top-4 flex h-7 items-center rounded-full bg-[#ef233c] px-3.5 text-[13px] font-medium text-white"
    >
      {{ post.category }}
    </span>

    <!-- Copy -->
    <div class="absolute inset-x-4 bottom-4 flex flex-col items-start gap-1.5 text-white lg:gap-2">
      <h3 class="line-clamp-2 text-[14px] font-bold leading-[22px] lg:text-[17px] lg:leading-[26px]">
        {{ post.title }}
      </h3>
      <span class="flex items-center gap-1.5 text-[12px] text-white/90 lg:text-[13px]">
        <IconClock class="size-[15px]" />
        {{ post.age }}
      </span>
    </div>
  </NuxtLink>

  <!-- ============================ Grid / compact ========================== -->
  <NuxtLink
    v-else
    :to="to"
    :class="cn(
      'group flex flex-col overflow-hidden rounded-2xl border border-T-400 bg-T-50 transition-colors hover:border-T-500',
      props.class,
    )"
  >
    <div class="relative aspect-[3/2] w-full overflow-hidden">
      <img
        :src="post.image"
        :alt="post.title"
        class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
      >
      <span
        v-if="variant === 'grid'"
        class="absolute left-4 top-4 flex h-7 items-center rounded-full bg-[#ef233c] px-3.5 text-[13px] font-medium text-white"
      >
        {{ post.category }}
      </span>
    </div>

    <div
      class="flex flex-1 flex-col"
      :class="variant === 'grid' ? 'px-4 pb-[22px] pt-4' : 'gap-3 px-3 pb-4 pt-3'"
    >
      <h3
        class="text-start font-normal text-foreground"
        :class="variant === 'grid'
          ? 'line-clamp-2 min-h-[40px] text-[16px] leading-[20px]'
          : 'line-clamp-3 text-[14px] leading-[19px]'"
      >
        {{ post.title }}
      </h3>

      <div
        class="flex items-center justify-between"
        :class="variant === 'grid' ? 'mt-3 text-[13px]' : 'mt-auto text-[12px]'"
      >
        <span class="text-T-700">{{ post.date }}</span>
        <span class="font-medium text-primary group-hover:underline">ادامه مطلب</span>
      </div>
    </div>
  </NuxtLink>
</template>
