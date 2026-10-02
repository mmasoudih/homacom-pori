<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { IconSearch, IconX } from '@tabler/icons-vue'
import type { SearchProduct } from '~/data/search'
import { searchableProducts } from '~/data/search'
import { compareColors } from '~/data/compare'
import { matchesQuery } from '~/utils/search'
import { toPersianDigits } from '~/utils/format'

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

const countLabel = computed(() => `${toPersianDigits(filtered.value.length)} کالا`)

function select(product: SearchProduct) {
  if (compare.has(product.id)) {
    toast.message('این کالا از قبل در لیست مقایسه است.')
    return
  }
  compare.add(product.id)
  if (compare.has(product.id)) emit('update:open', false)
}

const dialogShell
  = 'max-lg:top-0! max-lg:start-0! max-lg:translate-x-0! max-lg:translate-y-0! max-lg:w-full! max-lg:max-w-full! max-lg:h-[100dvh]! max-lg:max-h-[100dvh]! max-lg:rounded-none! max-lg:flex! max-lg:flex-col! max-lg:data-[state=open]:slide-in-from-bottom-full! max-lg:data-[state=closed]:slide-out-to-bottom-full! max-lg:data-[state=open]:zoom-in-100! max-lg:data-[state=closed]:zoom-out-100! max-lg:data-[state=open]:fade-in-100! max-lg:data-[state=closed]:fade-out-100! max-lg:duration-300!'
</script>

<template>
  <UiDialog :open="open" @update:open="emit('update:open', $event)">
    <UiDialogContent
      :class="dialogShell"
      :show-close-button="false"
      overlay-class="z-[200]! bg-black/40! backdrop-blur-[6px]!"
      class="z-[201]! flex! max-h-[100dvh]! flex-col! gap-0 overflow-hidden rounded-none! bg-T-50 p-0! lg:max-h-[88vh]! lg:max-w-[870px]! lg:rounded-2xl!"
    >
      <!-- Header -->
      <div class="flex shrink-0 items-center justify-between border-b border-T-300 px-4 py-4 lg:px-6">
        <UiDialogTitle class="text-[15px] font-bold text-T-900 lg:text-[16px]">
          انتخاب کالا برای مقایسه
        </UiDialogTitle>
        <UiDialogClose
          class="flex size-9 items-center justify-center rounded-full text-T-600 transition-colors hover:bg-T-100 hover:text-T-900"
          aria-label="بستن"
        >
          <IconX class="size-5" />
        </UiDialogClose>
      </div>

      <!-- Body -->
      <div class="flex min-h-0 flex-1 flex-col px-4 py-4 lg:px-6 lg:py-5">
        <!-- Search -->
        <div class="flex h-12 shrink-0 items-center gap-3 rounded-full border border-T-400 bg-T-100 px-5 focus-within:ring-2 focus-within:ring-primary/30">
          <input
            v-model="query"
            type="text"
            placeholder="جستجو ..."
            class="min-w-0 flex-1 bg-transparent text-[14px] text-foreground placeholder:text-T-600 focus:outline-none"
          >
          <IconSearch class="size-5 shrink-0 text-T-600" />
        </div>

        <!-- Meta -->
        <div class="mt-4 flex items-center justify-between text-[12.5px] text-T-700">
          <span>برترین کالاها برای مقایسه</span>
          <span>{{ countLabel }}</span>
        </div>

        <!-- Results -->
        <div class="mt-3 min-h-0 flex-1 overflow-y-auto pb-[calc(12px+env(safe-area-inset-bottom))]">
          <!-- Loading skeletons -->
          <div v-if="loading" class="flex flex-col divide-y divide-T-300 lg:grid lg:grid-cols-3 lg:gap-4 lg:divide-y-0">
            <div v-for="i in 3" :key="i" class="flex items-center gap-3 py-4 lg:flex-col lg:items-stretch lg:gap-3 lg:rounded-2xl lg:border lg:border-T-300 lg:p-4">
              <UiSkeleton class="size-[92px] shrink-0 rounded-xl lg:size-auto lg:aspect-square lg:w-full" />
              <div class="flex flex-1 flex-col gap-2">
                <UiSkeleton class="h-4 w-full" />
                <UiSkeleton class="h-4 w-2/3" />
                <UiSkeleton class="mt-2 h-5 w-24" />
              </div>
            </div>
          </div>

          <!-- Empty -->
          <div v-else-if="!filtered.length" class="flex flex-col items-center justify-center gap-2 py-16 text-T-600">
            <IconSearch class="size-7" />
            <p class="text-[13px]">کالایی یافت نشد.</p>
          </div>

          <!-- Mobile list -->
          <ul v-else class="flex flex-col divide-y divide-T-300 lg:hidden">
            <li v-for="product in filtered" :key="product.id">
              <button
                type="button"
                class="w-full py-3 text-start"
                @click="select(product)"
              >
                <Product
                  variant="horizontal"
                  :product="{ ...product, colors: compareColors(product) }"
                  :href="''"
                  discount-placement="inline"
                  :show-original-price="false"
                  :show-colors="true"
                  image-class="bg-T-100"
                />
              </button>
            </li>
          </ul>

          <!-- Desktop grid (rendered when not loading/empty) -->
          <div
            v-if="!loading && filtered.length"
            class="hidden gap-4 lg:grid lg:grid-cols-3"
          >
            <button
              v-for="product in filtered"
              :key="product.id"
              type="button"
              class="rounded-2xl p-3 text-start transition-colors hover:bg-T-100"
              @click="select(product)"
            >
              <Product
                variant="vertical"
                :product="product"
                :href="''"
                :show-colors="false"
                discount-placement="inline"
                :show-original-price="false"
                image-class="bg-transparent"
                class="[&_h3]:text-center"
              />
            </button>
          </div>
        </div>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>
