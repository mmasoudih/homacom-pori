<script setup lang="ts">
import { IconX } from '@tabler/icons-vue'

// Remember dismissal across reloads/visits.
const dismissed = useCookie<boolean>('topbar_dismissed', {
  maxAge: 60 * 60 * 24 * 30,
  default: () => false,
})

// Only play the entrance animation on the first mount of a page load; SPA
// navigations remount the header, and replaying it every route change is noisy.
const animatedOnce = useState('topbar-animated', () => false)
const animate = computed(() => !animatedOnce.value)
onMounted(() => {
  animatedOnce.value = true
})

const visible = ref(!dismissed.value)
const leaving = ref(false)

function close() {
  leaving.value = true
  window.setTimeout(() => {
    visible.value = false
    leaving.value = false
    dismissed.value = true
  }, 300)
}
</script>

<template>
  <div
    v-if="visible"
    role="region"
    aria-label="اطلاعیه"
    class="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
    :class="leaving ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'"
  >
    <div class="min-h-0">
      <div
        class="relative flex h-12 items-center justify-center bg-P-500 text-white"
        :class="animate ? 'animate-topbar-in' : ''"
      >
        <div class="mx-auto flex h-12 w-full max-w-[1440px] items-center justify-center px-12 lg:px-6">
          <UiTypography size="md" weight="semibold" color="white" class="text-center">
            موبایلت رو با بهترین قیمت از هماکام بخر
          </UiTypography>
        </div>

        <!-- Close button aligned to the desktop 1440px container; full-bleed on mobile. -->
        <div class="pointer-events-none absolute inset-0">
          <div class="relative mx-auto h-full w-full max-w-[1440px] lg:px-6">
            <button
              type="button"
              class="pointer-events-auto absolute inset-y-0 end-0 flex w-12 items-center justify-center text-white/90 transition-colors hover:text-white"
              aria-label="بستن اطلاعیه"
              @click="close"
            >
              <IconX class="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
