<script setup lang="ts">
import { IconX, IconPlus, IconMinus, IconChevronDown } from '@tabler/icons-vue'
import type { ProductDetail } from '~/data/product'

const props = withDefaults(
  defineProps<{
    open: boolean
    product: ProductDetail
    mode: 'review' | 'specs'
  }>(),
  {},
)

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const review = computed(() => props.product.review)
const specs = computed(() => props.product.specGroups)

const dialogShell
  = 'max-sm:top-auto! max-sm:bottom-0! max-sm:start-0! max-sm:translate-x-0! max-sm:translate-y-0! max-sm:w-full! max-sm:max-w-full! max-sm:h-[92dvh]! max-sm:rounded-b-none! max-sm:rounded-t-2xl! max-sm:pb-[env(safe-area-inset-bottom)]'
</script>

<template>
  <UiDialog :open="open" @update:open="emit('update:open', $event)">
    <UiDialogContent
      :class="dialogShell"
      :show-close-button="false"
      class="max-w-[402px] gap-0 rounded-2xl p-0 sm:max-w-[402px]"
    >
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-T-300 px-4 py-3.5">
        <UiDialogTitle class="text-[15px] font-bold text-T-900">
          {{ mode === 'review' ? 'نقد و بررسی' : 'مشخصات فنی' }}
        </UiDialogTitle>
        <UiDialogClose
          class="flex size-9 items-center justify-center text-T-600 transition-colors hover:text-T-900"
          aria-label="بستن"
        >
          <IconX class="size-5" />
        </UiDialogClose>
      </div>

      <!-- ============================ Review ============================ -->
      <div v-if="mode === 'review'" class="flex max-h-[78vh] flex-col gap-4 overflow-y-auto px-4 pb-[calc(20px+env(safe-area-inset-bottom))] pt-5">
        <h2 class="text-[14px] font-bold text-T-900">{{ review.title }}</h2>

        <p
          v-for="(paragraph, i) in review.intro"
          :key="i"
          class="text-[13px] leading-[28px] text-T-800"
        >
          {{ paragraph }}
        </p>

        <img
          :src="review.image"
          :alt="review.imageAlt"
          class="h-auto w-full rounded-2xl object-cover"
        >

        <p class="text-[13px] font-bold text-T-900">ویژگی‌های این گوشی در بررسی‌های تخصصی هماکام:</p>
        <p class="text-[12.5px] text-T-800">{{ review.quickLookTitle }}</p>

        <ul class="flex flex-col gap-2 ps-5">
          <li
            v-for="item in review.quickLook"
            :key="item"
            class="list-disc text-[12.5px] leading-[24px] marker:text-T-600"
          >
            {{ item }}
          </li>
        </ul>

        <div class="flex flex-col gap-3">
          <div class="flex flex-col gap-2">
            <h3 class="text-[13px] font-bold text-[#3BB77E]">{{ review.strengthsTitle }}</h3>
            <ul class="flex flex-col gap-1.5">
              <li
                v-for="item in review.strengths"
                :key="item"
                class="flex items-start gap-2 text-[12px] leading-[20px] text-T-700"
              >
                <IconPlus class="mt-0.5 size-3.5 shrink-0 text-[#3BB77E]" />
                {{ item }}
              </li>
            </ul>
          </div>
          <div class="flex flex-col gap-2">
            <h3 class="text-[13px] font-bold text-R-300">{{ review.weaknessesTitle }}</h3>
            <ul class="flex flex-col gap-1.5">
              <li
                v-for="item in review.weaknesses"
                :key="item"
                class="flex items-start gap-2 text-[12px] leading-[20px] text-T-700"
              >
                <IconMinus class="mt-0.5 size-3.5 shrink-0 text-R-300" />
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- ============================ Specs ============================= -->
      <div v-else class="flex max-h-[78vh] flex-col gap-6 overflow-y-auto px-4 pb-[calc(20px+env(safe-area-inset-bottom))] pt-5">
        <section
          v-for="group in specs"
          :key="group.title"
          class="flex flex-col gap-2"
        >
          <h2 class="text-[13.5px] font-bold text-T-900">{{ group.title }}</h2>
          <div class="overflow-hidden rounded-xl">
            <div
              v-for="(row, i) in group.rows"
              :key="row.label"
              class="flex flex-col gap-1 px-4 py-3"
              :class="[i % 2 === 0 ? 'bg-R-10/60' : 'bg-T-50', i > 0 && 'mt-px']"
            >
              <span class="text-[11.5px] text-T-700">{{ row.label }}</span>
              <span class="text-[13px] font-medium text-T-900">{{ row.value }}</span>
            </div>
          </div>
        </section>

        <button
          type="button"
          class="flex items-center gap-1 self-start text-[12px] font-medium text-R-300"
        >
          <IconChevronDown class="size-4" />
          {{ product.specsMoreCount }} مشخصات بیشتر
        </button>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>
