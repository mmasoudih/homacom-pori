<script setup lang="ts">
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
    class="relative flex cursor-pointer items-center gap-3 border-b-2 border-T-300 px-[18px] py-6"
    @click="emit('read', notification.id)"
  >
    <span
      v-if="notification.unread"
      class="absolute start-2 top-1/2 size-[9px] -translate-y-1/2 rounded-full bg-primary"
      aria-hidden="true"
    />

    <span class="flex size-[50px] mr-1.5 shrink-0 items-center justify-center rounded-full bg-[#FFF2F4]">
      <svg
        class="size-5 text-primary"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M22.75 3C22.75 2.58579 22.4142 2.25 22 2.25C21.5858 2.25 21.25 2.58579 21.25 3V3.44199L2.75 8.99212V8.5C2.75 8.08579 2.41421 7.75 2 7.75C1.58579 7.75 1.25 8.08579 1.25 8.5V15.5C1.25 15.9142 1.58579 16.25 2 16.25C2.41421 16.25 2.75 15.9142 2.75 15.5V15.0082L5.25 15.7581V18C5.25 20.0711 6.92893 21.75 9 21.75C11.0684 21.75 12.7456 20.0754 12.75 18.0081L21.25 20.558V21C21.25 21.4142 21.5858 21.75 22 21.75C22.4142 21.75 22.75 21.4142 22.75 21V3ZM11.25 17.5581L6.75 16.2081V18C6.75 19.2426 7.75736 20.25 9 20.25C10.2426 20.25 11.25 19.2426 11.25 18V17.5581ZM21.25 18.992V5.00804L16.75 6.35807V17.642L21.25 18.992ZM15.25 17.192V6.80808L2.75 10.5582V13.4421L15.25 17.192Z"
          fill="currentColor"
        />
      </svg>
    </span>

    <div class="flex min-w-0 flex-1 flex-col gap-0.5">
      <UiTypography as="h3" size="lg" weight="medium" color="default" class="text-right leading-5">
        {{ notification.title }}
      </UiTypography>
      <UiTypography as="p" size="md" weight="regular" color="muted" class="text-right leading-5">
        {{ notification.body }}
      </UiTypography>
    </div>

    <UiTypography as="span" size="md" weight="medium" color="subtle" class="shrink-0">
      {{ notification.date }}
    </UiTypography>
  </article>
</template>
