<script setup lang="ts">
import type { SearchFingerprintValue } from '~/data/search'
import {
  searchBrandOptions,
  searchCategoryOptions,
  searchFingerprintOptions,
} from '~/data/search'
import { normalizeSearchText } from '~/utils/search'

const props = withDefaults(defineProps<{
  /** Initial open state for every section (desktop expands, mobile stays closed). */
  defaultOpen?: boolean
  priceMin: number
  priceMax: number
}>(), {
  defaultOpen: false,
})

const onlyAvailable = defineModel<boolean>('onlyAvailable', { default: false })
const categories = defineModel<string[]>('categories', { default: () => [] })
const brands = defineModel<string[]>('brands', { default: () => [] })
const color = defineModel<string | null>('color', { default: null })
const fingerprint = defineModel<SearchFingerprintValue | null>('fingerprint', { default: null })
const priceRange = defineModel<number[]>('priceRange', { default: () => [0, 0] })

const categoryQuery = ref('')
const brandQuery = ref('')

function matches(text: string, query: string) {
  if (!query.trim()) return true
  return normalizeSearchText(text).includes(normalizeSearchText(query))
}

const visibleCategories = computed(() =>
  searchCategoryOptions.filter(option => matches(option.label, categoryQuery.value)),
)

const visibleBrands = computed(() =>
  searchBrandOptions.filter(option =>
    matches(`${option.label} ${option.latin}`, brandQuery.value),
  ),
)

function toggleCategory(id: string) {
  categories.value = categories.value.includes(id)
    ? categories.value.filter(value => value !== id)
    : [...categories.value, id]
}

function toggleBrand(id: string) {
  brands.value = brands.value.includes(id)
    ? brands.value.filter(value => value !== id)
    : [...brands.value, id]
}
</script>

<template>
  <div class="flex flex-col">
    <!-- Only-in-stock toggle — the whole row is a click target for the switch. -->
    <div
      class="flex cursor-pointer items-center justify-between gap-4 px-[calc(1.25rem_-_1px)] py-4"
      @click="onlyAvailable = !onlyAvailable"
    >
      <UiTypography as="h3" size="lg" weight="regular" color="default">
        فقط کالاهای موجود
      </UiTypography>
      <UiSwitch v-model="onlyAvailable" aria-label="فقط کالاهای موجود" @click.stop />
    </div>

    <div class="divide-y divide-T-200 border-t border-T-200">
      <!-- دسته‌بندی‌ها -->
      <SearchFilterSection title="دسته‌بندی‌ها" :default-open="props.defaultOpen">
        <SearchFilterSearchInput v-model="categoryQuery" name="category-search" placeholder="جستجو در دسته‌بندی..." />

        <div class="scrollbar-facet mt-4 flex max-h-[240px] flex-col gap-4 overflow-y-auto overscroll-contain pe-1">
          <label
            v-for="option in visibleCategories"
            :key="option.id"
            class="flex cursor-pointer items-center gap-3"
          >
            <UiCheckbox
              :model-value="categories.includes(option.id)"
              class="size-[18px] rounded-[4px] border-T-500"
              @update:model-value="toggleCategory(option.id)"
            />
            <UiTypography as="span" size="md" weight="medium" color="default">
              {{ option.label }}
            </UiTypography>
          </label>
        </div>
      </SearchFilterSection>

      <!-- محدوده قیمت‌ها -->
      <SearchFilterSection title="محدوده قیمت‌ها" :default-open="props.defaultOpen">
        <SearchPriceRange
          v-model="priceRange"
          :min="priceMin"
          :max="priceMax"
        />
      </SearchFilterSection>

      <!-- برندها -->
      <SearchFilterSection title="برندها" :default-open="props.defaultOpen">
        <SearchFilterSearchInput v-model="brandQuery" name="brand-search" placeholder="جستجو در برندها..." />

        <div class="scrollbar-facet mt-4 flex max-h-[240px] flex-col gap-4 overflow-y-auto overscroll-contain pe-1">
          <label
            v-for="option in visibleBrands"
            :key="option.id"
            class="flex cursor-pointer items-center gap-3"
          >
            <UiCheckbox
              :model-value="brands.includes(option.id)"
              class="size-[18px] rounded-[4px] border-T-500"
              @update:model-value="toggleBrand(option.id)"
            />
            <UiTypography as="span" size="md" weight="medium" color="default">
              {{ option.label }}
            </UiTypography>
            <UiTypography as="span" size="md" weight="medium" color="subtle" class="ms-auto">
              {{ option.latin }}
            </UiTypography>
          </label>
        </div>
      </SearchFilterSection>

      <!-- رنگ -->
      <SearchFilterSection title="رنگ" :default-open="props.defaultOpen">
        <SearchColorFilter v-model="color" />
      </SearchFilterSection>

      <!-- اثر انگشت -->
      <SearchFilterSection title="اثر انگشت" :default-open="props.defaultOpen">
        <div class="flex gap-3">
          <button
            v-for="option in searchFingerprintOptions"
            :key="option.value"
            type="button"
            class="h-[30px] flex-1 rounded-[12px] border transition-colors"
            :class="fingerprint === option.value
              ? 'border-primary text-primary'
              : 'border-T-400 text-T-600 hover:border-T-500'"
            :aria-pressed="fingerprint === option.value"
            @click="fingerprint = fingerprint === option.value ? null : option.value"
          >
            <UiTypography as="span" size="md" weight="medium" color="inherit">
              {{ option.label }}
            </UiTypography>
          </button>
        </div>
      </SearchFilterSection>
    </div>
  </div>
</template>
