<script setup lang="ts">
import { IconChevronDown, IconPlus, IconMinus } from '@tabler/icons-vue'
import type { ExpertReview } from '~/data/product'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    id?: string
    review: ExpertReview
    showMoreCount?: number
    class?: string
  }>(),
  { id: 'product-review', showMoreCount: 0, class: '' },
)

const emit = defineEmits<{
  navigate: [target: 'specs' | 'comments']
  'show-more': []
}>()
</script>

<template>
  <section :id="props.id" :class="cn('flex w-full scroll-mt-6 flex-col gap-5', props.class)">
    <!-- In-page nav (desktop) -->
    <div class="hidden items-center justify-between lg:flex">
      <div class="flex items-center gap-2">
        <span class="h-[18px] w-1 rounded-full bg-R-300" />
        <h2 class="text-[16px] font-bold text-R-300">نقد و بررسی</h2>
      </div>
      <div class="flex items-center gap-6 text-[12.5px] text-T-700">
        <button type="button" class="transition-colors hover:text-R-300" @click="emit('navigate', 'specs')">
          مشخصات فنی
        </button>
        <button type="button" class="transition-colors hover:text-R-300" @click="emit('navigate', 'comments')">
          دیدگاه کاربران
        </button>
      </div>
    </div>

    <!-- Mobile section title -->
    <div class="flex items-center gap-2 lg:hidden">
      <span class="h-[18px] w-1 rounded-full bg-R-300" />
      <h2 class="text-[16px] font-bold text-T-900">نقد و بررسی</h2>
    </div>

    <!-- Article -->
    <article class="flex flex-col gap-4">
      <h3 class="text-[14px] font-bold text-T-900">{{ review.title }}</h3>

      <p v-for="(paragraph, i) in review.intro" :key="i" class="text-[13px] leading-[26px] text-T-800">
        {{ paragraph }}
      </p>

      <img
        :src="review.image"
        :alt="review.imageAlt"
        class="mx-auto h-auto w-full rounded-2xl object-cover lg:max-w-[520px]"
      >

      <p class="text-[14px] font-bold text-T-900">ویژگی‌های این گوشی در بررسی‌های تخصصی هماکام:</p>

      <p class="text-[13px] text-T-800">{{ review.quickLookTitle }}</p>

      <ul class="flex flex-col gap-2 ps-6">
        <li
          v-for="item in review.quickLook"
          :key="item"
          class="list-disc text-[13px] leading-[22px] marker:text-T-600"
        >
          {{ item }}
        </li>
      </ul>

      <div class="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-6">
        <div class="flex flex-col gap-2">
          <h4 class="text-[13px] font-bold text-[#3BB77E]">{{ review.strengthsTitle }}</h4>
          <ul class="flex flex-col gap-1.5">
            <li
              v-for="item in review.strengths"
              :key="item"
              class="flex items-start gap-2 text-[12.5px] leading-[20px] text-T-700"
            >
              <IconPlus class="mt-0.5 size-3.5 shrink-0 text-[#3BB77E]" />
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="flex flex-col gap-2">
          <h4 class="text-[13px] font-bold text-R-300">{{ review.weaknessesTitle }}</h4>
          <ul class="flex flex-col gap-1.5">
            <li
              v-for="item in review.weaknesses"
              :key="item"
              class="flex items-start gap-2 text-[12.5px] leading-[20px] text-T-700"
            >
              <IconMinus class="mt-0.5 size-3.5 shrink-0 text-R-300" />
              {{ item }}
            </li>
          </ul>
        </div>
      </div>

      <button
        v-if="showMoreCount"
        type="button"
        class="flex items-center gap-1 self-start text-[12.5px] font-medium text-R-300 transition-colors hover:text-R-400 lg:hidden"
        @click="emit('show-more')"
      >
        <IconChevronDown class="size-4" />
        مشخصات بیشتر
      </button>
    </article>
  </section>
</template>
