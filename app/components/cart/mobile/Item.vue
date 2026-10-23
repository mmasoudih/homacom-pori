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
  <article class="flex flex-col gap-5 border-t border-T-400 px-[18px] py-5">
    <!-- Details at the start (right in RTL), thumbnail + stepper at the end. -->
    <div class="flex gap-3">
      <div class="flex min-w-0 flex-1 flex-col gap-3">
        <NuxtLink :to="item.href" class="line-clamp-2 text-[12.5px] leading-[18px]">
          <UiTypography as="span" size="md" class="leading-[18px]">
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

        <CartPrice
          class="self-start"
          size="md"
          :price="item.price"
          :old-price="item.oldPrice"
          :discount="item.discount"
        />
      </div>

      <div class="flex w-[100px] shrink-0 flex-col items-center gap-2.5">
        <NuxtLink
          :to="item.href"
          class="size-[100px] overflow-hidden rounded-[8px]"
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
          class="flex h-[29px] w-[100px] items-center justify-center gap-1 rounded-[8px] bg-[#EAECFF] text-[#5A6AFF]"
        >
          <UiTypography as="span" size="md" weight="semibold" leading="none" class="text-[#5A6AFF]">
            اقساطی
          </UiTypography>
          <img src="/icons/cart/coins-blue.svg" alt="" class="size-[15px] shrink-0">
        </div>

        <CartQtyStepper
          size="mobile"
          :quantity="item.quantity"
          :min-quantity="item.minQuantity"
          :max-quantity="item.maxQuantity"
          @increment="emit('increment')"
          @decrement="emit('decrement')"
          @remove="emit('remove')"
        />
      </div>
    </div>

    <!-- Insurance -->
    <div class="flex flex-col gap-2">
      <div v-if="!item.insurance" class="flex h-[25px] items-center justify-between gap-2.5">
        <UiTypography as="span" size="md" weight="semibold">بیمه:</UiTypography>

        <button
          type="button"
          class="flex items-center gap-1 text-R-300"
          @click="emit('addInsurance')"
        >
          <img src="/icons/cart/plus-red.svg" alt="" class="size-[11px] shrink-0">
          <UiTypography as="span" size="xs" weight="medium" color="primary">افزودن بیمه</UiTypography>
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
