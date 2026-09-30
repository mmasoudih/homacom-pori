<script setup lang="ts">
import { IconChevronDown } from '@tabler/icons-vue'
import type { SeoSegment } from '~/data/landing'
import { ceoSection } from '~/data/landing'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  class?: string
}>(), {
  class: '',
})

const expanded = ref(false)

/** Inline keyword styling: `strong` = dark bold, `accent` = brand-red bold. */
function segmentClass(tone?: SeoSegment['tone']) {
  if (tone === 'strong') return 'font-bold text-T-900'
  if (tone === 'accent') return 'font-bold text-primary'
  return ''
}
</script>

<template>
  <section :class="cn('w-full lg:px-6', props.class)">
    <div
      class="mx-auto w-full bg-T-200 px-4 py-6 lg:max-w-[1440px] lg:rounded-3xl lg:px-[45px] lg:pb-[30px] lg:pt-[25px]"
    >
      <h2 class="text-[15px] font-bold leading-[26px] text-T-900 lg:text-[16px] lg:leading-[32px]">
        {{ ceoSection.title }}
      </h2>

      <p class="mt-2 text-[13.5px] leading-[26px] text-T-700 lg:mt-1 lg:text-[15px] lg:leading-[28px]">
        <span
          v-for="(segment, i) in ceoSection.intro"
          :key="i"
          :class="segmentClass(segment.tone)"
        >{{ segment.text }}</span>
      </p>

      <template v-if="expanded">
        <div
          v-for="(topic, ti) in ceoSection.more"
          :key="ti"
          :class="topic.heading ? 'mt-[30px]' : ''"
        >
          <h3
            v-if="topic.heading"
            class="mb-1 text-[15px] font-bold leading-[28px] text-T-900 lg:text-[18px] lg:leading-[32px]"
          >
            {{ topic.heading }}
          </h3>

          <p
            v-for="(paragraph, pi) in topic.paragraphs"
            :key="pi"
            class="text-[13.5px] leading-[26px] text-T-700 lg:text-[15px] lg:leading-[28px]"
          >
            <span
              v-for="(segment, si) in paragraph"
              :key="si"
              :class="segmentClass(segment.tone)"
            >{{ segment.text }}</span>
          </p>
        </div>
      </template>

      <button
        type="button"
        class="ms-auto mt-4 flex w-fit items-center gap-1.5 text-[13.5px] font-semibold text-primary transition-opacity hover:opacity-80 lg:mt-2 lg:gap-2 lg:text-[15px]"
        :aria-expanded="expanded"
        @click="expanded = !expanded"
      >
        {{ expanded ? 'نمایش کمتر' : 'نمایش بیشتر' }}
        <IconChevronDown
          class="size-4 transition-transform duration-200 lg:size-5"
          :class="expanded ? 'rotate-180' : ''"
        />
      </button>
    </div>
  </section>
</template>
