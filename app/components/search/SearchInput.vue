<script setup lang="ts">
import { IconX } from '@tabler/icons-vue'
import { cn } from '~/lib/utils'
import { typographyVariants } from '~/components/ui/typography'

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    /** Render the magnifier icon at the trailing edge (desktop header style). */
    icon?: boolean
    class?: string
  }>(),
  {
    placeholder: 'جستجو در محصولات ...',
    icon: true,
    class: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  submit: [value: string]
  clear: []
  escape: []
  focus: []
}>()

const inputEl = ref<HTMLInputElement | null>(null)

const showClear = computed(() => props.modelValue.length > 0)

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault()
    emit('submit', props.modelValue)
  }
  else if (event.key === 'Escape') {
    emit('escape')
  }
}

function clear() {
  emit('update:modelValue', '')
  emit('clear')
  inputEl.value?.focus()
}

defineExpose({ focus: () => inputEl.value?.focus() })
</script>

<template>
  <div
    :class="cn(
      'flex h-11 w-full items-center gap-2 rounded-full border border-T-300 bg-T-200 px-4 transition-colors focus-within:border-T-500',
      props.class,
    )"
  >
    <input
      ref="inputEl"
      :value="modelValue"
      :placeholder="placeholder"
      type="text"
      inputmode="search"
      autocomplete="off"
      enterkeyhint="search"
      :class="cn(
        'w-full bg-transparent text-start text-foreground outline-none placeholder:text-T-600',
        typographyVariants({ size: 'lg', weight: 'regular' }),
      )"
      @input="onInput"
      @keydown="onKeydown"
      @focus="emit('focus')"
    >

    <button
      v-if="showClear"
      type="button"
      class="flex size-5 shrink-0 items-center justify-center rounded-full text-T-600 transition-colors hover:text-T-900"
      aria-label="پاک کردن جستجو"
      @click="clear"
    >
      <IconX class="size-4" />
    </button>

    <span
      v-if="icon && !showClear"
      class="size-5 shrink-0 bg-T-800 [mask-image:url(/icons/search.svg)] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
      aria-hidden="true"
    />
  </div>
</template>
