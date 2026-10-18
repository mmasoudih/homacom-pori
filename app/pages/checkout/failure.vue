<script lang="ts" setup>
import { fallbackCheckoutResult } from '~/data/checkout'

const { result } = useCheckoutResult()
const receipt = computed(() => result.value ?? fallbackCheckoutResult)

useHead({ title: 'پرداخت ناموفق | هماکام' })
</script>

<template>
  <CheckoutResultCard status="failure" :result="receipt" />
</template>
