<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    /** Discount expiry timestamp. */
    expiresAt: string | Date
    /** Optional suffix label rendered next to the digits (e.g. "هما آف"). */
    label?: string
    class?: string
  }>(),
  { label: '', class: '' },
)

const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | null = null

const expiry = computed(() => {
  const t = new Date(props.expiresAt).getTime()
  return Number.isFinite(t) ? t : 0
})

const remaining = computed(() => Math.max(0, expiry.value - now.value))

const parts = computed(() => {
  const totalSeconds = Math.floor(remaining.value / 1000)
  const pad = (n: number) => String(n).padStart(2, '0')
  return {
    hours: pad(Math.floor(totalSeconds / 3600)),
    minutes: pad(Math.floor((totalSeconds % 3600) / 60)),
    seconds: pad(totalSeconds % 60),
  }
})

function tick() {
  now.value = Date.now()
}

function stop() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

watch(remaining, (value) => {
  if (value === 0) stop()
})

onMounted(() => {
  tick()
  timer = setInterval(tick, 1000)
})

onUnmounted(stop)
</script>

<template>
  <div
    :class="cn('flex h-[22px] w-full items-center justify-between gap-2 rounded-lg bg-[#fde9ec] px-3', props.class)"
    role="timer"
    :aria-label="label ? `${label} ${parts.hours}:${parts.minutes}:${parts.seconds}` : undefined"
  >
    <span class="text-[13px] font-bold tabular-nums text-primary" dir="ltr">
      {{ parts.hours }}:{{ parts.minutes }}:{{ parts.seconds }}
    </span>
    <span v-if="label" class="text-[11px] font-bold text-primary">{{ label }}</span>
  </div>
</template>
