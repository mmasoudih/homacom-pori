<script setup lang="ts">
import { IconArrowLeft, IconCalendarMonth } from '@tabler/icons-vue'
import { blogPosts } from '~/data/landing'
</script>

<template>
  <section class="mx-auto w-full max-w-[1400px] px-5">
    <div class="relative flex items-center gap-6">
      <!-- Title column -->
      <div class="relative z-20 hidden shrink-0 items-center justify-center self-stretch md:flex">
        <div
          class="flex h-full w-40 -rotate-0 flex-col items-center justify-center gap-6 rounded-full border border-dashed border-primary/40 bg-card px-8 text-center"
        >
          <h2 class="text-3xl font-black leading-[1.2] text-foreground">
            مقالات
            <span class="mt-2 block text-sm font-medium text-muted-foreground">وبلاگ هماکام</span>
          </h2>
        </div>
      </div>

      <!-- Cards -->
      <div class="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <article
          v-for="post in blogPosts"
          :key="post.id"
          class="group overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
        >
          <a href="#" class="block">
            <div class="relative aspect-[16/10] overflow-hidden">
              <img
                :src="post.image"
                :alt="post.title"
                loading="lazy"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              >
              <span class="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
                {{ post.category }}
              </span>
            </div>
            <div class="p-5">
              <h3 class="mb-4 line-clamp-2 min-h-[3rem] text-sm font-semibold leading-6 text-foreground">
                {{ post.title }}
              </h3>
              <div class="flex items-center justify-between border-t border-dashed border-border pt-4">
                <span class="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <IconCalendarMonth class="size-4 text-primary" />
                  {{ post.date }}
                </span>
                <span class="flex items-center gap-1 text-sm font-bold text-primary">
                  ادامه مطلب
                  <IconArrowLeft class="size-4" />
                </span>
              </div>
            </div>
          </a>
        </article>
      </div>
    </div>
  </section>
</template>
