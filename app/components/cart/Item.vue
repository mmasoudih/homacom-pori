<script setup lang="ts">
import type { CartItem } from '~/data/cart'

defineProps<{
  item: CartItem
}>()

const emit = defineEmits<{
  increment: []
  decrement: []
  remove: []
  removeInsurance: []
  removeService: [serviceId: string]
  addService: []
  addInsurance: []
}>()
</script>

<template>
  <article class="flex flex-col gap-6 rounded-[12px] border border-T-400 bg-T-50 p-6">
    <!-- Main row: image at the start (right in RTL), details to its end. -->
    <div class="flex items-center gap-[30px]">
      <div class="flex w-[154px] shrink-0 flex-col gap-1.5">
        <NuxtLink
          :to="item.href"
          class="size-[154px] overflow-hidden rounded-[8px]"
          :aria-label="item.title"
        >
          <ProductImage
            :src="item.image"
            :alt="item.title"
            container-class="size-full rounded-[8px] bg-T-100"
          />
        </NuxtLink>

        <div
          v-if="item.installment"
          class="flex h-[29px] w-[154px] items-center justify-center gap-1 rounded-[8px] bg-[#EAECFF] text-[#5A6AFF]"
        >
          <UiTypography as="span" size="md" weight="semibold" leading="none" class="text-[#5A6AFF]">
            اقساطی
          </UiTypography>
          <img src="/icons/cart/coins-blue.svg" alt="" class="size-[15px] shrink-0">
        </div>
      </div>

      <div class="flex min-w-0 flex-1 flex-col gap-3">
        <NuxtLink
          :to="item.href"
          class="line-clamp-2 text-[14px] leading-5 transition-colors hover:text-R-300"
        >
          <UiTypography as="span" size="lg" weight="medium" class="leading-5">
            {{ item.title }}
          </UiTypography>
        </NuxtLink>

        <CartItemMeta
          class="self-start"
          :color="item.color"
          :warranty="item.warranty"
          :installment="item.installment"
          :seller="item.sellerName"
        />

        <div class="flex flex-wrap items-center gap-x-8 gap-y-3 self-start">
          <div class="flex items-center gap-2">
            <CartQtyStepper
              :quantity="item.quantity"
              :max-quantity="item.maxQuantity"
              @increment="emit('increment')"
              @decrement="emit('decrement')"
              @remove="emit('remove')"
            />
          </div>

          <CartPrice
            size="lg"
            :price="item.price"
            :old-price="item.oldPrice"
            :discount="item.discount"
          />
        </div>
      </div>
    </div>

    <!-- Insurance -->
    <div class="flex flex-col gap-2">
      <div class="flex h-[25px] items-center justify-between gap-2.5">
        <UiTypography as="span" size="lg" weight="semibold">بیمه:</UiTypography>

        <button
          v-if="!item.insurance"
          type="button"
          class="flex items-center gap-1 text-R-300"
          @click="emit('addInsurance')"
        >
          <img src="/icons/cart/plus-red.svg" alt="" class="size-[11px] shrink-0">
          <UiTypography as="span" size="md" weight="medium" color="primary">افزودن بیمه</UiTypography>
        </button>
      </div>

      <CartInsuranceNote
        v-if="item.insurance"
        :insurance="item.insurance"
        @remove="emit('removeInsurance')"
      />
      <CartInsuranceEmpty v-else />
    </div>

    <!-- Services & accessories -->
    <CartServices
      :services="item.services"
      @add="emit('addService')"
      @remove="emit('removeService', $event)"
    />
  </article>
</template>
