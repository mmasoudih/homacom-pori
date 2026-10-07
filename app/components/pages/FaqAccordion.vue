<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '~/lib/utils'
import plusIcon from '../../../public/icons/faq-accordion-plus.svg?raw'
import minusIcon from '../../../public/icons/faq-accordion-minus.svg?raw'

export interface FaqItem {
  question: string
  answer: string
  /** Matches a `ChipItem.id` so the FAQ list can be filtered by category. */
  categoryId?: string
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
          <UiTypography
            as="span"
            size="xl"
            weight="semibold"
            color="default"
            class="leading-[24px]"
          >
            {{ item.question }}
          </UiTypography>
        </div>

        <template #icon>
          <span
            class="flex size-8 shrink-0 items-center justify-center text-T-700"
          >
            <span
              class="[&>svg]:block [&>svg]:size-5 group-data-[state=open]:hidden"
              aria-hidden="true"
              v-html="plusIcon"
            />
            <span
              class="hidden [&>svg]:block [&>svg]:size-5 group-data-[state=open]:block"
              aria-hidden="true"
              v-html="minusIcon"
            />
          </span>
        </template>
      </AccordionTrigger>
      <AccordionContent class="px-1">
        <UiTypography
          as="p"
          size="lg"
          weight="regular"
          color="emphasis"
          class="max-w-[860px] pb-5 leading-[26px]"
        >
          {{ item.answer }}
        </UiTypography>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
