<script setup lang="ts">
import { typographyVariants } from '~/components/ui/typography'

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
  <div class="flex w-full items-center gap-3 bg-T-100 px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] lg:rounded-b-2xl lg:px-6 lg:py-5">
    <button
      type="button"
      class="flex size-12 shrink-0 items-center justify-center rounded-[12px] border border-T-300 bg-T-50 text-T-500 transition-colors hover:bg-T-100 hover:text-T-800"
      aria-label="پیوست فایل"
      @click="emit('attach')"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.1525 10.899L12.1369 19.9146C10.0866 21.9648 6.7625 21.9648 4.71225 19.9146C2.662 17.8643 2.662 14.5402 4.71225 12.4899L13.7279 3.47434C15.0947 2.10751 17.3108 2.10751 18.6776 3.47434C20.0444 4.84118 20.0444 7.05726 18.6776 8.42409L10.0156 17.0861C9.33213 17.7696 8.22409 17.7696 7.54068 17.0861C6.85726 16.4027 6.85726 15.2947 7.54068 14.6113L15.1421 7.00988" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <div class="flex h-12 flex-1 items-center gap-3 rounded-xl border border-T-400 bg-T-50 px-3 focus-within:border-primary">
      <input
        v-model="text"
        type="text"
        placeholder="نوشتن پیام..."
        :class="[
          'min-w-0 flex-1 bg-transparent outline-none placeholder:text-T-500 max-lg:text-[13px] max-lg:text-T-900',
          typographyVariants({ size: 'lg', weight: 'regular', color: 'muted' }),
        ]"
        @keyup.enter="submit"
      >
    </div>

    <button
      type="button"
      class="flex size-12 shrink-0 items-center justify-center rounded-[12px] bg-primary text-white transition-colors hover:bg-primary/90"
      aria-label="ارسال پیام"
      @click="submit"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.7275 5.06984C19.7256 2.68515 17.3066 0.154276 14.9128 1.33448L2.62257 7.39386C0.502989 8.43886 0.529161 11.5181 2.63409 12.5678L14.8491 18.6591C17.2679 19.8653 19.6805 17.305 18.6311 14.9119L16.8449 10.6613C16.8357 10.6406 16.827 10.6196 16.8187 10.5986H10.8358C10.4906 10.5986 10.2108 10.3187 10.2108 9.97355C10.2108 9.62837 10.4906 9.34855 10.8358 9.34855H16.8246C16.8258 9.34572 16.8269 9.34289 16.8281 9.34006L18.722 5.08255L18.7275 5.06984Z" fill="white" />
      </svg>
    </button>
  </div>
</template>