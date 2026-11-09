<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import type { Seller } from '~/data/product'
import { DEMO_COMPARE_PRODUCT_ID } from '~/data/compare'
import { cartLineId } from '~/composables/useCart'

const route = useRoute()
const router = useRouter()
const id = computed(() => String(route.params.id))
const siteUrl = String(useRuntimeConfig().public.siteUrl).replace(/\/+$/, '')

const { product, pending: loading, notFound } = useProductDetail(id)

const seoTitle = computed(() =>
  product.value ? `${product.value.title} | هماکام` : 'کالا یافت نشد | هماکام',
)
const seoDescription = computed(() =>
  product.value
    ? `خرید ${product.value.title} از فروشگاه اینترنتی هماکام با ضمانت اصالت کالا، ارسال سریع و امکان خرید اقساطی.`
    : 'کالای مورد نظر در فروشگاه اینترنتی هماکام یافت نشد.',
)
const seoImage = computed(() => {
  const src = product.value?.images.find(item => item.type === 'image')?.src
  if (!src) return undefined
  return /^https?:\/\//.test(src) ? src : `${siteUrl}${src}`
})
useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogType: 'website',
  ogImage: seoImage,
})

// --- Selection state --------------------------------------------------------

const selectedWarrantyId = ref('')
const selectedColor = ref('')
const selectedInsuranceId = ref<string | null | undefined>(undefined)
const addedServiceIds = ref<string[]>([])

/**
 * The selection defaults are derived from the product so the server render and
 * the hydrated client render agree (a post-hydration default caused Vue to keep
 * the SSR class attributes, e.g. the selected warranty never showed its border).
 */
const effectiveWarrantyId = computed({
  get: () => selectedWarrantyId.value || product.value?.defaultWarrantyId || '',
  set: (value: string) => { selectedWarrantyId.value = value },
})

const effectiveColor = computed({
  get: () => selectedColor.value || product.value?.colors[0]?.value || '',
  set: (value: string) => { selectedColor.value = value },
})

const effectiveInsuranceId = computed<string | null>({
  get: () => selectedInsuranceId.value === undefined
    ? (product.value?.insuranceOptions[0]?.id ?? null)
    : selectedInsuranceId.value,
  set: (value: string | null) => { selectedInsuranceId.value = value },
})

const selectedWarranty = computed(() =>
  product.value
    ? product.value.warrantyOptions.find(w => w.id === effectiveWarrantyId.value)
      ?? product.value.warrantyOptions[0]
    : undefined,
)

const addedServices = computed(() =>
  product.value
    ? product.value.serviceCatalog
        .flatMap(category => category.items)
        .filter(item => addedServiceIds.value.includes(item.id))
    : [],
)

const servicesPrice = computed(() =>
  addedServices.value.reduce((sum, item) => sum + item.price, 0),
)

const selectedInsurancePrice = computed(() =>
  product.value?.insuranceOptions.find(i => i.id === effectiveInsuranceId.value)?.price ?? 0,
)

/** Services + insurance, added on top of the product price (mobile bar). */
const extraPrice = computed(() => servicesPrice.value + selectedInsurancePrice.value)

// --- Cart ---------------------------------------------------------------------

const {
  items: cartItems,
  addProduct,
  increment: incrementCartLine,
  decrement: decrementCartLine,
  removeItem: removeCartLine,
} = useCart()

/** Cart line for the current colour/warranty selection. */
const currentLineId = computed(() =>
  product.value
    ? cartLineId({
        product: product.value,
        color: selectedColor.value || product.value.colors[0]?.value,
        warrantyId: selectedWarranty.value?.id,
      })
    : '',
)

/** Stock that matches the selected colour + warranty (falls back to default). */
const selectedStockId = computed(() => {
  const current = product.value
  if (!current) return undefined

  const color = selectedColor.value || current.colors[0]?.value
  const warrantyId = selectedWarranty.value?.id

  return current.sellers.find(seller => seller.colorValue === color && seller.warrantyId === warrantyId)?.stockId
    ?? current.sellers.find(seller => seller.colorValue === color)?.stockId
    ?? current.sellers.find(seller => seller.warrantyId === warrantyId)?.stockId
    ?? current.stockId
})

/** How many of the current selection are already in the cart. */
const currentQuantity = computed(
  () => cartItems.value.find(item => item.id === currentLineId.value)?.quantity ?? 0,
)

function addSelectionToCart(quantity?: number) {
  if (!product.value) return
  addProduct({
    product: product.value,
    color: effectiveColor.value,
    warrantyId: selectedWarranty.value?.id,
    insuranceId: effectiveInsuranceId.value,
    serviceIds: addedServiceIds.value,
    stockId: selectedStockId.value,
    quantity: quantity ?? product.value.minOrderQuantity ?? 1,
  })
}

/** A seller offer becomes its own cart line (its price + credit terms). */
function addSellerToCart(seller: Seller) {
  if (!product.value) return
  addProduct({
    product: product.value,
    color: effectiveColor.value,
    warrantyId: selectedWarranty.value?.id,
    insuranceId: effectiveInsuranceId.value,
    serviceIds: addedServiceIds.value,
    seller,
  })
}

function removeServiceById(serviceId: string) {
  addedServiceIds.value = addedServiceIds.value.filter(i => i !== serviceId)
}

// Reset per-product state on navigation.
watch(
  id,
  () => {
    selectedWarrantyId.value = ''
    selectedColor.value = ''
    selectedInsuranceId.value = undefined
    addedServiceIds.value = []
    if (import.meta.client)
      window.scrollTo({ top: 0 })
  },
  { immediate: true },
)

// --- Dialogs & sheets ---------------------------------------------------------

const dialogs = reactive({
  services: false,
  comment: false,
  insurance: false,
  notify: false,
  sellers: false,
  commentsSheet: false,
  detailSheetOpen: false,
  detailSheetMode: 'review' as 'review' | 'specs',
})

function openDetailSheet(mode: 'review' | 'specs') {
  dialogs.detailSheetMode = mode
  dialogs.detailSheetOpen = true
}

function goBack() {
  if (window.history.length > 1)
    router.back()
  else router.push('/')
}

// --- Mobile tabs + scroll spy -------------------------------------------------

const activeTab = ref<'review' | 'specs' | 'comments'>('review')
let scrollHandler: (() => void) | undefined

onMounted(() => {
  scrollHandler = () => {
    const sections: Array<{ id: 'review' | 'specs' | 'comments', el: HTMLElement | null }> = [
      { id: 'review', el: document.getElementById('product-review') },
      { id: 'specs', el: document.getElementById('product-specs') },
      { id: 'comments', el: document.getElementById('product-comments') },
    ]
    let current: 'review' | 'specs' | 'comments' = 'review'
    for (const section of sections) {
      if (section.el && section.el.getBoundingClientRect().top <= 140)
        current = section.id
    }
    activeTab.value = current
  }
  window.addEventListener('scroll', scrollHandler, { passive: true })
})

onUnmounted(() => {
  if (scrollHandler)
    window.removeEventListener('scroll', scrollHandler)
})

const sectionIds = {
  review: 'product-review',
  specs: 'product-specs',
  comments: 'product-comments',
} as const

function navigateToSection(target: 'review' | 'specs' | 'comments') {
  activeTab.value = target
  document.getElementById(sectionIds[target])?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-background pb-[76px] lg:pb-0">
    <!-- Desktop header -->
    <LandingSiteHeader class="hidden lg:block" />

    <!-- Mobile action header -->
    <ProductDetailMobileHeader @back="goBack" />

    <main class="flex w-full flex-col items-center lg:pb-14">
      <!-- Product not found -->
      <ProductDetailNotFound v-if="!loading && notFound" class="mt-10 w-full max-w-[1350px] px-4 lg:mt-16 lg:px-0" />

      <template v-else>
        <!-- Skeleton -->
        <ProductDetailSkeleton v-if="loading || !product" class="w-full max-w-[1350px]" />

        <template v-else>
          <!-- ======================= Mobile hero ======================= -->
          <ProductDetailHeroMobile
            v-model:selected-warranty-id="effectiveWarrantyId"
            v-model:selected-color="effectiveColor"
            v-model:selected-insurance-id="effectiveInsuranceId"
            v-model:active-tab="activeTab"
            :product="product"
            :added-services="addedServices"
            class="w-full"
            @open-services="dialogs.services = true"
            @open-sellers="dialogs.sellers = true"
            @open-insurance="dialogs.insurance = true"
            @remove-service="removeServiceById"
          />

          <!-- ==================== Desktop breadcrumb ==================== -->
          <UiBreadcrumb
            :trail="product.breadcrumb"
            class="mx-auto mt-6 hidden w-full max-w-[1350px] lg:flex"
          />

          <!-- ======================= Desktop hero ======================= -->
          <div class="mt-6 hidden w-full max-w-[1350px] grid-cols-[minmax(340px,374px)_minmax(0,1fr)_minmax(270px,324px)] items-start gap-9 lg:grid [&>*]:min-w-0">
            <ProductDetailGallery
              :images="product.images"
              :alt="product.title"
              :compare-id="DEMO_COMPARE_PRODUCT_ID"
              :product-id="product.stockId ? Number(product.id) : null"
              :is-favorite="!!product.isFavorite"
            />

            <ProductDetailInfoBox
              v-model:selected-warranty-id="effectiveWarrantyId"
              v-model:selected-color="effectiveColor"
              v-model:selected-insurance-id="effectiveInsuranceId"
              :product="product"
              :added-services="addedServices"
              @open-services="dialogs.services = true"
              @open-comment="dialogs.comment = true"
              @open-insurance="dialogs.insurance = true"
              @remove-service="removeServiceById"
            />

            <ProductDetailPurchaseBox
              :product="product"
              :selected-warranty="selectedWarranty!"
              :selected-color="effectiveColor"
              :selected-insurance-id="effectiveInsuranceId"
              :added-services="addedServices"
              :services-price="servicesPrice"
              @open-services="dialogs.services = true"
              @open-insurance="dialogs.insurance = true"
              @notify-me="dialogs.notify = true"
              @add-to-cart="addSelectionToCart()"
            />

            <!-- Sellers span the gallery + info columns (not the whole page) -->
            <ProductDetailSellersSection
              v-if="product.stockStatus === 'available'"
              class="lg:col-span-2"
              :sellers="product.sellers"
              @add-to-cart="addSellerToCart"
            />
          </div>

          <!-- ================== Desktop trust strip =================== -->
          <ProductDetailTrustStrip class="mt-8 hidden w-full max-w-[1350px] lg:flex" />

          <!-- ============== Review + specs + comments + related ============== -->
          <div class="mt-8 flex w-full max-w-[1350px] flex-col gap-10 px-4 lg:mt-12 lg:grid lg:grid-cols-[1fr_324px] lg:items-start lg:gap-9 lg:px-0">
            <div class="flex min-w-0 flex-col gap-10 lg:gap-12">
              <ProductDetailTabs
                :active="activeTab"
                class="hidden lg:flex"
                @change="navigateToSection"
              />

              <ProductDetailReviewSection
                id="product-review"
                :review="product.review"
                :show-more-count="1"
                @show-more="openDetailSheet('review')"
              />

              <ProductDetailSpecsSection
                id="product-specs"
                :rows="product.specsTable"
                :more-count="product.specsMoreCount"
                @show-more="openDetailSheet('specs')"
              />

              <ProductDetailCommentsSection
                id="product-comments"
                :product="product"
                @open-comment="dialogs.comment = true"
                @open-comments-sheet="dialogs.commentsSheet = true"
              />
            </div>

            <!-- Desktop sticky card -->
            <div class="sticky top-6 hidden lg:block">
              <ProductDetailStickyCard
                :product="product"
                :links="product.stickyLinks"
                :selected-color="effectiveColor"
                :selected-warranty="selectedWarranty"
                @add-to-cart="addSelectionToCart()"
                @notify-me="dialogs.notify = true"
              />
            </div>
          </div>

          <!-- ===================== Related products ====================== -->
          <ProductDetailRelatedSection
            :title="product.relatedTitle"
            :products="product.related"
            class="mt-6 w-full max-w-[1350px] px-4 lg:mt-14 lg:px-0"
          />

          <!-- ================== Insurance / benefits ===================== -->
          <ProductDetailHomaInsuranceBanner class="mt-12 hidden w-full max-w-[1350px] lg:block" />

          <ProductDetailInPersonBenefits
            :title="product.inPersonBenefits.title"
            :text="product.inPersonBenefits.text"
            class="mt-6 w-full max-w-[1350px] px-4 lg:px-0"
          />
        </template>
      </template>
    </main>

    <LandingSiteFooter id="contact" class="mt-auto" />

    <!-- Mobile sticky bottom bar -->
    <ProductDetailStickyBar
      v-if="product"
      :product="product"
      :extra-price="extraPrice"
      :quantity="currentQuantity"
      @notify-me="dialogs.notify = true"
      @add-to-cart="addSelectionToCart()"
      @increment="incrementCartLine(currentLineId)"
      @decrement="decrementCartLine(currentLineId)"
      @remove="removeCartLine(currentLineId)"
    />

    <!-- Dialogs & sheets -->
    <ProductDetailServicesDialog
      v-if="product"
      v-model:open="dialogs.services"
      :categories="product.serviceCatalog"
      :selected-ids="addedServiceIds"
      @confirm="ids => (addedServiceIds = ids)"
    />

    <ProductDetailCommentDialog
      v-if="product"
      v-model:open="dialogs.comment"
      variant="figma"
      :product="product"
      :product-id="product.stockId ? Number(product.id) : null"
    />

    <ProductDetailInsuranceDialog
      v-if="product"
      v-model:open="dialogs.insurance"
      :insurance="product.insurance"
    />

    <ProductDetailNotifyDialog v-model:open="dialogs.notify" :slug="id" />

    <ProductDetailSellersSheet
      v-if="product"
      v-model:open="dialogs.sellers"
      :sellers="product.sellers"
      @add-to-cart="addSellerToCart"
    />

    <ProductDetailCommentsSheet
      v-if="product"
      v-model:open="dialogs.commentsSheet"
      :product="product"
    />

    <ProductDetailDetailSheet
      v-if="product"
      v-model:open="dialogs.detailSheetOpen"
      :product="product"
      :mode="dialogs.detailSheetMode"
    />
  </div>
</template>
