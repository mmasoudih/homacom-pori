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

const inputClass = cn(
  'min-w-0 flex-1 bg-transparent text-center outline-none',
  typographyVariants({ size: 'lg', weight: 'medium', color: 'default' }),
)
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- از -->
    <div class="flex h-[38px] items-center gap-2 border-b border-T-400">
      <UiTypography as="span" size="md" weight="regular" color="subtle" class="shrink-0">
        از
      </UiTypography>
      <input
        :value="formatPriceFa(from)"
        type="text"
        name="price-from"
        inputmode="numeric"
        :class="inputClass"
        @input="commit(0, ($event.target as HTMLInputElement).value)"
      >
      <UiTypography as="span" size="md" weight="regular" color="subtle" class="shrink-0">
        تومان
      </UiTypography>
    </div>

    <!-- تا -->
    <div class="flex h-[38px] items-center gap-2 border-b border-T-400">
      <UiTypography as="span" size="md" weight="regular" color="subtle" class="shrink-0">
        تا
      </UiTypography>
      <input
        :value="formatPriceFa(to)"
        type="text"
        name="price-to"
        inputmode="numeric"
        :class="inputClass"
        @input="commit(1, ($event.target as HTMLInputElement).value)"
      >
      <UiTypography as="span" size="md" weight="regular" color="subtle" class="shrink-0">
        تومان
      </UiTypography>
    </div>

    <UiSlider
      class="mt-2"
      :model-value="modelValue"
      :min="min"
      :max="max"
      :step="step"
      :thumbs="2"
      :min-steps-between-thumbs="1"
      @update:model-value="onSlider"
    />

    <!-- Labels sit under the track: cheapest on the left, priciest on the right. -->
    <div class="flex items-center justify-between">
      <UiTypography as="span" size="sm" weight="regular" color="subtle">
        گران‌ترین
      </UiTypography>
      <UiTypography as="span" size="sm" weight="regular" color="subtle">
        ارزان‌ترین
      </UiTypography>
    </div>
  </div>
</template>
