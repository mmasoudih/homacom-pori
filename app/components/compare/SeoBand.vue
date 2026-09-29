<script setup lang="ts">
import { IconChevronDown, IconCircleCheck } from '@tabler/icons-vue'
import { compareSeo } from '~/data/compare'

const expanded = ref(false)
</script>

<template>
  <section class="rounded-[20px] bg-T-100 px-4 py-6 lg:px-6 lg:py-8">
    <div class="flex flex-col gap-3">
      <h2 class="text-end text-[16px] font-bold text-T-900 lg:text-[18px]">
        {{ compareSeo.title }}
      </h2>

      <p
        class="text-justify text-[13px] leading-[26px] text-T-700 transition-all duration-300 lg:text-[14px] lg:leading-[28px]"
        :class="expanded ? '' : 'line-clamp-2 lg:line-clamp-3'"
      >
        {{ compareSeo.body }}
      </p>

      <button
        type="button"
        class="flex items-center gap-1.5 self-start text-[13px] font-semibold text-primary transition-opacity hover:opacity-80"
        @click="expanded = !expanded"
      >
        <IconCircleCheck class="size-[18px]" />
        {{ expanded ? compareSeo.lessLabel : compareSeo.moreLabel }}
        <IconChevronDown
          class="size-4 transition-transform duration-200"
          :class="expanded ? 'rotate-180' : ''"
        />
      </button>
    </div>
  </section>
</template>
