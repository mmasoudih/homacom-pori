<script setup lang="ts">
import { IconX, IconFileText, IconInfoCircle } from '@tabler/icons-vue'
import type { ServiceCatalogItem, ServicePackage } from '~/data/product'
import { formatPrice } from '~/utils/format'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    id?: string
    packages: ServicePackage[]
    addedServices: ServiceCatalogItem[]
    showAddedServices?: boolean
    class?: string
  }>(),
  { id: 'product-services', showAddedServices: false, class: '' },
)

const emit = defineEmits<{
  'add-package': [id: string]
  'open-details': []
  'remove-service': [id: string]
}>()
</script>

<template>
  <section :id="props.id" :class="cn('flex w-full scroll-mt-6 flex-col gap-4', props.class)">
    <!-- Added services (selected state) -->
    <div v-if="showAddedServices && addedServices.length" class="flex flex-col gap-3">
      <div class="flex items-center gap-2">
        <span class="h-[18px] w-1 rounded-full bg-R-300" />
        <h2 class="text-[16px] font-bold text-T-900">خدمات افزوده شده</h2>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <span
          v-for="service in addedServices"
          :key="service.id"
          class="flex h-[32px] items-center gap-2 rounded-full border border-R-100 bg-R-10 ps-3 pe-2 text-[12.5px] text-R-300"
        >
          {{ service.label }}
          <button
            type="button"
            class="flex size-4 items-center justify-center rounded-full text-R-300 transition-colors hover:text-R-400"
            :aria-label="`حذف ${service.label}`"
            @click="emit('remove-service', service.id)"
          >
            <IconX class="size-3.5" />
          </button>
        </span>
      </div>
    </div>

    <!-- Packages -->
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <span class="h-[18px] w-1 rounded-full bg-R-300" />
        <h2 class="text-[16px] font-bold text-T-900">خدمات هماکام برای ارتقای آسایش شما</h2>
      </div>

      <div class="flex flex-col gap-3">
        <article
          v-for="pkg in packages"
          :key="pkg.id"
          class="flex items-center justify-between gap-4 rounded-2xl border border-T-300 bg-T-50 px-4 py-4"
        >
          <div class="flex min-w-0 flex-1 flex-col gap-1.5">
            <div class="flex items-center gap-2">
              <span class="flex h-[22px] items-center rounded-lg bg-R-10 px-2 text-[11px] font-bold text-R-300">
                {{ pkg.provider }}
              </span>
              <h3 class="truncate text-[13px] font-bold text-T-900">{{ pkg.name }}</h3>
            </div>
            <p class="text-[12px] leading-[18px] text-T-700">{{ pkg.description }}</p>
          </div>

          <div class="flex shrink-0 items-center gap-5">
            <button
              type="button"
              class="flex items-center gap-1 text-[12.5px] text-[#3D7BFA] transition-opacity hover:opacity-80"
              @click="emit('open-details')"
            >
              <IconInfoCircle class="size-4" />
              شرح بیمه
            </button>

            <div class="flex flex-col items-start gap-0.5">
              <span class="flex items-baseline gap-1 text-[15px] font-extrabold text-T-900">
                {{ formatPrice(pkg.price) }}
                <span class="text-[11px] font-normal text-T-700">تومان</span>
              </span>
              <span class="text-[11px] text-T-600">مبلغ بیمه‌</span>
            </div>

            <button
              type="button"
              class="flex h-[42px] items-center gap-2 rounded-xl bg-R-300 px-4 text-[13px] font-bold text-white transition-colors hover:bg-R-400"
              @click="emit('add-package', pkg.id)"
            >
              <IconFileText class="size-4" />
              افزودن به سبد خرید
            </button>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
