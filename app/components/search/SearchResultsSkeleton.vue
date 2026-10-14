<template>
  <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-6" aria-busy="true" aria-label="در حال جستجو">
    <!-- Filter card skeleton — desktop only (mobile uses the filter sheet). -->
    <div class="hidden w-full rounded-[20px] border border-T-400 bg-T-50 p-5 lg:block lg:w-[245px] lg:shrink-0">
      <UiSkeleton class="ms-auto h-5 w-24 rounded-full" />

      <div class="mt-6 flex items-center justify-between">
        <UiSkeleton class="h-4 w-32 rounded-full" />
        <UiSkeleton class="h-6 w-11 rounded-full" />
      </div>

      <div class="mt-5 flex flex-col gap-6 border-t border-T-200 pt-5">
        <div v-for="i in 5" :key="i" class="flex items-center justify-between">
          <UiSkeleton class="h-4 w-24 rounded-full" />
          <UiSkeleton class="h-4 w-4 rounded-full" />
        </div>
      </div>
    </div>

    <!-- Results skeleton -->
    <div class="min-w-0 flex-1">
      <!-- Toolbar — desktop only (mobile renders the real sort/filter pill). -->
      <div class="hidden items-center gap-5 border-b border-T-200 pb-4 lg:flex">
        <UiSkeleton class="h-5 w-5 rounded-full" />
        <UiSkeleton class="h-4 w-20 rounded-full" />
        <UiSkeleton class="h-4 w-20 rounded-full" />
        <UiSkeleton class="h-4 w-20 rounded-full" />
        <UiSkeleton class="ms-auto h-4 w-16 rounded-full" />
      </div>

      <!-- Desktop grid -->
      <div class="mt-5 hidden grid-cols-4 gap-px bg-T-200 lg:grid">
        <div v-for="i in 8" :key="i" class="flex flex-col items-center gap-3 bg-T-50 p-4">
          <UiSkeleton class="aspect-square w-full rounded-[16px]" />
          <UiSkeleton class="h-3 w-full rounded-full" />
          <UiSkeleton class="h-3 w-2/3 rounded-full" />
          <div class="mt-1 flex w-full items-center gap-2">
            <UiSkeleton class="size-3 rounded-full" />
            <UiSkeleton class="h-3 w-20 rounded-full" />
          </div>
        </div>
      </div>

      <!-- Mobile list -->
      <div class="flex flex-col border-t border-T-200 lg:hidden">
        <div
          v-for="i in 4"
          :key="i"
          class="flex items-start gap-3 border-b border-T-200 py-5"
        >
          <UiSkeleton class="size-[96px] shrink-0 rounded-[16px]" />
          <div class="flex min-w-0 flex-1 flex-col gap-6">
            <div class="flex flex-col items-start gap-3">
              <UiSkeleton class="h-3.5 w-[85%] rounded-full" />
              <UiSkeleton class="h-3.5 w-[45%] rounded-full" />
            </div>
            <div class="flex flex-col items-end gap-3">
              <UiSkeleton class="h-4 w-32 rounded-full" />
              <UiSkeleton class="h-3.5 w-20 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
