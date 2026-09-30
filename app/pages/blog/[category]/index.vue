<script setup lang="ts">
import { findBlogCategory, postsByCategory } from '~/data/blog'

const route = useRoute()
const slug = computed(() => String(route.params.category))
const category = computed(() => findBlogCategory(slug.value))

if (!category.value) {
  throw createError({ statusCode: 404, statusMessage: 'دسته‌بندی یافت نشد', fatal: true })
}

useHead({
  title: `${category.value.label} | بلاگ هماکام`,
})

const perPage = 16
const page = ref(1)

/** Repeat the category pool so every page renders a full 4×4 grid. */
const allPosts = computed(() => {
  const pool = postsByCategory(slug.value)
  return Array.from({ length: perPage }, (_, i) => pool[i % pool.length]!)
})

const crumbs = computed(() => [
  { label: 'هماکام', to: '/' },
  { label: 'لیست بلاگ', to: '/blog' },
  { label: category.value!.label },
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
          {{ category!.label }}
        </h1>

        <div class="mt-6 grid grid-cols-2 gap-4 lg:mt-7 lg:grid-cols-4 lg:gap-[18px]">
          <BlogPostCard
            v-for="(post, i) in allPosts"
            :key="`${post.slug}-${i}`"
            :post="post"
          />
        </div>

        <BlogPagination v-model:page="page" :total="125" class="mt-10 lg:mt-[42px]" />
      </div>
    </div>
  </BlogShell>
</template>
