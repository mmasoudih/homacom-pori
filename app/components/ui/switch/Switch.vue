<script setup lang="ts">
import type { SwitchRootEmits, SwitchRootProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { SwitchRoot, SwitchThumb, useForwardPropsEmits } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<SwitchRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<SwitchRootEmits>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <!--
    `dir="ltr"` pins the thumb's origin to the physical left so the checked
    translation is direction-independent (the page is RTL, which would
    otherwise start the thumb on the right and push it out of the track).
  -->
  <SwitchRoot
    v-slot="slotProps"
    data-slot="switch"
    dir="ltr"
    v-bind="forwarded"
    :class="
      cn(
        'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-T-500 focus-visible:ring-primary/40 inline-flex h-[13.5px] w-[21.5px] shrink-0 items-center rounded-full outline-none transition-colors focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50',
        props.class,
      )
    "
  >
    <SwitchThumb
      data-slot="switch-thumb"
      :class="
        cn(
          'bg-T-50 pointer-events-none block size-[6.5px] rounded-full shadow-none ring-0 transition-transform data-[state=checked]:translate-x-[11.5px] data-[state=unchecked]:translate-x-[3.5px]',
        )
      "
    >
      <slot name="thumb" v-bind="slotProps" />
    </SwitchThumb>
  </SwitchRoot>
</template>
