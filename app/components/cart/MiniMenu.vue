<script setup lang="ts">
import { formatPriceFa } from '~/utils/format'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const {
  items,
  count,
  isEmpty,
  payableTotal,
  increment,
  decrement,
  removeItem,
} = useCart()

function close() {
  emit('update:open', false)
}

function goCheckout() {
  if (isEmpty.value) return
  close()
  navigateTo('/checkout')
}
</script>

<template>
  <!-- Desktop dropdown anchored under the header cart button (Figma «MInicart»). -->
  <div
    v-if="open"
    class="absolute left-0 top-[calc(100%+16px)] z-[61] hidden w-[551px] flex-col overflow-hidden rounded-[20px] bg-T-50 shadow-[0_4px_20px_rgba(0,0,0,0.15),0_0_4px_rgba(0,0,0,0.03)] lg:flex"
  >
    <!-- Header -->
    <div class="flex h-[75px] shrink-0 items-center justify-between gap-4 border-b border-T-400 px-6">
      <div class="flex items-baseline gap-2.5">
        <UiTypography as="p" size="2xl" weight="bold" class="leading-[26px]">سبدخرید</UiTypography>
        <UiTypography as="span" size="md" color="muted" class="leading-[18px]">
          (<UiTypography as="span" size="md" weight="semibold" class="text-T-900">{{ toPersianDigits(count) }}</UiTypography>
          کالا)
        </UiTypography>
      </div>

      <NuxtLink
        to="/cart"
        class="flex items-center gap-1 text-R-300"
        @click="close"
      >
        <UiTypography as="span" size="md" weight="bold" color="primary" class="leading-[18px]">مشاهده سبد خرید</UiTypography>
        <img src="/icons/cart/angle-left.svg" alt="" class="size-3.5">
      </NuxtLink>
    </div>

    <!-- Items -->
    <div v-if="!isEmpty" class="scrollbar-thin flex max-h-[439px] flex-col overflow-y-auto px-6">
      <article
        v-for="item in items"
        :key="item.id"
        class="flex gap-5 border-b border-T-400 py-5 last:border-b-0"
      >
        <div class="flex min-w-0 flex-1 flex-col gap-3">
          <NuxtLink :to="item.href" class="line-clamp-2 text-[16px] leading-[23px]" @click="close">
            <UiTypography as="span" size="xl" weight="medium" class="leading-[23px]">{{ item.title }}</UiTypography>
          </NuxtLink>

          <CartItemMeta
            class="self-start"
            :color="item.color"
            :size="item.size"
            :warranty="item.warranty"
            :installment="item.installment"
            :seller="item.sellerName"
          />

          <div class="flex items-center justify-between gap-4">
            <CartQtyStepper
              :quantity="item.quantity"
              :max-quantity="item.maxQuantity"
              @increment="increment(item.id)"
              @decrement="decrement(item.id)"
              @remove="removeItem(item.id)"
            />

            <CartPrice
              size="mini"
              :price="item.price"
              :old-price="item.oldPrice"
              :discount="item.discount"
            />
          </div>
        </div>

        <NuxtLink
          :to="item.href"
          class="size-[100px] shrink-0 overflow-hidden rounded-[8px]"
          :aria-label="item.title"
          @click="close"
        >
          <ProductImage
            :src="item.image"
            :alt="item.title"
            container-class="size-full rounded-[8px] bg-T-100"
          />
        </NuxtLink>
      </article>
    </div>

    <!-- Empty -->
    <div v-else class="flex flex-col items-center gap-5 px-10 py-12">
      <img src="/icons/cart/empty-bag-sm.svg" alt="" class="size-[42px]">

      <div class="flex flex-col items-center gap-2 text-center">
        <UiTypography as="p" size="xl" weight="medium" class="leading-[23px]">سبد خرید شما خالی است!</UiTypography>
        <UiTypography as="p" size="md" color="muted" class="max-w-[351px] leading-[18px]">
          هنوز کالایی به سبد خود اضافه نکرده‌اید. هزاران محصول با گارانتی معتبر و ارسال سریع منتظر شماست؛ از جدیدترین تخفیف‌ها جا نمانید.
        </UiTypography>
      </div>
    </div>

    <!-- Footer -->
    <div
      v-if="!isEmpty"
      class="flex shrink-0 items-center justify-between gap-4 px-6 py-5 shadow-[0_-3px_12px_rgba(0,0,0,0.08)]"
    >
      <div class="flex flex-col gap-0.5">
        <UiTypography as="span" size="md" weight="semibold" color="subtle" class="leading-[18px]">مبلغ کل:</UiTypography>
        <div class="flex items-baseline gap-1.5">
          <UiTypography as="span" size="2xl" weight="semibold" class="leading-[26px]">
            {{ formatPriceFa(payableTotal) }}
          </UiTypography>
          <UiTypography as="span" size="sm" weight="semibold" leading="none" color="subtle" class="leading-[16px]">
            تومان
          </UiTypography>
        </div>
      </div>

      <button
        type="button"
        class="flex h-[42px] w-[175px] items-center justify-center rounded-[12px] bg-R-300 transition-colors hover:bg-R-400"
        @click="goCheckout"
      >
        <UiTypography as="span" size="lg" weight="bold" color="white" class="leading-[20px]">ثبت سفارش</UiTypography>
      </button>
    </div>
  </div>
</template>
