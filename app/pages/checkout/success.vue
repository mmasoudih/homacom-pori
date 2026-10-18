<script lang="ts" setup>
import { fallbackCheckoutResult } from '~/data/checkout'

const { result } = useCheckoutResult()
const receipt = computed(() => result.value ?? fallbackCheckoutResult)

useHead({ title: 'پرداخت موفق | هماکام' })
</script>

<template>
  <CheckoutResultCard status="success" :result="receipt" />
</template>
