<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { getProductDetail } from '~/data/product'

const route = useRoute()
const router = useRouter()
const id = computed(() => String(route.params.id))

const product = computed(() => getProductDetail(id.value))
const notFound = computed(() => !product.value)

// Simulated fetch so the skeleton state renders per the Figma flow.
const loading = ref(true)
let loadingTimer: ReturnType<typeof setTimeout> | undefined
onMounted(() => {
  loadingTimer = setTimeout(() => {
    loading.value = false
  }, 700)
})
onUnmounted(() => clearTimeout(loadingTimer))

useHead({
  title: computed(() =>
    product.value ? `${product.value.title} | هماکام` : 'کالا یافت نشد | هماکام',
  ),
})

// --- Selection state --------------------------------------------------------

const selectedWarrantyId = ref('')
const selectedStorageId = ref('')
const selectedColor = ref('')
const selectedInsuranceId = ref<string | null>(null)
const addedServiceIds = ref<string[]>([])

const selectedWarranty = computed(() =>
  product.value
    ? product.value.warrantyOptions.find(w => w.id === selectedWarrantyId.value)
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
  product.value?.insuranceOptions.find(i => i.id === selectedInsuranceId.value)?.price ?? 0,
)

/** Services + insurance, added on top of the product price (mobile bar). */
const extraPrice = computed(() => servicesPrice.value + selectedInsurancePrice.value)

function addServiceById(serviceId: string) {
  if (!addedServiceIds.value.includes(serviceId))
    addedServiceIds.value = [...addedServiceIds.value, serviceId]
}

function removeServiceById(serviceId: string) {
  addedServiceIds.value = addedServiceIds.value.filter(i => i !== serviceId)
}

// Reset per-product state on navigation.
watch(
  id,
  () => {
    loading.value = true
    selectedWarrantyId.value = product.value?.defaultWarrantyId ?? ''
    selectedStorageId.value = product.value?.storageOptions[0]?.id ?? ''
    selectedColor.value = ''
    selectedInsuranceId.value = null
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

function navigateToSection(target: 'specs' | 'comments') {
  document.getElementById(target === 'specs' ? 'product-specs' : 'product-comments')
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-background pb-[76px] lg:pb-0">
    <!-- Desktop header -->
    <LandingSiteHeader class="hidden lg:block" />

    <!-- Mobile action header -->
    <ProductDetailMobileHeader @back="goBack" />

    <main class="flex flex-col items-center lg:pb-14">
      <!-- Product not found -->
      <ProductDetailNotFound v-if="!loading && notFound" class="mt-10 w-full max-w-[1350px] px-4 lg:mt-16 lg:px-0" />

      <template v-else>
        <!-- Skeleton -->
        <ProductDetailSkeleton v-if="loading || !product" class="w-full max-w-[1350px]" />

        <template v-else>
          <!-- ======================= Mobile hero ======================= -->
          <ProductDetailHeroMobile
            v-model:selected-warranty-id="selectedWarrantyId"
            v-model:selected-color="selectedColor"
            v-model:selected-insurance-id="selectedInsuranceId"
            v-model:active-tab="activeTab"
            :product="product"
            :added-services="addedServices"
            class="w-full"
            @open-services="dialogs.services = true"
            @open-sellers="dialogs.sellers = true"
            @open-insurance="dialogs.insurance = true"
            @remove-service="removeServiceById"
          />

          <!-- ======================= Desktop hero ======================= -->
          <div class="mt-12 hidden w-full max-w-[1350px] grid-cols-[374px_1fr_324px] items-start gap-9 lg:grid">
            <ProductDetailGallery
              :images="product.images"
              :alt="product.title"
            />

            <ProductDetailInfoBox
              v-model:selected-warranty-id="selectedWarrantyId"
              v-model:selected-storage-id="selectedStorageId"
              v-model:selected-color="selectedColor"
              :product="product"
              @open-services="dialogs.services = true"
              @open-comment="dialogs.comment = true"
              @open-insurance="dialogs.insurance = true"
            />

            <ProductDetailPurchaseBox
              v-model:selected-insurance-id="selectedInsuranceId"
              :product="product"
              :selected-warranty="selectedWarranty!"
              :added-services="addedServices"
              :services-price="servicesPrice"
              @update:selected-warranty-id="selectedWarrantyId = $event"
              @open-services="dialogs.services = true"
              @remove-service="removeServiceById"
              @notify-me="dialogs.notify = true"
            />
          </div>

          <!-- ================== Desktop-only sections =================== -->
          <ProductDetailTrustStrip class="mt-12 hidden w-full max-w-[1350px] lg:flex" />

          <div
            v-if="product.stockStatus === 'available'"
            class="mt-12 hidden w-full max-w-[1350px] flex-col gap-10 lg:flex"
          >
            <ProductDetailFeaturesSection
              :rows="product.features.rows"
              :more-count="product.features.moreCount"
            />

            <ProductDetailQuestionsSection :questions="product.questions" />

            <ProductDetailServicesSection
              :packages="product.servicePackages"
              :added-services="addedServices"
              :show-added-services="addedServices.length > 0"
              @add-package="addServiceById"
              @open-details="dialogs.insurance = true"
              @remove-service="removeServiceById"
            />
          </div>

          <!-- ============== Review + specs + comments + related ============== -->
          <div class="mt-8 flex w-full max-w-[1350px] flex-col gap-10 px-4 lg:mt-12 lg:grid lg:grid-cols-[1fr_324px] lg:items-start lg:gap-9 lg:px-0">
            <div class="flex min-w-0 flex-col gap-10 lg:gap-12">
              <ProductDetailReviewSection
                id="product-review"
                :review="product.review"
                :show-more-count="1"
                @navigate="navigateToSection"
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
          <HomaInsuranceBanner class="mt-12 hidden w-full max-w-[1350px] lg:block" />

          <ProductDetailInPersonBenefits
            :title="product.inPersonBenefits.title"
            :text="product.inPersonBenefits.text"
            class="mt-6 w-full max-w-[1350px] px-4"
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
      @notify-me="dialogs.notify = true"
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
      :product="product"
    />

    <ProductDetailInsuranceDialog
      v-if="product"
      v-model:open="dialogs.insurance"
      :insurance="product.insurance"
    />

    <ProductDetailNotifyDialog v-model:open="dialogs.notify" />

    <ProductDetailSellersSheet
      v-if="product"
      v-model:open="dialogs.sellers"
      :sellers="product.sellers"
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
