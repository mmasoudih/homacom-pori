<script setup lang="ts">
import type { SliderRootEmits, SliderRootProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import {
  SliderRange,
  SliderRoot,
  SliderThumb,
  SliderTrack,
  useForwardPropsEmits,
} from 'reka-ui'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<SliderRootProps & {
    class?: HTMLAttributes['class']
    /** Number of draggable handles (1 = single value, 2 = range). */
    thumbs?: number
  }>(),
  { thumbs: 1, dir: 'rtl' },
)

const emits = defineEmits<SliderRootEmits>()

const delegatedProps = reactiveOmit(props, 'class', 'thumbs')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <SliderRoot
    data-slot="slider"
    v-bind="forwarded"
    :class="
      cn(
        'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50',
        props.class,
      )
    "
  >
    <SliderTrack class="bg-T-300 relative h-2.5 w-full grow overflow-hidden rounded-full">
      <SliderRange class="bg-primary/55 absolute h-full rounded-full" />
    </SliderTrack>

    <SliderThumb
      v-for="(_, index) in thumbs"
      :key="index"
      :index="index"
      class="border-T-50 bg-R-300 focus-visible:ring-primary/40 block size-4 shrink-0 rounded-[4px] border-2 shadow-[0_1px_4px_rgba(0,0,0,0.25)] outline-none transition-shadow focus-visible:ring-3"
    />
  </SliderRoot>
</template>
