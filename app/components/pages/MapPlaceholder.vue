<script setup lang="ts">
import { cn } from '~/lib/utils'

const props = withDefaults(defineProps<{
  class?: string
}>(), {
  class: '',
})
</script>

<template>
  <div
    :class="cn('relative overflow-hidden rounded-[12px] border border-T-400 bg-[#F1F3F4]', props.class)"
    role="img"
    aria-label="نقشه فروشگاه هماکام"
  >
    <svg viewBox="0 0 800 420" preserveAspectRatio="xMidYMid slice" class="h-full w-full">
      <!-- background blocks -->
      <rect x="0" y="0" width="800" height="420" fill="#F5F5F3" />
      <rect x="0" y="0" width="180" height="120" fill="#EFEFEB" />
      <rect x="230" y="0" width="170" height="90" fill="#EFEFEB" />
      <rect x="450" y="0" width="150" height="140" fill="#EFEFEB" />
      <rect x="650" y="0" width="150" height="100" fill="#EFEFEB" />
      <rect x="0" y="170" width="140" height="130" fill="#EFEFEB" />
      <rect x="190" y="150" width="180" height="110" fill="#EFEFEB" />
      <rect x="420" y="180" width="140" height="120" fill="#EFEFEB" />
      <rect x="610" y="150" width="190" height="130" fill="#EFEFEB" />
      <rect x="0" y="340" width="200" height="80" fill="#EFEFEB" />
      <rect x="250" y="300" width="180" height="120" fill="#EFEFEB" />
      <rect x="480" y="330" width="150" height="90" fill="#EFEFEB" />
      <rect x="670" y="320" width="130" height="100" fill="#EFEFEB" />

      <!-- park -->
      <rect x="150" y="10" width="60" height="100" rx="8" fill="#C8E6C9" />

      <!-- main roads -->
      <rect x="185" y="0" width="26" height="420" fill="#E4E2DC" />
      <rect x="0" y="135" width="800" height="30" fill="#E8E6E0" />
      <rect x="400" y="0" width="20" height="420" fill="#E4E2DC" />
      <rect x="0" y="300" width="800" height="26" fill="#E8E6E0" />

      <!-- secondary roads -->
      <rect x="590" y="0" width="14" height="420" fill="#EDEBE5" />
      <rect x="0" y="200" width="800" height="10" fill="#F0EEE9" />

      <!-- water -->
      <ellipse cx="700" cy="210" rx="60" ry="30" fill="#D5E8F0" />

      <!-- POI markers -->
      <g fill="#4A90E2">
        <circle cx="120" cy="80" r="7" />
        <circle cx="500" cy="60" r="7" />
        <circle cx="700" cy="80" r="7" />
        <circle cx="90" cy="250" r="7" />
        <circle cx="520" cy="250" r="7" />
        <circle cx="720" cy="380" r="7" />
      </g>
      <g fill="#F9A825">
        <circle cx="300" cy="60" r="6" />
        <circle cx="640" cy="250" r="6" />
        <circle cx="330" cy="380" r="6" />
      </g>

      <!-- location pin -->
      <g transform="translate(470 180)">
        <circle cx="0" cy="0" r="26" fill="#EF233C" fill-opacity="0.15" />
        <path
          d="M0 -20C-11 -20 -20 -11 -20 0C-20 12 0 28 0 28C0 28 20 12 20 0C20 -11 11 -20 0 -20Z"
          fill="#EF233C"
        />
        <circle cx="0" cy="0" r="9" fill="#FFFFFF" />
      </g>
    </svg>
  </div>
</template>