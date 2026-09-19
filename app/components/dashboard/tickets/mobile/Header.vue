<script setup lang="ts">
import { IconArrowRight } from '@tabler/icons-vue'

const props = withDefaults(defineProps<{
  title: string
  backTo?: string
}>(), {
  backTo: '/dashboard/tickets',
})

const emit = defineEmits<{
  back: []
}>()

const router = useRouter()

function goBack() {
  emit('back')
  if (import.meta.client && window.history.length > 1) {
    router.back()
    return
  }
  router.push(props.backTo)
}
</script>

<template>
  <header class="sticky top-0 z-40 flex h-14 w-full shrink-0 items-center justify-between border-b border-T-300 bg-T-50 px-4">
    <div class="flex items-center gap-2">
      <button type="button" class="flex size-8 shrink-0 items-center justify-center text-T-900" aria-label="بازگشت" @click="goBack">
        <IconArrowRight class="size-5" />
      </button>
      <h1 class="text-[16px] font-bold text-T-900">{{ title }}</h1>
    </div>
    <div class="flex items-center gap-2">
      <slot name="action" />
    </div>
  </header>
</template>
