<script setup lang="ts">
import { IconPencil, IconPlus } from '@tabler/icons-vue'

defineProps<{
  label: string
  value?: string
  add?: boolean
  ltr?: boolean
}>()

const emit = defineEmits<{
  edit: []
}>()
</script>

<template>
  <div class="flex items-center gap-3 border-b border-T-300 px-4 py-3">
    <div class="flex min-w-0 flex-1 flex-col gap-1">
      <span class="text-[12px] text-T-600">{{ label }}</span>
      <span v-if="value" class="truncate text-[13.5px] font-bold text-T-900" :dir="ltr ? 'ltr' : undefined">{{ value }}</span>
    </div>

    <button
      type="button"
      class="flex size-5 shrink-0 items-center justify-center text-primary"
      :aria-label="label"
      @click="emit('edit')"
    >
      <IconPlus v-if="add" class="size-5" />
      <IconPencil v-else class="size-4" />
    </button>
  </div>
</template>
