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
  <section class="mx-auto w-full bg-T-200 max-w-[1440px] my-14 lg:rounded-3xl">
    <div class="mx-auto w-full max-w-[1440px] px-6 py-8">
      <UiTypography as="h2" size="lg" weight="bold" class="leading-[32px] text-T-900">
        {{ ceoSection.title }}
      </UiTypography>

      <UiTypography
        as="p"
        size="md"
        weight="regular"
        class="mt-2 leading-[32px] text-T-700"
      >
        <UiTypography
          v-for="(segment, i) in ceoSection.intro"
          :key="i"
          as="span"
          size="md"
          :weight="segment.tone ? 'bold' : 'regular'"
          :color="segment.tone ? 'default' : 'muted'"
          :class="segmentClass(segment.tone)"
        >{{ segment.text }}</UiTypography>
      </UiTypography>

      <template v-if="expanded">
        <div
          v-for="(topic, ti) in ceoSection.more"
          :key="ti"
          :class="topic.heading ? 'mt-[30px]' : ''"
        >
          <UiTypography
            v-if="topic.heading"
            as="h3"
            size="lg"
            weight="bold"
            class="mb-1 leading-[32px] text-T-900"
          >
            {{ topic.heading }}
          </UiTypography>

          <UiTypography
            v-for="(paragraph, pi) in topic.paragraphs"
            :key="pi"
            as="p"
            size="md"
            weight="regular"
            class="leading-[32px] text-T-700"
          >
            <UiTypography
              v-for="(segment, si) in paragraph"
              :key="si"
              as="span"
              size="md"
              :weight="segment.tone ? 'bold' : 'regular'"
              :color="segment.tone ? 'default' : 'muted'"
              :class="segmentClass(segment.tone)"
            >{{ segment.text }}</UiTypography>
          </UiTypography>
        </div>
      </template>

      <button
        type="button"
        class="ms-auto mt-6 flex items-center gap-2 text-primary transition-opacity hover:opacity-80"
        :aria-expanded="expanded"
        @click="expanded = !expanded"
      >
        <UiTypography as="span" size="lg" weight="semibold" color="primary">
          {{ expanded ? 'نمایش کمتر' : 'نمایش بیشتر' }}
        </UiTypography>
        <IconChevronDown
          class="size-6 transition-transform duration-200"
          :class="expanded ? 'rotate-180' : ''"
        />
      </button>
    </div>
  </section>
</template>
