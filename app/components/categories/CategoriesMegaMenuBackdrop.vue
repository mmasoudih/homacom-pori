<script setup lang="ts">
defineEmits<{
  close: []
}>()
</script>

<template>
  <div
    class="fixed inset-0 z-40 bg-black/35 backdrop-blur-[10px]"
    aria-hidden="true"
    @click="$emit('close')"
  />
</template>