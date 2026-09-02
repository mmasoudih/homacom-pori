<script setup lang="ts">
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{ class?: string }>(),
  { class: '' },
)
</script>

<template>
  <div :class="cn('w-full', props.class)" aria-busy="true" aria-label="در حال بارگذاری محصول">
    <!-- ============================== Mobile ============================== -->
    <div class="flex flex-col gap-5 lg:hidden">
      <UiSkeleton class="mx-auto h-[11px] w-[220px] rounded-full" />
      <UiSkeleton class="aspect-square w-full rounded-none" />

      <div class="-mt-4 flex flex-col gap-4 rounded-t-2xl bg-T-50 px-4 pt-6">
        <UiSkeleton class="h-[26px] w-full rounded-lg" />
        <UiSkeleton class="h-[26px] w-2/3 rounded-lg" />
        <UiSkeleton class="h-[18px] w-[140px] rounded-full" />
        <div class="flex items-center justify-between">
          <UiSkeleton class="h-[30px] w-[150px] rounded-full" />
          <div class="flex gap-1.5">
            <UiSkeleton class="h-[30px] w-[72px] rounded-full" />
            <UiSkeleton class="h-[30px] w-[62px] rounded-full" />
          </div>
        </div>
        <div class="h-px w-full bg-T-200" />
        <UiSkeleton class="h-[20px] w-[80px] rounded-full" />
        <div class="grid grid-cols-4 gap-2">
          <UiSkeleton v-for="i in 4" :key="i" class="h-[38px] rounded-lg" />
        </div>
        <UiSkeleton class="h-[20px] w-[80px] rounded-full" />
        <div class="grid grid-cols-2 gap-2">
          <UiSkeleton v-for="i in 4" :key="i" class="h-[38px] rounded-lg" />
        </div>
        <div class="flex flex-col gap-2">
          <UiSkeleton v-for="i in 3" :key="i" class="h-[58px] w-full rounded-xl" />
        </div>
        <UiSkeleton class="h-[41px] w-full rounded-xl" />
      </div>
    </div>

    <!-- ============================== Desktop ============================= -->
    <div class="hidden flex-col gap-6 lg:flex">
      <!-- Breadcrumb -->
      <UiSkeleton class="h-[11px] w-[628px] rounded-full" />

      <!-- Hero -->
      <div class="grid grid-cols-[374px_1fr_324px] items-start gap-9">
        <!-- Purchase box skeleton -->
        <div class="flex w-full flex-col gap-5 rounded-2xl border border-T-300 bg-T-50 p-5">
          <UiSkeleton class="h-[258px] w-full rounded-xl" />
          <UiSkeleton class="h-[91px] w-full rounded-xl" />
          <UiSkeleton class="h-[94px] w-full rounded-xl" />
        </div>

        <!-- Info box skeleton -->
        <div class="flex w-full flex-col gap-5">
          <UiSkeleton class="h-[52px] w-full rounded-lg" />
          <UiSkeleton class="h-[18px] w-[240px] rounded-full" />
          <div class="flex items-center gap-4">
            <UiSkeleton class="h-[30px] w-[188px] rounded-full" />
            <UiSkeleton class="h-[30px] w-[84px] rounded-full" />
          </div>
          <UiSkeleton class="h-px w-full" />
          <UiSkeleton class="h-[34px] w-[320px] rounded-full" />
          <UiSkeleton class="h-[34px] w-[260px] rounded-full" />
          <div class="flex items-center gap-2">
            <UiSkeleton class="size-6 rounded-lg" />
            <UiSkeleton class="size-6 rounded-lg" />
            <UiSkeleton class="size-6 rounded-lg" />
            <UiSkeleton class="size-6 rounded-lg" />
          </div>
          <UiSkeleton class="h-[42px] w-[280px] rounded-xl" />
          <UiSkeleton class="h-[18px] w-[200px] rounded-full" />
        </div>

        <!-- Gallery skeleton -->
        <div class="flex w-full flex-col items-center gap-4">
          <UiSkeleton class="aspect-square w-full rounded-2xl" />
          <div class="flex items-center gap-3">
            <UiSkeleton v-for="i in 5" :key="i" class="size-[68px] rounded-xl" />
          </div>
        </div>
      </div>

      <!-- Feature rows skeleton -->
      <div class="flex w-full flex-col gap-3 rounded-2xl border border-T-300 bg-T-50 p-4">
        <UiSkeleton v-for="i in 4" :key="i" class="h-[38px] w-full rounded-lg" />
      </div>
    </div>
  </div>
</template>
