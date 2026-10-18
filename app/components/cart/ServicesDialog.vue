<script setup lang="ts">
import type { CartItem, CartService } from '~/data/cart'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

const props = defineProps<{
  open: boolean
  item: CartItem | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: [ids: string[]]
}>()

/** Map both the cart's icon keys and the product catalog's to the exported art. */
const categoryIcons: Record<string, string> = {
  package: '/icons/cart/cat-package.svg',
  apps: '/icons/cart/cat-package.svg',
  invoice: '/icons/cart/cat-package.svg',
  games: '/icons/cart/cat-games.svg',
  shield: '/icons/cart/cat-shield.svg',
  insurance: '/icons/cart/cat-shield.svg',
  warranty: '/icons/cart/cat-shield.svg',
  bolt: '/icons/cart/cat-bolt.svg',
  charger: '/icons/cart/cat-bolt.svg',
  usb: '/icons/cart/cat-usb.svg',
  accessory: '/icons/cart/cat-usb.svg',
  sim: '/icons/cart/cat-usb.svg',
  memory: '/icons/cart/cat-memory.svg',
}

const draft = ref<Set<string>>(new Set())
const openGroup = ref('')

const groups = computed(() => props.item?.serviceGroups ?? [])

watch(
  () => [props.open, props.item?.id] as const,
  ([open]) => {
    if (!open) return
    draft.value = new Set((props.item?.services ?? []).map(service => service.id))
    const withSelection = groups.value.find(group =>
      group.items.some(service => draft.value.has(service.id)),
    )
    openGroup.value = withSelection?.id ?? groups.value[0]?.id ?? ''
  },
  { immediate: true },
)

function toggle(service: CartService) {
  if (draft.value.has(service.id)) draft.value.delete(service.id)
  else draft.value.add(service.id)
  draft.value = new Set(draft.value)
}

function countIn(groupId: string) {
  const group = groups.value.find(g => g.id === groupId)
  return group ? group.items.filter(service => draft.value.has(service.id)).length : 0
}

const selectedItems = computed(() =>
  groups.value.flatMap(group => group.items).filter(service => draft.value.has(service.id)),
)

const totalPrice = computed(() =>
  selectedItems.value.reduce((sum, service) => sum + service.price, 0),
)

function confirm() {
  emit('confirm', [...draft.value])
  emit('update:open', false)
}

/** Bottom sheet on mobile, centred modal on desktop (same shell as the other dialogs). */
const dialogShell
  = 'max-lg:top-auto! max-lg:bottom-0! max-lg:start-0! max-lg:translate-x-0! max-lg:translate-y-0! max-lg:w-full! max-lg:max-w-full! max-lg:rounded-b-none! max-lg:rounded-t-[24px]! max-lg:pb-[env(safe-area-inset-bottom)] max-lg:data-[state=open]:slide-in-from-bottom-full! max-lg:data-[state=closed]:slide-out-to-bottom-full! max-lg:data-[state=open]:zoom-in-100! max-lg:data-[state=closed]:zoom-out-100! max-lg:data-[state=open]:fade-in-100! max-lg:data-[state=closed]:fade-out-100! max-lg:duration-300!'
</script>

<template>
  <UiDialog :open="open" @update:open="emit('update:open', $event)">
    <UiDialogContent
      :class="dialogShell"
      :show-close-button="false"
      overlay-class="bg-[#1D1D1F]/45 backdrop-blur-[8px]"
      class="max-w-[543px] gap-0 rounded-[24px] border-0 p-0 lg:max-w-[543px]"
    >
      <!-- Header -->
      <div class="flex items-center justify-between gap-3 border-b border-T-400 px-6 py-5 lg:py-6">
        <div class="flex min-w-0 items-center gap-3">
          <span class="hidden size-[46px] shrink-0 items-center justify-center rounded-[12px] bg-R-10 lg:flex">
            <img src="/icons/cart/services-header.svg" alt="" class="size-5">
          </span>
          <div class="flex min-w-0 flex-col gap-1">
            <UiDialogTitle class="text-[16px] font-bold text-T-900">
              افزودن خدمات و لوازم جانبی
            </UiDialogTitle>
            <UiDialogDescription class="text-[12.5px] text-T-700">
              دسته موردنظر را باز کنید و انتخاب کنید
            </UiDialogDescription>
          </div>
        </div>

        <UiDialogClose class="flex size-5 shrink-0 items-center justify-center" aria-label="بستن">
          <img src="/icons/cart/dialog-close.svg" alt="" class="size-5">
        </UiDialogClose>
      </div>

      <!-- Categories -->
      <div class="scrollbar-thin flex max-h-[52vh] flex-col gap-2 overflow-y-auto px-4 py-4 lg:max-h-[422px] lg:px-6">
        <div
          v-for="group in groups"
          :key="group.id"
          class="rounded-[8px] border border-T-300"
        >
          <button
            type="button"
            class="flex h-[50px] w-full items-center gap-3 px-3 text-start"
            :aria-expanded="openGroup === group.id"
            @click="openGroup = openGroup === group.id ? '' : group.id"
          >
            <img
              :src="categoryIcons[group.icon] ?? categoryIcons.package"
              alt=""
              class="size-6 shrink-0"
            >

            <UiTypography as="span" size="lg" weight="semibold" class="min-w-0 flex-1 truncate">
              {{ group.title }}
            </UiTypography>

            <span
              v-if="countIn(group.id)"
              class="flex size-[25px] shrink-0 items-center justify-center rounded-full bg-R-300 text-[12.5px] font-bold leading-none text-white"
            >{{ toPersianDigits(countIn(group.id)) }}</span>

            <img
              src="/icons/cart/angle-down.svg"
              alt=""
              class="size-4 shrink-0 transition-transform"
              :class="openGroup === group.id ? 'rotate-180' : ''"
            >
          </button>

          <div v-if="openGroup === group.id" class="flex flex-col gap-2 px-3 pb-3">
            <span class="h-px w-full bg-T-300" />
            <button
              v-for="service in group.items"
              :key="service.id"
              type="button"
              role="checkbox"
              :aria-checked="draft.has(service.id)"
              class="flex min-h-5 items-center gap-3 text-start"
              @click="toggle(service)"
            >
              <img
                :src="draft.has(service.id)
                  ? '/icons/cart/checkbox-on.svg'
                  : '/icons/cart/checkbox-off.svg'"
                alt=""
                class="size-[18px] shrink-0"
              >

              <UiTypography as="span" size="md" class="min-w-0 flex-1 truncate">
                {{ service.label }}
              </UiTypography>

              <span class="flex shrink-0 items-baseline gap-1.5">
                <UiTypography as="span" size="xs" color="muted">تومان</UiTypography>
                <UiTypography as="span" size="md" weight="medium">
                  {{ formatPriceFa(service.price) }}
                </UiTypography>
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between gap-3 border-t border-T-400 px-5 py-[15px] lg:px-6">
        <div class="flex flex-col gap-1">
          <UiTypography as="span" size="md" color="muted">
            ({{ toPersianDigits(selectedItems.length) }} خدمت) برای این کالا
          </UiTypography>
          <div class="flex items-baseline gap-1.5">
            <UiTypography as="span" size="md" color="muted">تومان</UiTypography>
            <UiTypography as="span" size="lg" weight="semibold">
              {{ formatPriceFa(totalPrice) }}
            </UiTypography>
          </div>
        </div>

        <button
          type="button"
          class="flex h-[42px] w-[121px] shrink-0 items-center justify-center rounded-[12px] bg-R-300 transition-colors hover:bg-R-400"
          @click="confirm"
        >
          <UiTypography as="span" size="lg" weight="bold" color="white">تایید</UiTypography>
        </button>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>
