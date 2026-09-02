<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { IconPackage, IconFileText } from '@tabler/icons-vue'
import type { ServiceCatalogItem, ServiceCategory } from '~/data/product'
import { formatPrice } from '~/utils/format'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    open: boolean
    categories: ServiceCategory[]
    selectedIds: string[]
  }>(),
  {},
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: [ids: string[]]
}>()

const draft = ref<Set<string>>(new Set())
const expanded = ref<string>('cat-insurance')

watch(
  () => props.open,
  (open) => {
    if (open) {
      draft.value = new Set(props.selectedIds)
      const firstWithSelection = props.categories.find(c => c.items.some(i => draft.value.has(i.id)))
      expanded.value = firstWithSelection?.id ?? props.categories[1]?.id ?? props.categories[0]?.id ?? ''
    }
  },
  { immediate: true },
)

function toggle(id: string) {
  if (draft.value.has(id))
    draft.value.delete(id)
  else draft.value.add(id)
  draft.value = new Set(draft.value)
}

function allItems(): ServiceCatalogItem[] {
  return props.categories.flatMap(c => c.items)
}

const selectedItems = computed(() =>
  allItems().filter(item => draft.value.has(item.id)),
)

const totalPrice = computed(() =>
  selectedItems.value.reduce((sum, item) => sum + item.price, 0),
)

function confirm() {
  emit('confirm', [...draft.value])
  emit('update:open', false)
}
</script>

<template>
  <UiDialog :open="open" @update:open="emit('update:open', $event)">
    <UiDialogContent class="max-w-[580px] gap-0 rounded-2xl p-0 sm:max-w-[580px]">
      <!-- Header -->
      <div class="flex flex-col gap-3 p-6 pb-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="flex size-11 items-center justify-center rounded-xl bg-R-10 text-R-300">
              <IconPackage class="size-6" stroke-width="1.5" />
            </span>
            <div class="flex flex-col gap-1">
              <UiDialogTitle class="text-[16px] font-bold text-T-900">
                افزودن خدمت و لوازم جانبی
              </UiDialogTitle>
              <UiDialogDescription class="text-[12.5px] text-T-700">
                موردی را که می‌خواهید انتخاب کنید
              </UiDialogDescription>
            </div>
          </div>
          <UiDialogClose
            class="flex size-9 items-center justify-center rounded-full text-T-600 transition-colors hover:bg-T-100 hover:text-T-900"
            aria-label="بستن"
          />
        </div>
      </div>

      <div class="h-px w-full bg-T-300" />

      <!-- Body: accordion of categories -->
      <div class="max-h-[420px] overflow-y-auto px-6">
        <UiAccordion
          type="single"
          collapsible
          class="w-full"
          :default-value="expanded"
          @update:model-value="expanded = $event as string"
        >
          <UiAccordionItem
            v-for="(category, ci) in categories"
            :key="category.id"
            :value="category.id"
            class="border-b border-T-300 last:border-b-0"
          >
            <UiAccordionTrigger class="py-4 text-[13.5px] font-medium text-T-900 hover:no-underline [&>svg]:size-4 [&>svg]:text-T-600">
              {{ category.title }}
            </UiAccordionTrigger>
            <UiAccordionContent class="pb-4">
              <ul class="flex flex-col gap-2.5" :class="ci === 0 && 'pt-1'">
                <li
                  v-for="item in category.items"
                  :key="item.id"
                  class="flex items-center justify-between gap-3"
                >
                  <label
                    class="flex cursor-pointer items-center gap-2.5"
                    :class="cn(item.price === 0 && 'text-T-700')"
                  >
                    <UiCheckbox
                      :model-value="draft.has(item.id)"
                      class="size-[18px]"
                      @update:model-value="toggle(item.id)"
                    />
                    <span class="text-[12.5px] text-T-900">{{ item.label }}</span>
                  </label>
                  <span class="flex items-center gap-3">
                    <button
                      v-if="item.detailLink"
                      type="button"
                      class="flex items-center gap-1 text-[11.5px] text-[#3D7BFA] transition-opacity hover:opacity-80"
                      @click.prevent
                    >
                      <IconFileText class="size-3.5" />
                      جزئیات بیمه
                    </button>
                    <span v-if="item.price" class="text-[12px] text-T-700">
                      {{ formatPrice(item.price) }} تومان
                    </span>
                  </span>
                </li>
              </ul>
            </UiAccordionContent>
          </UiAccordionItem>
        </UiAccordion>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between border-t border-T-300 px-6 py-4">
        <div class="flex flex-col gap-1">
          <span class="text-[12.5px] text-T-700">{{ selectedItems.length }} مورد انتخاب شده است</span>
          <span v-if="totalPrice" class="text-[12.5px] font-bold text-T-900">
            مجموع: {{ formatPrice(totalPrice) }} تومان
          </span>
        </div>
        <UiButton
          class="h-[42px] w-[132px] rounded-xl text-[13.5px] font-bold"
          @click="confirm"
        >
          تایید
        </UiButton>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>
