<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { IconSearch, IconX } from '@tabler/icons-vue'
import type { SearchProduct } from '~/data/search'
import { searchableProducts } from '~/data/search'
import { compareColors } from '~/data/compare'
import { matchesQuery } from '~/utils/search'
import { formatPriceFa, toPersianDigits } from '~/utils/format'
import { resolveDiscount, toNumber } from '~/utils/product'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const compare = useCompare()

const query = ref('')
const loading = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

watch(
  () => props.open,
  (open) => {
    if (!open) return
    query.value = ''
    loading.value = false
  },
)

watch(query, (value) => {
  clearTimeout(timer)
  if (!value.trim()) {
    loading.value = false
    return
  }
  loading.value = true
  timer = setTimeout(() => {
    loading.value = false
  }, 300)
})

onBeforeUnmount(() => clearTimeout(timer))

const filtered = computed(() => {
  const q = query.value.trim()
  const base = q
    ? searchableProducts.filter(product =>
        matchesQuery([product.title, ...(product.keywords ?? [])].join(' '), q),
      )
    : searchableProducts
  return base.filter(product => !compare.has(product.id))
})

const results = computed(() => filtered.value.map((product) => {
  const price = toNumber(product.price)
  const originalPrice = product.oldPrice != null ? toNumber(product.oldPrice) : undefined
  const discount = resolveDiscount(product.discount, price, originalPrice)

  return {
    product,
    priceLabel: formatPriceFa(price),
    originalPriceLabel: originalPrice != null ? formatPriceFa(originalPrice) : '',
    discountLabel: discount != null ? `%${toPersianDigits(discount)}` : '',
    hasDiscount: discount != null && discount > 0,
    colors: compareColors(product),
  }
}))

const countLabel = computed(() => `${toPersianDigits(results.value.length)} کالا`)

function select(product: SearchProduct) {
  if (compare.has(product.id)) {
    toast.message('این کالا از قبل در لیست مقایسه است.')
    return
  }
  compare.add(product.id)
  if (compare.has(product.id)) emit('update:open', false)
}

const dialogShell
  = 'max-lg:top-0! max-lg:start-0! max-lg:translate-x-0! max-lg:translate-y-0! max-lg:w-full! max-lg:max-w-full! max-lg:h-[100dvh]! max-lg:max-h-[100dvh]! max-lg:rounded-none! max-lg:border-0! max-lg:flex! max-lg:flex-col! max-lg:data-[state=open]:slide-in-from-bottom-full! max-lg:data-[state=closed]:slide-out-to-bottom-full! max-lg:data-[state=open]:zoom-in-100! max-lg:data-[state=closed]:zoom-out-100! max-lg:data-[state=open]:fade-in-100! max-lg:data-[state=closed]:fade-out-100! max-lg:duration-300!'
</script>

<template>
  <UiDialog :open="open" @update:open="emit('update:open', $event)">
    <UiDialogContent
      :class="dialogShell"
      :show-close-button="false"
      overlay-class="z-[200]! bg-[#1D1D1F]/45! backdrop-blur-[8px]!"
      class="z-[201]! flex! max-h-[653px]! w-[883px]! max-w-[883px]! flex-col! gap-0! overflow-hidden! rounded-[24px]! border-0! bg-white! p-0! shadow-xl! lg:top-16! lg:h-[653px]! lg:translate-y-0! lg:bg-[#F5F6F7]!"
    >
      <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
        <UiDialogDescription class="sr-only">
          لیست کالاهای قابل افزودن به مقایسه
        </UiDialogDescription>

        <!-- Header: title / close, divider, search + result meta -->
        <header class="shrink-0 bg-white shadow-[0_0_6px_rgba(0,0,0,0.08)]">
          <div class="relative flex h-[71px] items-start justify-between gap-2.5 px-4 py-6 lg:gap-3 lg:px-6">
            <UiDialogTitle class="min-w-0 flex-1 text-start text-[16px] font-bold leading-[19px] text-T-900">
              انتخاب کالا برای مقایسه
            </UiDialogTitle>
            <UiDialogClose
              class="flex size-5 shrink-0 items-center justify-center text-T-500 outline-none transition-colors hover:text-T-700 focus:outline-none"
              aria-label="بستن"
            >
              <IconX class="size-5" stroke-width="1.5" />
            </UiDialogClose>

            <div class="absolute bottom-0 start-4 end-4 h-px bg-T-400 lg:start-6 lg:end-6" />
          </div>

          <div class="px-4 pt-6 pb-[23px] lg:px-6 lg:pt-[18px]">
            <div
              class="flex h-11 items-center gap-1.5 rounded-xl border border-T-300 bg-[#F5F6F7] px-4"
            >
              <input
                v-model="query"
                type="text"
                placeholder="جستجو ..."
                class="min-w-0 flex-1 bg-transparent text-start text-[14px] text-T-900 placeholder:text-T-600 focus:outline-none"
              >
              <IconSearch class="size-5 shrink-0 text-T-600" />
            </div>

            <div class="mt-[15px] flex items-center justify-between gap-3 px-2 text-[12.5px] leading-[15px] text-T-700">
              <span class="truncate">برترین کالاها برای مقایسه</span>
              <span class="shrink-0">{{ countLabel }}</span>
            </div>
          </div>
        </header>

        <!-- Body -->
        <div class="scrollbar-none min-h-0 flex-1 overflow-y-auto px-4 pb-6 lg:px-6 lg:py-5">
          <!-- Loading -->
          <template v-if="loading">
            <!-- Mobile skeletons -->
            <div class="lg:hidden">
              <div
                v-for="i in 3"
                :key="i"
                class="flex h-[155px] items-start gap-3 border-b border-T-300 py-5 last:border-b-0"
              >
                <div class="flex w-[99px] shrink-0 flex-col items-center gap-[5px]">
                  <UiSkeleton class="size-[99px] rounded-lg" />
                  <div class="flex gap-1">
                    <UiSkeleton v-for="c in 3" :key="c" class="size-2.5 rounded-[2px]" />
                  </div>
                </div>
                <div class="flex min-w-0 flex-1 flex-col gap-[22px] py-1">
                  <div class="flex flex-col gap-2">
                    <UiSkeleton class="h-3 w-full" />
                    <UiSkeleton class="h-3 w-3/4" />
                  </div>
                  <div class="flex flex-col gap-2">
                    <UiSkeleton class="h-5 w-40" />
                    <UiSkeleton class="h-3.5 w-24" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Desktop skeletons -->
            <div class="hidden gap-3 lg:grid lg:grid-cols-3">
              <div
                v-for="i in 3"
                :key="i"
                class="flex h-[344px] flex-col items-center gap-4 rounded-[20px] bg-white p-5"
              >
                <UiSkeleton class="size-[190px] rounded-none" />
                <div class="flex w-full flex-col gap-2">
                  <UiSkeleton class="h-3.5 w-full" />
                  <UiSkeleton class="h-3.5 w-3/4" />
                </div>
                <UiSkeleton class="h-5 w-32 self-end" />
              </div>
            </div>
          </template>

          <!-- Empty -->
          <div
            v-else-if="!results.length"
            class="flex flex-col items-center justify-center gap-2 py-16 text-T-600"
          >
            <IconSearch class="size-7" />
            <p class="text-[13px]">کالایی یافت نشد.</p>
          </div>

          <!-- Mobile list -->
          <div v-else class="lg:hidden">
            <button
              v-for="row in results"
              :key="row.product.id"
              type="button"
              class="flex h-[155px] w-full items-start gap-3 border-b border-T-300 py-5 text-start last:border-b-0"
              @click="select(row.product)"
            >
              <div class="flex w-[99px] shrink-0 flex-col items-center gap-[5px]">
                <ProductImage
                  :src="row.product.image"
                  :alt="row.product.title"
                  container-class="size-[99px] shrink-0 rounded-none bg-transparent"
                />

                <div v-if="row.colors.length" class="flex items-center gap-1">
                  <span
                    v-for="(color, ci) in row.colors"
                    :key="`${color}-${ci}`"
                    class="size-2.5 rounded-[2px] border border-T-500"
                    :style="{ backgroundColor: color }"
                    role="img"
                    aria-label="رنگ محصول"
                  />
                </div>
              </div>

              <div class="flex min-w-0 flex-1 flex-col gap-[22px] py-1">
                <h3 class="line-clamp-2 h-10 text-start text-[14px] leading-5 font-normal text-T-900">
                  {{ row.product.title }}
                </h3>

                <!-- Price at the left, discount chip to its right -->
                <div class="flex h-[45px] flex-col items-start self-end">
                  <div class="flex items-start gap-2.5">
                    <span
                      v-if="row.hasDiscount"
                      class="flex h-[21px] min-w-[38px] shrink-0 items-center justify-center rounded-full bg-primary px-2 text-[11.25px] font-bold leading-none text-white"
                    >{{ row.discountLabel }}</span>

                    <div class="flex items-baseline gap-1">
                      <div class="flex flex-col items-start gap-1.5">
                        <span class="text-[16px] font-semibold leading-none text-T-900">
                          {{ row.priceLabel }}
                        </span>
                        <span
                          v-if="row.originalPriceLabel"
                          class="text-[14px] font-medium leading-none text-T-600 line-through"
                        >{{ row.originalPriceLabel }}</span>
                      </div>
                      <span class="text-[10px] font-semibold leading-none text-T-600">تومان</span>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </div>

          <!-- Desktop grid -->
          <div v-if="!loading && results.length" class="hidden lg:grid lg:grid-cols-3 lg:gap-3">
            <button
              v-for="row in results"
              :key="row.product.id"
              type="button"
              class="flex h-[344px] w-full flex-col items-center gap-4 rounded-[20px] bg-white p-5 text-start transition-shadow hover:shadow-md"
              @click="select(row.product)"
            >
              <ProductImage
                :src="row.product.image"
                :alt="row.product.title"
                container-class="size-[190px] shrink-0 rounded-none bg-transparent"
              />

              <h3 class="line-clamp-2 h-[51px] w-full text-start text-[14px] leading-[25.5px] font-normal text-T-900">
                {{ row.product.title }}
              </h3>

              <!-- Price at the left, discount chip at the right -->
              <div class="flex h-[42px] w-full shrink-0 items-start justify-between gap-2">
                <span
                  v-if="row.hasDiscount"
                  class="flex h-[25px] min-w-[42px] shrink-0 items-center justify-center rounded-2xl bg-primary px-[13px] text-[12.5px] font-bold leading-none text-white"
                >{{ row.discountLabel }}</span>
                <span v-else class="shrink-0" aria-hidden="true" />

                <div class="flex flex-col items-end gap-1">
                  <div class="flex items-baseline gap-1.5">
                    <span class="text-[16px] font-medium leading-none text-T-900">
                      {{ row.priceLabel }}
                    </span>
                    <span class="text-[11.5px] font-semibold leading-none text-T-600">تومان</span>
                  </div>
                  <span
                    v-if="row.originalPriceLabel"
                    class="text-[16px] font-medium leading-none text-T-600 line-through"
                  >{{ row.originalPriceLabel }}</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>
