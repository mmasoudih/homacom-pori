<script setup lang="ts">
import { ref, watch } from 'vue'
import { IconPhotoOff } from '@tabler/icons-vue'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    src?: string
    alt?: string
    containerClass?: string
    imageClass?: string
  }>(),
  { src: '', alt: '', containerClass: '', imageClass: '' },
)

const loaded = ref(false)
const broken = ref(false)

watch(
  () => props.src,
  () => {
    loaded.value = false
    broken.value = false
  },
)
</script>

<template>
  <div
    :class="cn(
      'relative flex aspect-square w-full shrink-0 items-center justify-center overflow-hidden bg-secondary/40',
      containerClass,
    )"
  >
    <!-- Loading placeholder -->
    <UiSkeleton v-if="!loaded && !broken" class="absolute inset-0 rounded-none" />

    <!-- Broken / missing image fallback -->
    <div
      v-if="broken"
      class="flex size-full items-center justify-center text-[#9ca3af]"
      role="img"
      :aria-label="alt || 'تصویر در دسترس نیست'"
    >
      <IconPhotoOff class="size-6" />
    </div>

    <img
      v-show="!broken"
      :src="src"
      :alt="alt"
      loading="lazy"
      class="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
      :class="imageClass"
      @load="loaded = true"
      @error="broken = true"
    >
  </div>
</template>
