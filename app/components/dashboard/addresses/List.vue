<script setup lang="ts">
import type { Address } from '~/data/addresses'

defineProps<{
  addresses: Address[]
}>()

const emit = defineEmits<{
  remove: [id: string]
}>()
</script>

<template>
  <div class="flex flex-col gap-4">
    <DashboardAddressesCard
      v-for="address in addresses"
      :key="address.id"
      :address="address"
      @remove="emit('remove', $event)"
    />
  </div>
</template>
