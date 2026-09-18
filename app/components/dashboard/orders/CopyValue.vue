<script setup lang="ts">
import { IconCheck, IconCopy } from '@tabler/icons-vue'
import { toast } from 'vue-sonner'

const props = withDefaults(defineProps<{
  value: string
  copyValue?: string
}>(), {
  copyValue: undefined,
})

const copied = ref(false)

async function copy() {
  try {
    await navigator.clipboard.writeText(props.copyValue ?? props.value)
    copied.value = true
    toast.success('کپی شد.')
    setTimeout(() => (copied.value = false), 1500)
  }
  catch {
    toast.error('کپی انجام نشد.')
  }
}
</script>

<template>
  <span class="inline-flex items-center gap-1.5">
    <span dir="ltr" class="font-bold text-T-900">{{ value }}</span>
    <button
      type="button"
      class="text-T-500 transition-colors hover:text-primary"
      aria-label="کپی"
      @click="copy"
    >
      <IconCheck v-if="copied" class="size-3.5 text-emerald-500" />
      <IconCopy v-else class="size-3.5" />
    </button>
  </span>
</template>
