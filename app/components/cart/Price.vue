<script setup lang="ts">
import { cn } from '~/lib/utils'
import { toPersianDigits } from '~/utils/format'

const props = withDefaults(
  defineProps<{
    price: number
    oldPrice?: number
    discount?: number
    /**
     * `lg` desktop item row (18px), `xl` recently-viewed card (16px),
     * `mini` mini-cart row (16px price, 14px old price), `md` mobile item
     * card (14px), `sm` insurance line (12.5px).
     */
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'mini'
    class?: string
  }>(),
  { oldPrice: undefined, discount: undefined, size: 'md', class: '' },
)

const showOld = computed(
  () => props.oldPrice != null && props.oldPrice > props.price,
)
const showDiscount = computed(() => props.discount != null && props.discount > 0)

const currentSize = computed(() =>
  props.size === 'lg'
    ? '2xl'
    : props.size === 'xl' || props.size === 'mini'
      ? 'xl'
      : props.size === 'md'
        ? 'lg'
        : 'md',
)

/** Unit weight follows the design: semibold everywhere but the insurance line. */
const currentLeading = computed(() => {
  if (props.size === 'lg') return 'leading-[26px]'
  if (props.size === 'xl' || props.size === 'mini') return 'leading-[23px]'
  if (props.size === 'md') return 'leading-[20px]'
  return 'leading-[18px]'
})

const unitSize = computed(() => (props.size === 'lg' ? 'md' : 'sm'))
const unitWeight = computed(() => (props.size === 'sm' ? 'medium' : 'semibold'))

const oldSize = computed(() =>
  props.size === 'lg' ? 'lg' : props.size === 'xl' ? 'xl' : props.size === 'mini' ? 'lg' : 'md',
)

const oldLeading = computed(() => {
  if (props.size === 'xl') return 'leading-[23px]'
  if (props.size === 'lg' || props.size === 'mini') return 'leading-[20px]'
  return 'leading-[18px]'
})

const badgeSize = computed(() => (props.size === 'sm' ? 'xs' : 'md'))

const badgeClass = computed(() => {
  if (props.size === 'lg') return 'h-[22px] px-2'
  if (props.size === 'xl') return 'h-[25px] px-2.5'
  if (props.size === 'mini') return 'h-[22px] px-2'
  if (props.size === 'md') return 'h-[21px] px-2'
  return 'h-[20px] px-1.5'
})
</script>

<template>
  <!-- RTL order: current price, unit, discount badge, struck-through old price. -->
  <div :class="cn('flex items-center gap-1.5', props.class)">
    <UiTypography
      as="span"
      :size="currentSize"
      weight="medium"
      :class="cn('text-T-900', currentLeading)"
    >
      {{ formatPriceFa(price) }}
    </UiTypography>

    <UiTypography
      as="span"
      :size="unitSize"
      :weight="unitWeight"
      leading="none"
      color="subtle"
      class="leading-[16px]"
    >
      تومان
    </UiTypography>

    <UiTypography
      v-if="showDiscount"
      as="span"
      :size="badgeSize"
      weight="bold"
      color="white"
      leading="none"
      :class="
        cn(
          'flex shrink-0 items-center justify-center rounded-[16px] bg-R-300',
          badgeClass,
        )
      "
    >
      %{{ toPersianDigits(discount!) }}
    </UiTypography>

    <UiTypography
      v-if="showOld"
      as="span"
      :size="oldSize"
      weight="medium"
      color="subtle"
      :class="cn('line-through', oldLeading)"
    >
      {{ formatPriceFa(oldPrice!) }}
    </UiTypography>
  </div>
</template>
