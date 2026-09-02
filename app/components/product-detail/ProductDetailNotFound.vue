<script setup lang="ts">
import { IconSearchOff } from '@tabler/icons-vue'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{ class?: string }>(),
  { class: '' },
)
</script>

<template>
  <div
    :class="cn(
      'flex min-h-[420px] w-full flex-col items-center justify-center gap-4 rounded-2xl border border-T-300 bg-T-50 p-10 text-center',
      props.class,
    )"
  >
    <span class="flex size-20 items-center justify-center rounded-3xl bg-T-200 text-T-600">
      <IconSearchOff class="size-9" stroke-width="1.5" />
    </span>
    <h1 class="text-[16px] font-bold text-T-900">کالای مورد نظر یافت نشد</h1>
    <p class="max-w-[360px] text-[12.5px] leading-[22px] text-T-700">
      متاسفانه کالایی که به دنبال آن هستید در فروشگاه هماکام موجود نیست یا حذف شده است.
    </p>
    <NuxtLink
      to="/"
      class="mt-2 flex h-[42px] items-center justify-center rounded-xl bg-R-300 px-6 text-[13px] font-bold text-white transition-colors hover:bg-R-400"
    >
      بازگشت به صفحه اصلی
    </NuxtLink>
  </div>
</template>
