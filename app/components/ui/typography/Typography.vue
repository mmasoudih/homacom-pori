<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import type { TypographyVariants } from "."
import { reactiveOmit } from "@vueuse/core"
import { Primitive } from "reka-ui"
import { cn } from "@/lib/utils"
import { typographyVariants } from "."

const props = withDefaults(
  defineProps<PrimitiveProps & {
    size?: TypographyVariants["size"]
    weight?: TypographyVariants["weight"]
    tracking?: TypographyVariants["tracking"]
    leading?: TypographyVariants["leading"]
    color?: TypographyVariants["color"]
    class?: HTMLAttributes["class"]
  }>(),
  {
    as: "span",
  },
)

const delegatedProps = reactiveOmit(
  props,
  "class",
  "size",
  "weight",
  "tracking",
  "leading",
  "color",
)
</script>

<template>
  <Primitive
    data-slot="typography"
    v-bind="delegatedProps"
    :class="
      cn(
        typographyVariants({ size, weight, tracking, leading, color }),
        props.class,
      )
    "
  >
    <slot />
  </Primitive>
</template>
