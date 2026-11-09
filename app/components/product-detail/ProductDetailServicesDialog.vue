<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import type { ServiceCatalogItem, ServiceCategory } from '~/data/product'
import { SERVICE_ICON_SRC } from '~/utils/productDetailIcons'
import { formatPriceFa } from '~/utils/format'

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
const expanded = ref<string>('')

watch(
  () => props.open,
  (open) => {
    if (open) {
      draft.value = new Set(props.selectedIds)
      const firstWithSelection = props.categories.find(c => c.items.some(i => draft.value.has(i.id)))
      expanded.value = firstWithSelection?.id ?? props.categories[0]?.id ?? ''
    }
  },
  { immediate: true },
)

function countInGroup(category: ServiceCategory): number {
  return category.items.filter(item => draft.value.has(item.id)).length
}

function toggleExpanded(category: ServiceCategory) {
  expanded.value = expanded.value === category.id ? '' : category.id
}

function toggle(category: ServiceCategory, id: string) {
  if (draft.value.has(id)) {
    draft.value.delete(id)
  }
  else {
    if (category.selectionMode === 'single') {
      for (const item of category.items) draft.value.delete(item.id)
    }
    else if (category.maxSelections != null && countInGroup(category) >= category.maxSelections) {
      toast.error(`حداکثر ${category.maxSelections} مورد از «${category.title}» قابل انتخاب است.`)
      return
    }
    draft.value.add(id)
  }
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

/** Centered dialog on desktop, bottom sheet on mobile. */
const dialogShell
  = 'max-lg:top-auto! max-lg:bottom-0! max-lg:start-0! max-lg:translate-x-0! max-lg:translate-y-0! max-lg:w-full! max-lg:max-w-full! max-lg:rounded-b-none! max-lg:rounded-t-2xl! max-lg:pb-[env(safe-area-inset-bottom)] max-lg:data-[state=open]:slide-in-from-bottom-full! max-lg:data-[state=closed]:slide-out-to-bottom-full! max-lg:data-[state=open]:zoom-in-100! max-lg:data-[state=closed]:zoom-out-100! max-lg:data-[state=open]:fade-in-100! max-lg:data-[state=closed]:fade-out-100! max-lg:duration-300!'
</script>

<template>
  <UiDialog :open="open" @update:open="emit('update:open', $event)">
    <UiDialogContent
      :class="dialogShell"
      overlay-class="bg-[#1D1D1F]/45"
      :show-close-button="false"
      class="flex max-w-[543px] flex-col gap-0 overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-none lg:h-[622px] lg:max-h-[92vh] lg:max-w-[543px]"
    >
      <!-- Header -->
      <div class="flex h-[94px] shrink-0 items-center gap-3 px-6">
        <span class="flex size-[46px] shrink-0 items-center justify-center rounded-xl bg-R-10">
          <img src="/icons/product-detail/package-simple-arrow-down-22-red.svg" alt="" class="size-[22px]">
        </span>

        <div class="flex min-w-0 flex-1 flex-col gap-[5px]">
          <UiDialogTitle as-child>
            <UiTypography as="h2" size="xl" weight="bold">
              افزودن خدمات و لوازم جانبی
            </UiTypography>
          </UiDialogTitle>
          <UiDialogDescription as-child>
            <UiTypography as="p" size="md" color="muted">
              دسته موردنظر را باز کنید و انتخاب کنید
            </UiTypography>
          </UiDialogDescription>
        </div>

        <UiDialogClose
          class="flex size-5 shrink-0 items-center justify-center transition-opacity hover:opacity-70"
          aria-label="بستن"
        >
          <img src="/icons/product-detail/xmark-20.svg" alt="" class="size-5">
        </UiDialogClose>
      </div>

      <div class="mx-6 h-px shrink-0 bg-T-400" />

      <!-- Body -->
      <div class="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-6 pt-6 pb-6 max-lg:max-h-[54vh] max-lg:px-4 max-lg:pt-4">
        <div v-for="category in categories" :key="category.id" class="shrink-0 overflow-hidden rounded-lg border border-T-300">
          <!-- Category header -->
          <button
            type="button"
            class="flex w-full items-center gap-3 p-3 text-start transition-colors hover:bg-T-100"
            :aria-expanded="expanded === category.id"
            @click="toggleExpanded(category)"
          >
            <img
              :src="SERVICE_ICON_SRC[category.icon]"
              alt=""
              class="size-6 shrink-0 object-contain"
            >

            <UiTypography as="span" size="lg" weight="semibold" class="min-w-0 flex-1 truncate">
              {{ category.title }}
            </UiTypography>

            <span
              v-if="countInGroup(category)"
              class="flex h-[25px] min-w-[29px] shrink-0 items-center justify-center rounded-full border border-white bg-R-300 px-1"
            >
              <UiTypography size="md" weight="bold" color="white" class="tracking-[0.88px]">
                {{ countInGroup(category) }}
              </UiTypography>
            </span>

            <img
              src="/icons/product-detail/angle-down-16.svg"
              alt=""
              class="size-4 shrink-0"
            >
          </button>

          <!-- Category items -->
          <div
            v-if="expanded === category.id"
            class="flex flex-col gap-3 px-3 pb-3"
          >
            <div class="h-px w-full bg-T-300" />

            <div class="flex flex-col gap-2">
              <button
                v-for="item in category.items"
                :key="item.id"
                type="button"
                class="flex min-h-5 w-full items-center gap-1.5 text-start"
                role="checkbox"
                :aria-checked="draft.has(item.id)"
                @click="toggle(category, item.id)"
              >
                <img
                  :src="draft.has(item.id)
                    ? '/icons/product-detail/check-square-18-red.svg'
                    : '/icons/product-detail/check-square-18-gray.svg'"
                  alt=""
                  class="size-[18px] shrink-0"
                >

                <UiTypography as="span" size="md" class="min-w-0 flex-1 truncate">
                  {{ item.label }}
                </UiTypography>

                <span v-if="item.price" class="flex w-[79px] shrink-0 items-center gap-[5px]">
                  <UiTypography size="md" weight="medium">{{ formatPriceFa(item.price) }}</UiTypography>
                  <UiTypography size="xs" color="muted">تومان</UiTypography>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex h-[79px] shrink-0 items-start justify-between gap-2.5 border-t border-T-300 bg-white px-6 py-[15px]">
        <div class="flex min-w-0 flex-1 flex-col items-start gap-[9px]">
          <UiTypography size="md" color="muted">({{ selectedItems.length }} خدمت) برای این کالا</UiTypography>
          <span class="flex items-center gap-[5px]">
            <UiTypography size="lg" weight="semibold">{{ formatPriceFa(totalPrice) }}</UiTypography>
            <UiTypography size="md" color="muted">تومان</UiTypography>
          </span>
        </div>

        <button
          type="button"
          class="flex h-[42px] w-[121px] shrink-0 items-center justify-center rounded-xl bg-R-300 px-[18px] transition-colors hover:bg-R-400"
          @click="confirm"
        >
          <UiTypography size="lg" weight="bold" color="white">تایید</UiTypography>
        </button>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>
