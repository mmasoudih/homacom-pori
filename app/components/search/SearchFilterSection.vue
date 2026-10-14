<script setup lang="ts">
import { IconChevronDown } from '@tabler/icons-vue'

const props = withDefaults(defineProps<{
  title: string
  /** Initial open state (desktop expands by default, mobile stays collapsed). */
  defaultOpen?: boolean
}>(), {
  defaultOpen: false,
})

const open = ref(props.defaultOpen)

// Reset to the initial state whenever the design variant changes.
watch(() => props.defaultOpen, (value) => {
  open.value = value
})
</script>

<template>
  <section class="min-w-0">
    <button
      type="button"
      class="flex w-full items-center justify-between gap-4 px-[calc(1.25rem_-_1px)] py-4 text-start"
      :aria-expanded="open"
      @click="open = !open"
    >
      <UiTypography as="h3" size="lg" weight="regular" color="default">
        {{ title }}
      </UiTypography>
      <IconChevronDown
        class="size-5 shrink-0 text-T-500 transition-transform duration-300"
        :class="open && 'rotate-180'"
      />
    </button>

    <div
      class="grid transition-[grid-template-rows] duration-300 ease-out"
      :class="open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      :inert="!open"
      :aria-hidden="!open"
    >
      <div class="min-h-0 overflow-hidden">
        <div class="px-[calc(1.25rem_-_1px)] pb-5">
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>
