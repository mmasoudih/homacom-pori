<script setup lang="ts">
import { IconChevronDown, IconMessageCircle2 } from '@tabler/icons-vue'
import type { ProductQuestion } from '~/data/product'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    id?: string
    questions: ProductQuestion[]
    class?: string
  }>(),
  { id: 'product-questions', class: '' },
)
</script>

<template>
  <section :id="props.id" :class="cn('flex w-full scroll-mt-6 flex-col gap-4', props.class)">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="h-[18px] w-1 rounded-full bg-R-300" />
        <h2 class="text-[16px] font-bold text-T-900">پرسش کاربران</h2>
      </div>
      <button
        type="button"
        class="flex items-center gap-1 text-[12.5px] text-T-700 transition-colors hover:text-R-300"
      >
        همه پرسش‌ها
        <IconChevronDown class="size-4 rotate-90" />
      </button>
    </div>

    <div class="flex flex-col gap-3">
      <article
        v-for="item in questions"
        :key="item.id"
        class="flex flex-col gap-2 rounded-2xl border border-T-300 bg-T-50 px-4 py-3.5"
      >
        <p class="flex items-center gap-2 text-[13px] font-medium text-T-900">
          <IconMessageCircle2 class="size-4 text-T-600" />
          {{ item.question }}
        </p>
        <div class="flex items-start gap-2 ps-6">
          <span class="flex h-[22px] shrink-0 items-center rounded-lg bg-R-10 px-2 text-[11px] font-bold text-R-300">
            پاسخ هماکام
          </span>
          <p class="text-[12.5px] leading-[19px] text-T-700">{{ item.answer }}</p>
        </div>
      </article>
    </div>
  </section>
</template>
