<script setup lang="ts">
const route = useRoute()
const slug = computed(() => String(route.params.category))
const page = ref(1)

const { categoryPosts } = useBlogCategory(slug, page)
const allPosts = computed(() => categoryPosts.value.posts)

useHead({
  title: () => `${categoryPosts.value.title} | بلاگ هماکام`,
})

const crumbs = computed(() => [
  { label: 'هماکام', to: '/' },
  { label: 'لیست بلاگ', to: '/blog' },
  { label: categoryPosts.value.title },
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
          {{ categoryPosts.title }}
        </h1>

        <div class="mt-6 grid grid-cols-2 gap-4 lg:mt-7 lg:grid-cols-4 lg:gap-[18px]">
          <BlogPostCard
            v-for="(post, i) in allPosts"
            :key="`${post.slug}-${i}`"
            :post="post"
          />
        </div>

        <AppPagination v-model:page="page" :pages="categoryPosts.lastPage" class="mt-10 lg:mt-[42px]" />
      </div>
    </div>
  </BlogShell>
</template>
