<script setup lang="ts">
import { IconChevronDown, IconCircleCheck } from '@tabler/icons-vue'
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  title?: string
  body?: string
  class?: string
}>(), {
  title: 'فروشگاه اینترنتی هماکام',
  class: '',
  body:
    'مرجعی بزرگ و معتبر برای خرید انواع لوازم دیجیتال و غیردیجیتال مورد نیاز شماست. با ورود به فروشگاه آنلاین هماکام، کلیه لوازم مورد نیاز خود نظیر گجت‌ها، موبایل و لپ‌تاپ، لوازم خانگی برقی و غیربرقی و لوازم جانبی را به سادگی و با خیال راحت تهیه کنید.',
})

const expanded = ref(false)
</script>

<template>
  <section :class="cn('w-full bg-T-100', props.class)">
    <div class="mx-auto flex max-w-[1260px] flex-col items-center px-4 py-10 lg:py-14">
      <div class="flex w-full flex-col items-center gap-4 lg:flex-row lg:items-start lg:gap-8">
        <h2 class="shrink-0 text-[18px] font-bold leading-[28px] text-foreground lg:pt-0.5">
          {{ title }}
        </h2>

        <div class="flex min-w-0 flex-1 flex-col items-center gap-4 lg:items-start">
          <p
            class="max-w-[760px] text-center text-[14px] leading-[26px] text-T-700 transition-all duration-300 lg:text-start"
            :class="expanded ? '' : 'line-clamp-2 lg:line-clamp-3'"
          >
            {{ body }}
          </p>

          <button
            class="flex items-center gap-1.5 text-[14px] font-semibold text-primary transition-opacity hover:opacity-80"
            @click="expanded = !expanded"
          >
            <IconCircleCheck class="size-[18px]" />
            {{ expanded ? 'نمایش کمتر' : 'نمایش بیشتر' }}
            <IconChevronDown
              class="size-4 transition-transform duration-200"
              :class="expanded ? 'rotate-180' : ''"
            />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>