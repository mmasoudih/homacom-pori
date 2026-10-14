<script setup lang="ts">
import { typographyVariants } from '~/components/ui/typography'
import { cn } from '~/lib/utils'
import { formatPriceFa, toEnglishDigits } from '~/utils/format'

const props = withDefaults(defineProps<{
  /** `[from, to]` in تومان. */
  modelValue: number[]
  min: number
  max: number
  step?: number
}>(), {
  step: 1000000,
})

const emit = defineEmits<{
  'update:modelValue': [value: number[]]
}>()

const from = computed(() => props.modelValue[0] ?? props.min)
const to = computed(() => props.modelValue[1] ?? props.max)

function onSlider(value?: number[]) {
  const list = value ?? []
  emit('update:modelValue', [list[0] ?? from.value, list[1] ?? to.value])
}

function commit(index: 0 | 1, raw: string) {
  const parsed = Number(toEnglishDigits(raw).replace(/[^\d]/g, ''))
  const next: number[] = [from.value, to.value]
  if (Number.isFinite(parsed)) {
    next[index] = Math.min(props.max, Math.max(props.min, parsed))
  }
  if (next[0]! > next[1]!) {
    if (index === 0) next[0] = next[1]!
    else next[1] = next[0]!
  }
  emit('update:modelValue', next)
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <UiSlider
      :model-value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      :thumbs="2"
      :min-steps-between-thumbs="1"
      class="my-2"
      @update:model-value="onSlider"
    />

    <!-- از -->
    <div class="flex h-[42px] items-center gap-2 rounded-[12px] border border-T-400 px-4">
      <UiTypography as="span" size="md" weight="regular" color="subtle">از</UiTypography>
      <input
        :value="formatPriceFa(from)"
        type="text"
        name="price-from"
        inputmode="numeric"
        :class="cn(
          'min-w-0 flex-1 bg-transparent text-center outline-none',
          typographyVariants({ size: 'lg', weight: 'medium', color: 'default' }),
        )"
        @input="commit(0, ($event.target as HTMLInputElement).value)"
      >
      <UiTypography as="span" size="md" weight="regular" color="subtle">تومان</UiTypography>
    </div>

    <!-- تا -->
    <div class="flex h-[42px] items-center gap-2 rounded-[12px] border border-T-400 px-4">
      <UiTypography as="span" size="md" weight="regular" color="subtle">تا</UiTypography>
      <input
        :value="formatPriceFa(to)"
        type="text"
        name="price-to"
        inputmode="numeric"
        :class="cn(
          'min-w-0 flex-1 bg-transparent text-center outline-none',
          typographyVariants({ size: 'lg', weight: 'medium', color: 'default' }),
        )"
        @input="commit(1, ($event.target as HTMLInputElement).value)"
      >
      <UiTypography as="span" size="md" weight="regular" color="subtle">تومان</UiTypography>
    </div>
  </div>
</template>
