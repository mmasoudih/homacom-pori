<script setup lang="ts">
defineEmits<{
  close: []
}>()
</script>

<template>
  <!-- Starts at the panel's top edge and sits above the header (z-60) so it
       covers the circle strip while keeping the top header rows interactive. -->
  <div
    class="fixed inset-x-0 bottom-0 z-[70] bg-black/35 backdrop-blur-[10px]"
    style="top: var(--mega-panel-top, 142px)"
    aria-hidden="true"
    @click="$emit('close')"
  />
</template>