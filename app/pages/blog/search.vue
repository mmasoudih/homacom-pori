<script setup lang="ts">
import { blogPosts } from '~/data/blog'

const route = useRoute()

const term = computed(() => String(route.query.q ?? '').trim())

useHead({
  title: 'جستجو در مقالات | بلاگ هماکام',
})

const results = computed(() => {
  const q = term.value
  if (!q) return []
  return blogPosts.filter(post =>
    post.title.includes(q) || post.category.includes(q),
  )
})

const crumbs = computed(() => [
  { label: 'هماکام', to: '/' },
  { label: 'لیست بلاگ', to: '/blog' },
  { label: 'جستجو' },
])
</script>

<template>
  <BlogShell>
    <div class="flex w-full flex-col items-center">
      <div class="mx-auto w-full max-w-[1440px] px-4 lg:px-6">
        <BlogBreadcrumb class="pt-6 lg:pt-[22px]" :items="crumbs" />

        <h1 class="mt-8 flex items-center gap-[9px] text-xl font-bold leading-[29px] text-foreground lg:mt-11">
          <span class="relative block h-4 w-[17px]" aria-hidden="true">
            <span class="absolute inset-y-0 left-0 w-[4.65px] rounded-[8px] bg-primary" />
            <span class="absolute inset-y-[20%] left-2 w-[4.65px] rounded-[8px] bg-primary opacity-25" />
          </span>
          <span v-if="term">نتایج جستجو برای «{{ term }}»</span>
          <span v-else>جستجو در مقالات</span>
        </h1>

        <div v-if="results.length" class="mt-6 grid grid-cols-2 gap-4 lg:mt-7 lg:grid-cols-4 lg:gap-[18px]">
          <BlogPostCard
            v-for="post in results"
            :key="post.slug"
            :post="post"
          />
        </div>

        <p v-else class="mt-8 text-[15px] text-T-700">
          مقاله‌ای با این عبارت پیدا نشد. عبارت دیگری را امتحان کنید.
        </p>
      </div>
    </div>
  </BlogShell>
</template>
