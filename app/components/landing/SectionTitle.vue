<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="flex items-center justify-center gap-2.5">
    <span class="flex flex-col gap-0.5 leading-none">
      <span class="block h-1.5 w-1.5 rounded-full bg-primary" />
      <span class="block h-1.5 w-1.5 rounded-full bg-primary opacity-25" />
    </span>
    <h2 class="text-xl font-bold text-foreground md:text-2xl">
      {{ title }}
    </h2>
    <span class="flex flex-col gap-0.5 leading-none">
      <span class="block h-1.5 w-1.5 rounded-full bg-primary opacity-25" />
      <span class="block h-1.5 w-1.5 rounded-full bg-primary" />
    </span>
  </div>
</template>
