<script setup lang="ts">
import { IconChevronDown, IconUmbrella } from '@tabler/icons-vue'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{ class?: string }>(),
  { class: '' },
)
</script>

<template>
  <section
    :class="cn('flex w-full items-center justify-between gap-6 rounded-2xl bg-R-10 px-8 py-6', props.class)"
  >
    <div class="flex min-w-0 flex-1 flex-col gap-2">
      <h2 class="text-[15px] font-bold text-T-900">خدمات بیمه هماکام</h2>
      <p class="text-[12.5px] leading-[22px] text-T-800">
        هماکام برای اولین بار در ایران با همکاری شرکت‌های بیمه، سرویس <b class="text-R-300">خدمات پس از فروش</b> خود را ارائه می‌کند. هماکام این بیمه را به عنوان نماینده رسمی بیمه‌گر برای گوشی‌ها، تبلت‌ها، لپ‌تاپ‌ها و کنسول‌های بازی در قالب بسته‌های متنوع و با پوشش‌های کامل از قیمت مناسب به فروش می‌رساند؛ ضمن اینکه روند ارزیابی، تعیین خسارت و پرداخت غرامت توسط متخصصان هماکام در کوتاه‌ترین زمان ممکن و کاملا رایگان انجام می‌شود.
      </p>
      <button
        type="button"
        class="mt-1 flex w-fit items-center gap-1 text-[12.5px] font-bold text-R-300 transition-colors hover:text-R-400"
      >
        نمایش بیشتر
        <IconChevronDown class="size-4" />
      </button>
    </div>

    <span class="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-T-50 text-R-300">
      <IconUmbrella class="size-10" stroke-width="1.5" />
    </span>
  </section>
</template>
