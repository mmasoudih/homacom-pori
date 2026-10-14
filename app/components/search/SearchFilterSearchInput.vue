<script setup lang="ts">
import { cn } from '~/lib/utils'
import { typographyVariants } from '~/components/ui/typography'

withDefaults(defineProps<{
  modelValue: string
  placeholder: string
  /** Form-field name (keeps the input identifiable to assistive tech / DevTools). */
  name?: string
}>(), {
  name: 'filter-search',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="flex h-[35px] items-center gap-2 rounded-[12px] border border-T-300 bg-T-200 px-4">
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="shrink-0"
      aria-hidden="true"
    >
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12.8169 13.1621C11.6066 14.1913 10.0384 14.8124 8.3252 14.8124C4.49372 14.8124 1.3877 11.7064 1.3877 7.87488C1.3877 4.0434 4.49372 0.937378 8.3252 0.937378C12.1567 0.937378 15.2627 4.0434 15.2627 7.87488C15.2627 9.58812 14.6417 11.1563 13.6124 12.3666L17.3479 16.1021C17.5676 16.3218 17.5676 16.678 17.3479 16.8976C17.1283 17.1173 16.7721 17.1173 16.5524 16.8976L12.8169 13.1621ZM2.5127 7.87488C2.5127 4.66472 5.11504 2.06238 8.3252 2.06238C11.5354 2.06238 14.1377 4.66472 14.1377 7.87488C14.1377 9.44165 13.5178 10.8636 12.5099 11.9089C12.4808 11.9287 12.4532 11.9514 12.4274 11.9771C12.4017 12.0029 12.379 12.0305 12.3593 12.0596C11.3139 13.0675 9.89196 13.6874 8.3252 13.6874C5.11504 13.6874 2.5127 11.085 2.5127 7.87488Z" fill="#9CA3AF" />
    </svg>
    <input
      :value="modelValue"
      :name="name"
      :placeholder="placeholder"
      type="text"
      autocomplete="off"
      :class="cn(
        'w-full bg-transparent text-start outline-none placeholder:text-T-600',
        typographyVariants({ size: 'md', weight: 'regular', color: 'subtle' }),
      )"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
  </div>
</template>
