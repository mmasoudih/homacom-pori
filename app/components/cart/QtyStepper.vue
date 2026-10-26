<script setup lang="ts">
import { cn } from '~/lib/utils'
import { toPersianDigits } from '~/utils/format'

const props = withDefaults(
  defineProps<{
    quantity: number
    minQuantity?: number
    maxQuantity?: number
    size?: 'desktop' | 'mobile'
    class?: string
  }>(),
  { minQuantity: 1, maxQuantity: undefined, size: 'desktop', class: '' },
)

const emit = defineEmits<{
  increment: []
  decrement: []
  remove: []
}>()

const atMax = computed(
  () => props.maxQuantity != null && props.quantity >= props.maxQuantity,
)
const atMin = computed(() => props.quantity <= (props.minQuantity ?? 1))
/** The minus becomes a trash at the smallest allowed quantity. */
const canDecrement = computed(() => !atMin.value)
</script>

<template>
  <!-- Quantity pill: remove/minus (start), count, add (end) — laid out LTR like the design. -->
  <div
    dir="ltr"
    :class="
      cn(
        'flex shrink-0 items-center justify-between rounded-full border border-T-400',
        size === 'mobile' ? 'h-9 w-[100px] px-2.5' : 'h-10 w-[121px] px-[17px]',
        props.class,
      )
    "
  >
    <button
      type="button"
      class="flex size-[18px] items-center justify-center"
      :aria-label="canDecrement ? 'کاهش تعداد' : 'حذف کالا از سبد خرید'"
      @click="canDecrement ? emit('decrement') : emit('remove')"
    >
      <img
        v-if="canDecrement"
        src="/icons/cart/minus.svg"
        alt=""
        class="size-[18px]"
      >
      <img
        v-else
        src="/icons/cart/trash.svg"
        alt=""
        class="h-[16.125px] w-[14.625px]"
      >
    </button>

    <span class="flex flex-col items-center justify-center gap-0.5">
      <UiTypography as="span" size="xl" weight="medium" class="leading-[23px] text-T-900">
        {{ toPersianDigits(quantity) }}
      </UiTypography>
      <UiTypography
        v-if="atMax"
        as="span"
        size="xs"
        weight="semibold"
        color="subtle"
        class="leading-[16px]"
      >حداکثر</UiTypography>
    </span>

    <button
      type="button"
      class="flex size-[18px] items-center justify-center transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
      :disabled="atMax"
      aria-label="افزودن یک عدد"
      @click="emit('increment')"
    >
      <img src="/icons/cart/plus.svg" alt="" class="size-[13.5px]">
    </button>
  </div>
</template>
