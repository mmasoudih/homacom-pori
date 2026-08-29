<script setup lang="ts">
import { IconChevronLeft, IconDeviceLaptop, IconDeviceMobile } from '@tabler/icons-vue'
import { bestOfCategories } from '~/data/landing'

const activeTab = ref('لپ‌تاپ')

const tabs = [
  { label: 'لپ‌تاپ', icon: IconDeviceLaptop },
  { label: 'گوشی موبایل', icon: IconDeviceMobile },
]

const activeItems = computed(() => {
  const col = bestOfCategories.find((c) => c.category === activeTab.value)
  return col?.items ?? []
})
</script>

<template>
  <section class="mx-auto w-full max-w-[1350px] px-4 py-5 md:px-0 md:py-6">
    <LandingSectionTitle title="بهترین‌های هر دسته‌بندی" variant="centered" />

    <!-- Mobile: tabs + list -->
    <div class="mt-[18px] lg:hidden">
      <!-- Tab bar -->
      <div class="flex border-b border-[#e5e7eb]">
        <button
          v-for="tab in tabs"
          :key="tab.label"
          class="flex h-[60px] flex-1 items-center justify-center gap-2 border-b-2 text-[15px] font-bold transition-colors"
          :class="
            activeTab === tab.label
              ? 'border-primary text-foreground'
              : 'border-transparent text-[#9ca3af]'
          "
          @click="activeTab = tab.label"
        >
          <component :is="tab.icon" class="size-[22px]" />
          {{ tab.label }}
        </button>
      </div>

      <!-- Items -->
      <article
        v-for="(item, i) in activeItems"
        :key="i"
        class="flex h-[122px] items-center border-b border-[#e5e7eb]"
      >
        <!-- Image -->
        <div class="ml-3 flex size-[84px] shrink-0 items-center justify-center">
          <img
            :src="item.image"
            :alt="item.title"
            class="max-h-full max-w-full object-contain"
          >
        </div>

        <!-- Info -->
        <div class="flex flex-1 flex-col gap-1">
          <h4 class="line-clamp-2 text-[13px] font-bold leading-[18px] text-foreground">
            {{ item.title }}
          </h4>
          <div class="flex items-center gap-1">
            <span
              v-if="item.oldPrice"
              class="text-[13px] font-bold text-[#9ca3af] line-through"
            >{{ item.oldPrice }}</span>
            <div class="flex items-baseline gap-1">
              <span class="text-[15px] font-extrabold text-foreground">{{ item.price }}</span>
              <span class="text-[11px] text-[#9ca3af]">تومان</span>
            </div>
            <span
              v-if="item.discount"
              class="mr-1 flex h-[20px] items-center justify-center rounded-lg bg-[#fde9ec] px-1 text-[11px] font-extrabold text-primary"
            >{{ item.discount }}</span>
          </div>
        </div>
      </article>
    </div>

    <!-- Desktop: 3-column grid -->
    <div class="mt-[18px] hidden grid-cols-1 gap-[18px] md:grid md:grid-cols-3 lg:grid">
      <div
        v-for="col in bestOfCategories"
        :key="col.category"
        class="flex flex-col"
      >
        <!-- Column header -->
        <div class="flex h-[70px] items-center justify-between border-b border-[#e5e7eb] px-4">
          <h3 class="text-[14px] font-bold text-foreground">{{ col.category }}</h3>
          <a href="#" class="text-[12px] font-medium text-[#9ca3af] transition-colors hover:text-primary">مشاهده همه</a>
        </div>

        <!-- Mini cards -->
        <article
          v-for="(item, i) in col.items"
          :key="i"
          class="flex h-[155px] items-center border-b border-[#e5e7eb] px-4 transition-colors hover:bg-secondary/30"
        >
          <!-- Image -->
          <div class="ml-4 flex size-[84px] shrink-0 items-center justify-center">
            <img
              :src="item.image"
              :alt="item.title"
              class="max-h-full max-w-full object-contain"
            >
          </div>

          <!-- Info -->
          <div class="flex flex-1 flex-col gap-1">
            <h4 class="line-clamp-2 text-[13px] font-bold leading-[18px] text-foreground">
              {{ item.title }}
            </h4>
            <div class="flex items-center gap-1">
              <span
                v-if="item.oldPrice"
                class="text-[13px] font-bold text-[#9ca3af] line-through"
              >{{ item.oldPrice }}</span>
              <div class="flex items-baseline gap-1">
                <span class="text-[15px] font-extrabold text-foreground">{{ item.price }}</span>
                <span class="text-[11px] text-[#9ca3af]">تومان</span>
              </div>
              <span
                v-if="item.discount"
                class="mr-1 flex h-[20px] items-center justify-center rounded-lg bg-[#fde9ec] px-1 text-[11px] font-extrabold text-primary"
              >{{ item.discount }}</span>
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- Arrows (desktop) -->
    <div class="relative hidden lg:block">
      <button
        class="absolute -left-[19px] top-[200px] flex size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-foreground transition-colors hover:bg-secondary"
        aria-label="قبلی"
      >
        <IconChevronLeft class="size-[18px]" />
      </button>
      <button
        class="absolute -right-[19px] top-[200px] flex size-[38px] -translate-y-1/2 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-foreground transition-colors hover:bg-secondary"
        aria-label="بعدی"
      >
        <IconChevronLeft class="size-[18px] rotate-180" />
      </button>
    </div>
  </section>
</template>
