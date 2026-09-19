<script setup lang="ts">
import { IconBellFilled } from '@tabler/icons-vue'
import type { AppNotification } from '~/data/notifications'

defineProps<{
  notification: AppNotification
}>()

const emit = defineEmits<{
  read: [id: string]
}>()
</script>

<template>
  <article
    class="relative flex cursor-pointer items-center gap-4 rounded-2xl border border-T-400 p-6 transition-colors hover:border-T-500"
    @click="emit('read', notification.id)"
  >
    <span
      v-if="notification.unread"
      class="absolute start-2 top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-primary"
      aria-hidden="true"
    />

    <span class="flex size-[50px] shrink-0 items-center justify-center rounded-full bg-[#FFF2F4]">
      <IconBellFilled class="size-6 text-primary" />
    </span>

    <div class="flex min-w-0 flex-1 flex-col gap-1">
      <h3 class="text-right text-[14px] font-bold leading-6 text-T-900">{{ notification.title }}</h3>
      <p class="text-right text-[13px] leading-5 text-T-700">{{ notification.body }}</p>
    </div>

    <span class="shrink-0 text-[13px] text-T-600">{{ notification.date }}</span>
  </article>
</template>
