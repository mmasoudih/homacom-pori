<script setup lang="ts">
import { blogPosts } from '~/data/landing'
</script>

<template>
  <section class="mx-auto w-full max-w-[1350px]">
    <LandingSectionTitle title="وبلاگ" variant="row" />

    <div class="mt-[18px] grid grid-cols-1 gap-[18px] sm:grid-cols-2 md:grid-cols-4">
      <article
        v-for="(post, i) in blogPosts"
        :key="i"
        class="group overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white transition-shadow hover:shadow-md"
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
          <h3 class="line-clamp-2 min-h-[44px] text-[14px] font-bold leading-[22px] text-foreground">
            {{ post.title }}
          </h3>
          <div class="flex items-center justify-between border-t border-[#e5e7eb] pt-3">
            <span class="text-[12px] text-[#9ca3af]">{{ post.date }}</span>
            <a href="#" class="text-[12px] font-medium text-foreground transition-colors hover:text-primary">
              ادامه مطلب
            </a>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
