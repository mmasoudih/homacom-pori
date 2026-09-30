<script setup lang="ts">
import {
  IconCalendar,
  IconMessageDots,
  IconPencil,
  IconPrinter,
  IconShare3,
  IconStarFilled,
} from '@tabler/icons-vue'
import type { BlogInlineSegment } from '~/data/blog'
import { blogArticle, blogArticleSidebar, blogPosts, findBlogCategory } from '~/data/blog'

const route = useRoute()
const category = computed(() => findBlogCategory(String(route.params.category)))

useHead({
  title: `${blogArticle.title} | بلاگ هماکام`,
})

const crumbs = computed(() => [
  { label: 'هماکام', to: '/' },
  { label: 'لیست بلاگ', to: '/blog' },
  { label: category.value?.label ?? blogArticle.category, to: `/blog/${blogArticle.categorySlug}` },
  { label: blogArticle.title },
])

const related = computed(() => blogPosts.slice(0, 4))

function segmentClass(tone?: BlogInlineSegment['tone']) {
  if (tone === 'strong') return 'font-bold text-T-900'
  if (tone === 'accent') return 'font-bold text-primary'
  return ''
}
</script>

<template>
  <BlogShell>
    <div class="flex w-full flex-col items-center">
      <div class="mx-auto w-full max-w-[1440px] px-4 lg:px-6">
        <BlogBreadcrumb class="pt-6 lg:pt-[22px]" :items="crumbs" />

      <div class="mt-5 grid grid-cols-1 gap-12 lg:mt-[21px] lg:grid-cols-[1fr_324px] lg:gap-[132px]">
        <!-- ============================== Article ============================= -->
        <article class="flex min-w-0 flex-col">
          <img
            :src="blogArticle.image"
            :alt="blogArticle.title"
            class="aspect-[2/1] w-full rounded-2xl object-cover lg:aspect-video"
          >

          <!-- Mobile: author + date -->
          <div class="mt-6 flex items-center justify-center gap-3 lg:hidden">
            <span class="text-[14px] font-medium text-primary">{{ blogArticle.author }}</span>
            <span class="h-5 w-px bg-T-400" />
            <span class="text-[14px] text-T-700">{{ blogArticle.date }}</span>
          </div>

          <!-- Desktop: full meta row -->
          <div class="mt-9 hidden items-center gap-7 text-[15px] text-T-700 lg:flex">
            <span class="flex items-center gap-2">
              <IconMessageDots class="size-5" />
              {{ blogArticle.views }}
            </span>
            <span class="flex items-center gap-2">
              <IconStarFilled class="size-[18px] text-T-600" />
              {{ blogArticle.rating }} امتیاز
            </span>
            <span class="flex items-center gap-2">
              <IconPencil class="size-[18px]" />
              نویسنده: {{ blogArticle.author }}
            </span>
            <span class="flex items-center gap-2">
              <IconCalendar class="size-[18px]" />
              {{ blogArticle.date }}
            </span>
          </div>

          <h1 class="mt-5 text-[20px] font-bold leading-[32px] text-foreground lg:text-[28px] lg:font-black lg:leading-[44px]">
            {{ blogArticle.title }}
          </h1>

          <!-- Mobile: actions + rating -->
          <div class="mt-6 flex items-center justify-between lg:hidden">
            <div class="flex items-center gap-4 text-[13.5px] text-T-700">
              <span class="flex items-center gap-1.5">
                <IconMessageDots class="size-[18px]" />
                {{ blogArticle.views }}
              </span>
              <span class="flex items-center gap-1.5">
                <IconStarFilled class="size-[17px] text-T-600" />
                {{ blogArticle.rating }} امتیاز
              </span>
            </div>
            <div class="flex items-center gap-3">
              <button
                type="button"
                class="flex size-11 items-center justify-center rounded-xl bg-T-200 text-T-700 transition-colors hover:bg-T-300"
                aria-label="اشتراک‌گذاری"
              >
                <IconShare3 class="size-5" />
              </button>
              <button
                type="button"
                class="flex size-11 items-center justify-center rounded-xl bg-T-200 text-T-700 transition-colors hover:bg-T-300"
                aria-label="چاپ"
              >
                <IconPrinter class="size-5" />
              </button>
            </div>
          </div>

          <!-- Lead -->
          <p class="mt-6 rounded-2xl border-s-4 border-primary bg-R-10 px-5 py-4 text-justify text-[14px] leading-[28px] text-T-800 lg:mt-[22px] lg:text-[15px] lg:leading-[32px]">
            {{ blogArticle.lead }}
          </p>

          <!-- Body -->
          <div class="flex flex-col">
            <template v-for="(block, bi) in blogArticle.body" :key="bi">
              <h2
                v-if="block.kind === 'heading'"
                class="mt-8 text-[18px] font-bold leading-[30px] text-T-900 lg:mt-[30px] lg:text-[20px] lg:leading-[32px]"
              >
                {{ block.text }}
              </h2>

              <p
                v-else-if="block.kind === 'paragraph'"
                class="mt-3 text-justify text-[14px] leading-[28px] text-T-800 lg:text-[15px] lg:leading-[32px]"
              >
                <span
                  v-for="(segment, si) in block.segments"
                  :key="si"
                  :class="segmentClass(segment.tone)"
                >{{ segment.text }}</span>
              </p>

              <ul v-else class="mt-2 flex flex-col gap-1">
                <li v-for="(item, ii) in block.items" :key="ii" class="flex items-start gap-2">
                  <span class="mt-[13px] size-[6px] shrink-0 rounded-full bg-T-800" aria-hidden="true" />
                  <p class="text-justify text-[14px] leading-[28px] text-T-800 lg:text-[15px] lg:leading-[32px]">
                    <span
                      v-for="(segment, si) in item"
                      :key="si"
                      :class="segmentClass(segment.tone)"
                    >{{ segment.text }}</span>
                  </p>
                </li>
              </ul>
            </template>
          </div>

          <!-- Comments -->
          <BlogComments class="mt-10 lg:mt-[54px]" :comments="blogArticle.comments" />
        </article>

        <!-- ============================== Sidebar ============================= -->
        <BlogArticleSidebar :rails="blogArticleSidebar" class="hidden lg:flex" />
      </div>
      </div>

      <BlogSectionRow
        title="مطالب مرتبط"
        :posts="related"
        class="pt-10 lg:pt-[62px]"
      />
    </div>
  </BlogShell>
</template>
