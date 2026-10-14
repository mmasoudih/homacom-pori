<script setup lang="ts">
import { IconX } from '@tabler/icons-vue'
import type { SearchFilterChip } from '~/composables/useSearchFilters'

defineProps<{
  chips: SearchFilterChip[]
}>()

const emit = defineEmits<{
  remove: [key: string]
}>()
</script>

<template>
  <div v-if="chips.length" class="flex flex-wrap gap-2">
    <button
      v-for="chip in chips"
      :key="chip.key"
      type="button"
      class="inline-flex h-[26px] max-w-full items-center gap-1.5 rounded-full border border-T-400 bg-T-200 px-3 text-T-600 transition-colors hover:border-T-500"
      @click="emit('remove', chip.key)"
    >
      <UiTypography as="span" size="md" weight="medium" color="subtle" class="truncate">
        {{ chip.label }}
      </UiTypography>
      <IconX class="size-3.5 shrink-0" />
    </button>
  </div>
</template>
