<script setup lang="ts">
import { IconChevronDown } from '@tabler/icons-vue'
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
  'show-more': []
}>()
</script>

<template>
  <section :id="props.id" :class="cn('flex w-full scroll-mt-24 flex-col gap-5 lg:scroll-mt-6', props.class)">
    <!-- Section header -->
    <div class="flex items-center gap-2">
      <span class="h-[18px] w-1 rounded-full bg-R-300" />
      <h2 class="text-[16px] font-bold text-T-900">نقد و بررسی</h2>
    </div>

    <!-- Article -->
    <article class="flex flex-col gap-4">
      <h3 class="text-[16px] font-bold leading-[30px] text-T-900 lg:text-[18px]">{{ review.title }}</h3>

      <p v-for="(paragraph, i) in review.intro" :key="i" class="text-[13px] leading-[30px] text-T-800 lg:text-[13.5px]">
        {{ paragraph }}
      </p>

      <img
        :src="review.image"
        :alt="review.imageAlt"
        class="mx-auto h-auto w-full rounded-2xl object-cover lg:max-w-[620px]"
      >

      <p class="text-[14px] font-bold text-T-900">ویژگی‌های این گوشی در بررسی های تخصصی هماکام:</p>

      <ul class="flex flex-col gap-2 ps-6">
        <li
          v-for="item in review.quickLook"
          :key="item"
          class="list-disc text-[13px] leading-[28px] marker:text-T-600"
        >
          {{ item }}
        </li>
      </ul>

      <button
        v-if="showMoreCount"
        type="button"
        class="flex items-center gap-1 self-start text-[13px] font-medium text-R-300 transition-colors hover:text-R-400"
        @click="emit('show-more')"
      >
        <IconChevronDown class="size-4" />
        مشاهده بیشتر
      </button>
    </article>
  </section>
</template>
