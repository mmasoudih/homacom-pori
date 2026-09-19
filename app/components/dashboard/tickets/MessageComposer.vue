<script setup lang="ts">
import { IconArrowLeft, IconPaperclip } from '@tabler/icons-vue'

const emit = defineEmits<{
  send: [text: string]
  attach: []
}>()

const text = ref('')

function submit() {
  const value = text.value.trim()
  if (!value) return
  emit('send', value)
  text.value = ''
}
</script>

<template>
  <div class="flex items-center gap-3">
    <div class="flex h-12 flex-1 items-center gap-3 rounded-xl border border-T-400 px-3 focus-within:border-primary">
      <button
        type="button"
        class="flex size-8 shrink-0 items-center justify-center rounded-lg text-T-500 transition-colors hover:bg-T-100 hover:text-T-800"
        aria-label="پیوست فایل"
        @click="emit('attach')"
      >
        <IconPaperclip class="size-5" />
      </button>
      <input
        v-model="text"
        type="text"
        placeholder="نوشتن پیام..."
        class="min-w-0 flex-1 bg-transparent text-[13px] text-T-900 outline-none placeholder:text-T-500"
        @keyup.enter="submit"
      >
    </div>

    <button
      type="button"
      class="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary/90"
      aria-label="ارسال پیام"
      @click="submit"
    >
      <IconArrowLeft class="size-5" />
    </button>
  </div>
</template>
