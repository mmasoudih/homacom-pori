<script lang="ts" setup>
import type { ToasterProps } from "vue-sonner"
import { IconCircleCheck, IconInfoCircle, IconLoader2, IconOctagonOff, IconAlertTriangle, IconX } from '@tabler/icons-vue'
import { computed } from "vue"
import { Toaster as Sonner } from "vue-sonner"
import { cn } from "@/lib/utils"

const props = defineProps<ToasterProps>()

/**
 * Toast skin from Figma (27436 «ToastStyles», 34807/34811/34815 toast1–3):
 * a translucent dark pill — #1D1D1F at 85% with an 8px backdrop blur, 20px
 * radius, 20/24 padding, a 20px white icon and 14px SemiBold white text on
 * 17px lines.
 */
const toastClasses = {
  toast:
    "!gap-[41px] !rounded-[20px] !border-0 !bg-[#1D1D1F]/85 !px-6 !py-5 !font-sans !text-white !shadow-none !backdrop-blur-[8px]",
  title: "!text-[14px] !font-semibold !leading-[17px] !text-white",
  description: "!text-[12.5px] !leading-[17px] !text-white/85",
  icon: "!m-0 !size-5 !text-white",
  content: "!gap-0",
  closeButton: "!border-0 !bg-white/10 !text-white hover:!bg-white/20",
  actionButton: "!h-8 !rounded-[10px] !bg-white !px-3 !text-[12.5px] !font-semibold !text-T-900",
  cancelButton: "!h-8 !rounded-[10px] !bg-white/10 !px-3 !text-[12.5px] !font-semibold !text-white",
} as const

const options = computed<ToasterProps>(() => ({
  ...props,
  class: cn("toaster group", props.class),
  // Figma's toast pills are 353px wide; Sonner defaults to 356px.
  style: {
    "--width": "353px",
    ...(props.style ?? {}),
  } as ToasterProps["style"],
  toastOptions: {
    ...props.toastOptions,
    classes: {
      ...toastClasses,
      ...props.toastOptions?.classes,
    },
  },
}))
</script>

<template>
  <Sonner v-bind="options">
    <template #success-icon>
      <IconCircleCheck class="size-5 text-white" />
    </template>
    <template #info-icon>
      <IconInfoCircle class="size-5 text-white" />
    </template>
    <template #warning-icon>
      <IconAlertTriangle class="size-5 text-white" />
    </template>
    <template #error-icon>
      <IconOctagonOff class="size-5 text-white" />
    </template>
    <template #loading-icon>
      <div>
        <IconLoader2 class="size-5 animate-spin text-white" />
      </div>
    </template>
    <template #close-icon>
      <IconX class="size-4 text-white" />
    </template>
  </Sonner>
</template>
