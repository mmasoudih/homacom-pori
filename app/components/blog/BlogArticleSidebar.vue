<script setup lang="ts">
import type { BlogPost } from '~/data/blog'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  rails: { title: string, posts: BlogPost[] }[]
  class?: string
}>(), {
  class: '',
})
</script>

<template>
  <aside :class="cn('flex w-full flex-col gap-10', props.class)">
    <section v-for="rail in props.rails" :key="rail.title" class="flex flex-col">
      <h2 class="flex items-center gap-[9px] text-[18px] font-bold leading-[28px] text-T-900">
        <span class="relative block h-4 w-[17px]" aria-hidden="true">
          <span class="absolute inset-y-0 left-0 w-[4.65px] rounded-[8px] bg-primary" />
          <span class="absolute inset-y-[20%] left-2 w-[4.65px] rounded-[8px] bg-primary opacity-25" />
        </span>
        {{ rail.title }}
      </h2>

      <div class="mt-4 flex flex-col gap-3">
        <NuxtLink
          v-for="post in rail.posts"
          :key="`${rail.title}-${post.slug}`"
          :to="`/blog/${post.categorySlug}/${post.slug}`"
          class="flex items-center justify-between gap-3 rounded-2xl border border-T-400 bg-T-50 p-1.5 transition-colors hover:border-T-500"
        >
          <img
            :src="post.image"
            :alt="post.title"
            class="h-[78px] w-[90px] shrink-0 rounded-xl object-cover"
          >
          <h3 class="line-clamp-2 text-start text-[14px] leading-[22px] text-foreground">
            {{ post.title }}
          </h3>
        </NuxtLink>
      </div>
    </section>
  </aside>
</template>
