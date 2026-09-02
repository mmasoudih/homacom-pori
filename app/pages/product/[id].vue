<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { getProductDetail } from '~/data/product'

const route = useRoute()
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

// --- Dialogs ----------------------------------------------------------------

const dialogs = reactive({
  services: false,
  comment: false,
  insurance: false,
  notify: false,
})

// --- Section navigation -----------------------------------------------------

function navigateToSection(target: 'specs' | 'comments') {
  document.getElementById(target === 'specs' ? 'product-specs' : 'product-comments')
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-background">
    <LandingSiteHeader />

    <main class="flex flex-col items-center pb-14">
      <!-- Product not found -->
      <ProductDetailNotFound v-if="!loading && notFound" class="mt-16 w-full max-w-[1350px]" />

      <template v-else>
        <!-- Skeleton -->
        <ProductDetailSkeleton v-if="loading || !product" class="mt-6 w-full max-w-[1350px]" />

        <template v-else>
          <!-- Breadcrumb -->
          <ProductDetailBreadcrumb
            :trail="['خانه', ...product.breadcrumb, product.title]"
            class="mt-5 w-full max-w-[1350px]"
          />

          <!-- ============================= Hero ============================= -->
          <div class="mt-6 grid w-full max-w-[1350px] grid-cols-[374px_1fr_324px] items-start gap-9">
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

          <!-- ======================= Trust strip ======================= -->
          <ProductDetailTrustStrip class="mt-12 w-full max-w-[1350px]" />

          <!-- ================ Features / Questions / Services =============== -->
          <div
            v-if="product.stockStatus === 'available'"
            class="mt-12 flex w-full max-w-[1350px] flex-col gap-10"
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

          <!-- ================== Review + sticky sidebar ================== -->
          <div class="mt-12 grid w-full max-w-[1350px] grid-cols-[1fr_324px] items-start gap-9">
            <div class="flex min-w-0 flex-col gap-12">
              <ProductDetailReviewSection
                :review="product.review"
                @navigate="navigateToSection"
              />

              <ProductDetailSpecsSection
                :rows="product.specsTable"
                :more-count="product.specsMoreCount"
              />

              <ProductDetailCommentsSection
                :product="product"
                @open-comment="dialogs.comment = true"
              />
            </div>

            <div class="sticky top-6">
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
            class="mt-14 w-full max-w-[1350px]"
          />

          <!-- ===================== Insurance banner ====================== -->
          <HomaInsuranceBanner class="mt-12 w-full max-w-[1350px]" />
        </template>
      </template>
    </main>

    <LandingSiteFooter id="contact" class="mt-auto" />

    <!-- Dialogs -->
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
  </div>
</template>
