<script setup lang="ts">
import { IconChevronDown } from '@tabler/icons-vue'
import { ceoSection } from '~/data/landing'

const expanded = ref(false)

// Inline keyword styling: `strong` = dark bold, `accent` = brand-red bold.
function segmentClass(tone?: 'strong' | 'accent') {
  if (tone === 'strong') return 'font-bold text-T-900'
  if (tone === 'accent') return 'font-bold text-primary'
  return ''
}
</script>

<template>
  <section class="w-full bg-T-200 max-w-[1440px] my-14 rounded-3xl">
    <div class="mx-auto w-full max-w-[1440px] px-6 py-8">
      <h2 class="text-[18px] font-bold leading-[32px] text-T-900">
        {{ ceoSection.title }}
      </h2>

      <p class="mt-2 text-[16px] leading-[32px] text-T-700">
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
            class="mb-1 text-[18px] font-bold leading-[32px] text-T-900"
          >
            {{ topic.heading }}
          </h3>

          <p
            v-for="(paragraph, pi) in topic.paragraphs"
            :key="pi"
            class="text-[16px] leading-[32px] text-T-700"
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
        class="ms-auto mt-6 flex items-center gap-2 text-[16px] font-semibold text-primary transition-opacity hover:opacity-80"
        :aria-expanded="expanded"
        @click="expanded = !expanded"
      >
        {{ expanded ? 'نمایش کمتر' : 'نمایش بیشتر' }}
        <IconChevronDown
          class="size-6 transition-transform duration-200"
          :class="expanded ? 'rotate-180' : ''"
        />
      </button>
    </div>
  </section>
</template>
