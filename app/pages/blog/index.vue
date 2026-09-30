<script setup lang="ts">
import { blogSections } from '~/data/blog'

useHead({
  title: 'لیست بلاگ | هماکام',
})

const crumbs = [
  { label: 'هماکام', to: '/' },
  { label: 'لیست بلاگ' },
]
</script>

<template>
  <BlogShell>
    <div class="flex w-full flex-col items-center">
      <BlogBreadcrumb
        class="mx-auto hidden w-full max-w-[1440px] px-4 pt-[22px] lg:flex lg:px-6"
        :items="crumbs"
      />

      <BlogHeroSlider class="lg:mt-6" />

      <BlogSectionRow
        v-for="(section, i) in blogSections"
        :key="section.title"
        :title="section.title"
        :posts="section.posts"
        :href="section.categorySlug ? `/blog/${section.categorySlug}` : ''"
        :class="i === 0 ? 'pt-10 lg:pt-[58px]' : 'pt-10 lg:pt-[46px]'"
      />
    </div>
  </BlogShell>
</template>
