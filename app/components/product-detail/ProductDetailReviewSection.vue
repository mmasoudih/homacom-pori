<script setup lang="ts">
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
  <section :id="props.id" :class="cn('flex w-full scroll-mt-24 flex-col gap-4 lg:scroll-mt-6 lg:gap-5', props.class)">
    <!-- Section header: accent mark + 18/22 title (design «Frame 3175») -->
    <div class="flex items-center gap-2 lg:h-[22px] lg:gap-2">
      <span class="h-[18px] w-1 rounded-full bg-R-300 lg:hidden" />

      <img
        src="/icons/product-detail/spec-accent-20.svg"
        alt=""
        class="hidden h-5 w-[13px] shrink-0 lg:block"
      >

      <h2 class="text-[16px] font-bold text-T-900 lg:text-[18px] lg:leading-[22px]">نقد و بررسی</h2>
    </div>

    <!-- Article (design «Frame 3115») -->
    <article class="flex flex-col gap-4 lg:gap-5">
      <h3 class="text-[16px] font-bold leading-[30px] text-T-900 lg:text-[18px] lg:leading-[22px]">
        {{ review.title }}
      </h3>

      <div class="flex flex-col gap-4 lg:gap-0">
        <p
          v-for="(paragraph, i) in review.intro"
          :key="i"
          class="text-[13px] leading-[30px] text-T-800 lg:text-[16px] lg:leading-[38.4px]"
        >
          {{ paragraph }}
        </p>

        <img
          :src="review.image"
          :alt="review.imageAlt"
          class="mx-auto h-auto w-full rounded-2xl object-cover lg:my-[30px] lg:h-[342px] lg:w-[608px] lg:max-w-none lg:rounded-[20px]"
        >

        <p class="text-[14px] font-bold text-T-900 lg:text-[16px] lg:font-semibold lg:leading-[38.4px]">
          {{ review.quickLookTitle }}
        </p>

        <ul class="flex flex-col gap-2 ps-6 lg:gap-0 lg:ps-[30px]">
          <li
            v-for="item in review.quickLook"
            :key="item"
            class="list-disc text-[13px] leading-[28px] marker:text-T-600 lg:text-[16px] lg:leading-[38.4px] lg:text-T-800 lg:marker:text-T-800"
          >
            {{ item }}
          </li>
        </ul>
      </div>

      <!-- «مشاهده بیشتر»: right aligned, 12.5 bold with the exported chevron on its left -->
      <button
        v-if="showMoreCount"
        type="button"
        class="flex items-center gap-1 self-start text-[13px] font-medium text-R-300 transition-colors hover:text-R-400 lg:text-[12.5px] lg:font-bold"
        @click="emit('show-more')"
      >
        <span>مشاهده بیشتر</span>
        <img src="/icons/product-detail/angle-down-14.svg" alt="" class="size-4 lg:size-3.5">
      </button>
    </article>
  </section>
</template>
