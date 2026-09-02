<script setup lang="ts">
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'
import {
  IconBasket,
  IconPlus,
  IconMinus,
  IconBell,
} from '@tabler/icons-vue'
import type { ProductDetail } from '~/data/product'
import { formatPrice } from '~/utils/format'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    product: ProductDetail
    /** Extra price added by selected services/insurance. */
    extraPrice?: number
    class?: string
  }>(),
  { extraPrice: 0, class: '' },
)

const emit = defineEmits<{
  'notify-me': []
}>()

const isAvailable = computed(() => props.product.stockStatus === 'available')

const added = ref(false)
const quantity = ref(1)

const discountPercent = computed(() =>
  props.product.oldPrice ? props.product.price - props.product.oldPrice : 0,
)
const total = computed(() => props.product.price + props.extraPrice)

function addToCart() {
  added.value = true
  toast.success('کالا به سبد خرید اضافه شد.')
}

function increment() {
  quantity.value += 1
}

function decrement() {
  if (quantity.value > 1) {
    quantity.value -= 1
  }
  else {
    added.value = false
    toast.success('کالا از سبد خرید حذف شد.')
  }
}

function notifyMe() {
  emit('notify-me')
}
</script>

<template>
  <!-- Out of stock: notify bar -->
  <div
    v-if="!isAvailable"
    :class="cn(
      'fixed inset-x-0 bottom-0 z-40 border-t border-T-300 bg-T-50/95 px-4 pb-[calc(12px+env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden',
      props.class,
    )"
  >
    <button
      type="button"
      class="flex h-[42px] w-full items-center justify-center gap-2 rounded-xl border border-R-300 text-[13.5px] font-medium text-R-300"
      @click="notifyMe"
    >
      موجود شد خبرم کن
      <IconBell class="size-5" />
    </button>
  </div>

  <!-- Available: price + add to cart -->
  <div
    v-else
    :class="cn(
      'fixed inset-x-0 bottom-0 z-40 border-t border-T-300 bg-T-50/95 backdrop-blur lg:hidden',
      props.class,
    )"
  >
    <div class="flex items-center justify-between px-4 pb-[calc(10px+env(safe-area-inset-bottom))] pt-2.5">
      <!-- Price stack -->
      <div class="flex flex-col gap-0.5">
        <div v-if="product.oldPrice" class="flex items-center gap-2">
          <span class="text-[12px] text-T-600 line-through">{{ formatPrice(product.oldPrice) }}</span>
          <span
            v-if="discountPercent > 0"
            class="flex h-[21px] items-center rounded-full bg-R-300 px-2 text-[10.5px] font-extrabold text-white"
          >
            ٪{{ discountPercent }}
          </span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-[15px] font-extrabold text-T-900">{{ formatPrice(total) }}</span>
          <span class="text-[11px] text-T-700">تومان</span>
        </div>
      </div>

      <!-- Add button / quantity stepper -->
      <button
        v-if="!added"
        type="button"
        class="flex h-[41px] w-[167px] items-center justify-center gap-2 rounded-xl bg-R-300 text-[13px] font-bold text-white"
        @click="addToCart"
      >
        افزودن به سبد
      </button>

      <div
        v-else
        class="flex h-[40px] w-[134px] items-center justify-between rounded-full border border-T-400 px-4"
      >
        <button
          type="button"
          class="flex size-6 items-center justify-center text-T-900"
          aria-label="افزودن تعداد"
          @click="increment"
        >
          <IconPlus class="size-4.5" />
        </button>
        <span class="text-[14px] font-bold text-T-900">{{ quantity }}</span>
        <button
          v-if="quantity > 1"
          type="button"
          class="flex size-6 items-center justify-center text-T-900"
          aria-label="کاهش تعداد"
          @click="decrement"
        >
          <IconMinus class="size-4.5" />
        </button>
        <button
          v-else
          type="button"
          class="flex size-6 items-center justify-center text-R-300"
          aria-label="حذف از سبد"
          @click="decrement"
        >
          <IconBasket class="size-5" />
        </button>
      </div>
    </div>
  </div>
</template>
