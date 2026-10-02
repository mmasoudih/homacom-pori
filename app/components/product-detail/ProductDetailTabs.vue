<script setup lang="ts">
import { cn } from '~/lib/utils'

type ProductDetailTab = 'review' | 'specs' | 'comments'

const props = withDefaults(
  defineProps<{
    active: ProductDetailTab
    class?: string
  }>(),
  { class: '' },
)

const emit = defineEmits<{
  change: [id: ProductDetailTab]
}>()

const tabs: Array<{ id: ProductDetailTab, label: string }> = [
  { id: 'review', label: 'نقد و بررسی' },
  { id: 'specs', label: 'مشخصات فنی' },
  { id: 'comments', label: 'دیدگاه کاربران' },
]
</script>

<template>
  <div :class="cn('flex w-full items-center gap-7 border-b border-T-300', props.class)">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      type="button"
      class="relative pb-3 text-[14px] transition-colors"
      :class="active === tab.id ? 'font-bold text-R-300' : 'text-T-700 hover:text-T-900'"
      :aria-current="active === tab.id ? 'true' : undefined"
      @click="emit('change', tab.id)"
    >
      {{ tab.label }}
      <span
        v-if="active === tab.id"
        class="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-R-300"
      />
    </button>
  </div>
</template>
