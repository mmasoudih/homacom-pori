<script setup lang="ts">
import { toPersianDigits } from '~/utils/format'

const route = useRoute()

const {
  items,
  count,
  isEmpty: cartIsEmpty,
  summary,
  payableTotal,
  increment,
  decrement,
  removeItem,
  removeAll,
  setInsurance,
  setServices,
  removeInsurance,
  removeService,
} = useCart()

/** `?empty=1` previews the designed empty state (same affordance as favorites). */
const isEmpty = computed(() => route.query.empty === '1' || cartIsEmpty.value)

useHead({
  title: 'سبد خرید | هماکام',
})

function goCheckout() {
  if (isEmpty.value) return
  navigateTo('/checkout')
}

// --- Insurance selection dialog ----------------------------------------------

const insuranceDialog = reactive<{ open: boolean, itemId: string }>({ open: false, itemId: '' })

const insuranceItem = computed(
  () => items.value.find(item => item.id === insuranceDialog.itemId) ?? null,
)

function openInsurance(itemId: string) {
  insuranceDialog.itemId = itemId
  insuranceDialog.open = true
}

function confirmInsurance(insuranceId: string | null) {
  if (insuranceDialog.itemId) setInsurance(insuranceDialog.itemId, insuranceId)
  insuranceDialog.open = false
}

// --- Add-on services dialog --------------------------------------------------

const servicesDialog = reactive<{ open: boolean, itemId: string }>({ open: false, itemId: '' })

const servicesItem = computed(
  () => items.value.find(item => item.id === servicesDialog.itemId) ?? null,
)

function openServices(itemId: string) {
  servicesDialog.itemId = itemId
  servicesDialog.open = true
}

function confirmServices(ids: string[]) {
  if (servicesDialog.itemId) setServices(servicesDialog.itemId, ids)
  servicesDialog.open = false
}
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-T-50">
    <LandingSiteHeader />

    <!-- =============================== Desktop =============================== -->
    <main class="mx-auto hidden w-full max-w-[1440px] flex-1 flex-col px-[45px] pb-16 pt-6 lg:flex">
      <!-- Breadcrumb — all steps muted grey like the design. -->
      <nav aria-label="breadcrumb" class="flex w-full items-center gap-1.5">
        <UiTypography as="span" size="md" color="subtle">هماکام</UiTypography>
        <UiTypography as="span" size="md" color="subtle">&lt;</UiTypography>
        <UiTypography as="span" size="md" color="subtle">سبدخرید</UiTypography>
      </nav>

      <!-- Title row shares the items column width (988 at 1440) like the design. -->
      <div
        v-if="!isEmpty"
        class="mt-5 grid grid-cols-[minmax(0,1fr)_324px] items-center gap-[38px]"
      >
        <div class="flex items-center justify-between gap-4">
          <UiTypography as="h1" size="2xl" weight="bold">سبدخرید</UiTypography>
          <UiTypography as="span" size="md" color="muted">
            <UiTypography as="span" size="md" weight="semibold" color="muted">{{ toPersianDigits(count) }}</UiTypography>
            کالا
          </UiTypography>
        </div>
      </div>

      <CartEmpty v-if="isEmpty" class="mt-5" />

      <template v-else>
        <div class="mt-[30px] grid grid-cols-[minmax(0,1fr)_324px] items-start gap-[38px]">
          <div class="flex min-w-0 flex-col gap-[21px]">
            <CartItem
              v-for="item in items"
              :key="item.id"
              :item="item"
              @increment="increment(item.id)"
              @decrement="decrement(item.id)"
              @remove="removeItem(item.id)"
              @remove-insurance="removeInsurance(item.id)"
              @remove-service="serviceId => removeService(item.id, serviceId)"
              @add-insurance="openInsurance(item.id)"
              @add-service="openServices(item.id)"
            />
          </div>

          <CartSummary :rows="summary" :total="payableTotal" @checkout="goCheckout" />
        </div>

        <CartRecentlyViewed class="mt-12" />
      </template>
    </main>

    <!-- =============================== Mobile ================================ -->
    <main class="flex flex-1 flex-col pb-[160px] lg:hidden" :class="isEmpty && 'pb-0'">
      <CartMobileTopBar :count="isEmpty ? 0 : count" @remove-all="removeAll" />

      <CartMobileEmpty v-if="isEmpty" />

      <template v-else>
        <CartMobileItem
          v-for="item in items"
          :key="item.id"
          :item="item"
          @increment="increment(item.id)"
          @decrement="decrement(item.id)"
          @remove="removeItem(item.id)"
          @remove-insurance="removeInsurance(item.id)"
          @remove-service="serviceId => removeService(item.id, serviceId)"
          @add-insurance="openInsurance(item.id)"
          @add-service="openServices(item.id)"
        />
      </template>
    </main>

    <div class="hidden lg:block">
      <LandingCeoSection />
      <LandingSiteFooter class="mt-5" />
    </div>

    <LandingMobileBottomNav />
    <CartMobileStickyBar v-if="!isEmpty" :total="payableTotal" @checkout="goCheckout" />

    <!-- Insurance selection (modal on desktop, bottom sheet on mobile) -->
    <CartInsuranceDialog
      v-model:open="insuranceDialog.open"
      :item="insuranceItem"
      @confirm="confirmInsurance"
    />

    <CartServicesDialog
      v-model:open="servicesDialog.open"
      :item="servicesItem"
      @confirm="confirmServices"
    />
  </div>
</template>
