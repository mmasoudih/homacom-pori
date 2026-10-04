<script setup lang="ts">
import { IconArrowRight } from '@tabler/icons-vue'

const props = withDefaults(defineProps<{
  title: string
  align?: 'start' | 'center'
  backTo?: string
}>(), {
  align: 'center',
  backTo: '/dashboard/orders',
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
  <header class="sticky top-0 z-40 flex h-14 w-full shrink-0 items-center justify-between border-b border-T-300 bg-T-50 px-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
    <div v-if="align === 'start'" class="flex items-center gap-2">
      <button
        type="button"
        class="flex size-8 shrink-0 items-center justify-center text-T-900"
        aria-label="بازگشت"
        @click="goBack"
      >
        <IconArrowRight class="size-5" />
      </button>
      <slot name="action" />
      <UiTypography as="h1" size="xl" weight="bold">{{ title }}</UiTypography>
    </div>

    <template v-else>
      <div class="flex items-center gap-2">
        <slot name="action" />
      </div>

      <UiTypography
        as="h1"
        size="xl"
        weight="bold"
        class="pointer-events-none absolute inset-x-0 text-center"
      >
        {{ title }}
      </UiTypography>

      <button
        type="button"
        class="flex size-8 shrink-0 items-center justify-center text-T-900"
        aria-label="بازگشت"
        @click="goBack"
      >
        <IconArrowRight class="size-5" />
      </button>
    </template>
  </header>
</template>
