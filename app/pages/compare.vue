<script setup lang="ts">
import { COMPARE_MAX, compareSpecGroups } from "~/data/compare";

const { items, remove } = useCompare();

const dialogOpen = ref(false);

const canAdd = computed(() => items.value.length < COMPARE_MAX);

useHead({
  title: "مقایسه محصولات | هماکام",
});
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-background">
    <LandingSiteHeader />

    <main
      class="mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-4 pt-3 lg:px-[45px] lg:pb-16 lg:pt-0"
    >
      <h1
        class="sr-only text-start text-[22px] font-bold text-T-900 lg:not-sr-only lg:mt-[34px]"
      >
        مقایسه محصولات
      </h1>

      <!-- Product slots — full-bleed on mobile, white card on desktop -->
      <section
        class="-mx-4 mt-0 overflow-hidden rounded-[20px] bg-T-50 lg:mx-0 lg:mt-[34px] lg:px-6 lg:py-8 lg:shadow-[0_0_20px_rgba(0,0,0,0.08),0_0_4px_rgba(0,0,0,0.03)]"
      >
        <div
          class="flex gap-0 overflow-x-auto scrollbar-none lg:gap-4 lg:overflow-visible"
        >
          <div
            v-for="product in items"
            :key="product.id"
            class="w-1/2 shrink-0 lg:w-[calc((100%-3rem)/4)]"
          >
            <CompareProductSlot :product="product" @remove="remove" />
          </div>
          <div v-if="canAdd" class="w-1/2 shrink-0 lg:w-[calc((100%-3rem)/4)]">
            <CompareAddSlot @add="dialogOpen = true" />
          </div>
        </div>
      </section>

      <!-- Specs comparison -->
      <CompareSpecsTable
        v-if="items.length"
        class="mt-[26px] lg:mt-[45px]"
        :products="items"
        :spec-groups="compareSpecGroups"
      />
    </main>
    <!-- Marketing band — the same shared component used on the landing page -->
    <div class="">
      <LandingCeoSection />
    </div>
    <LandingSiteFooter />
    <LandingMobileBottomNav />

    <CompareAddProductDialog v-model:open="dialogOpen" />
  </div>
</template>
