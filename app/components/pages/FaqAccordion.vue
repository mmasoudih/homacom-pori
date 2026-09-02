<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { IconMinus, IconPlus } from '@tabler/icons-vue'
import { cn } from '~/lib/utils'

export interface FaqItem {
  question: string
  answer: string
}

const props = withDefaults(defineProps<{
  items: FaqItem[]
  defaultOpen?: number
  class?: string
}>(), {
  defaultOpen: -1,
  class: '',
})

const defaultValue = ref(props.defaultOpen >= 0 ? `item-${props.defaultOpen}` : '')
</script>

<template>
  <Accordion
    v-model="defaultValue"
    type="single"
    collapsible
    :class="cn('w-full', props.class)"
  >
    <AccordionItem
      v-for="(item, i) in items"
      :key="i"
      :value="`item-${i}`"
      class="border-T-400"
    >
      <AccordionTrigger class="group px-1 py-5 hover:no-underline">
        <div class="flex flex-1 items-center justify-between gap-4">
          <span class="text-[16px] font-semibold leading-[24px] text-foreground">
            {{ item.question }}
          </span>
        </div>

        <template #icon>
          <span
            class="flex size-8 shrink-0 items-center justify-center rounded-full border border-T-500 bg-T-50 text-T-700 transition-colors group-data-[state=open]:border-primary group-data-[state=open]:bg-primary group-data-[state=open]:text-white"
          >
            <IconPlus
              class="size-4 transition-transform duration-200 group-data-[state=open]:hidden"
            />
            <IconMinus
              class="size-4 hidden transition-transform duration-200 group-data-[state=open]:block"
            />
          </span>
        </template>
      </AccordionTrigger>
      <AccordionContent class="px-1">
        <p class="max-w-[860px] pb-5 text-[14px] leading-[26px] text-T-700">
          {{ item.answer }}
        </p>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
