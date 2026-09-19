<script setup lang="ts">
import type { OrderItem } from '~/data/orders'
import { Checkbox } from '@/components/ui/checkbox'

defineProps<{
  item: OrderItem
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <label class="flex cursor-pointer items-center gap-3 border-b border-T-300 py-4 last:border-b-0">
    <Checkbox
      :model-value="modelValue"
      class="size-5 rounded-md"
      @update:model-value="emit('update:modelValue', $event)"
    />
    <ProductImage
      :src="item.image"
      :alt="item.title"
      container-class="size-14 shrink-0 rounded-xl bg-transparent"
    />
    <span class="min-w-0 flex-1 text-[12.5px] leading-[22px] text-T-800">
      {{ item.title }}
    </span>
  </label>
</template>
