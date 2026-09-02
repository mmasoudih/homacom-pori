<script setup lang="ts">
import {
  IconDotsVertical,
  IconShoppingBag,
  IconSearch,
  IconX,
} from '@tabler/icons-vue'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{ class?: string }>(),
  { class: '' },
)

const emit = defineEmits<{
  back: []
}>()
</script>

<template>
  <header
    :class="cn(
      'sticky top-0 z-40 flex h-12 w-full items-center justify-between border-b border-T-300 bg-T-50/95 px-4 backdrop-blur lg:hidden',
      props.class,
    )"
  >
    <div class="flex items-center gap-5 text-T-900">
      <button type="button" class="flex size-8 items-center justify-center" aria-label="گزینه‌های بیشتر">
        <IconDotsVertical class="size-5" />
      </button>
      <button type="button" class="flex size-8 items-center justify-center" aria-label="سبد خرید">
        <IconShoppingBag class="size-5" />
      </button>
      <button type="button" class="flex size-8 items-center justify-center" aria-label="جستجو">
        <IconSearch class="size-5" />
      </button>
    </div>

    <button
      type="button"
      class="flex size-8 items-center justify-center text-T-900"
      aria-label="بازگشت"
      @click="emit('back')"
    >
      <IconX class="size-5" />
    </button>
  </header>
</template>
