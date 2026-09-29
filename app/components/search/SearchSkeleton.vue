<template>
  <div class="flex flex-col gap-6" aria-busy="true" aria-label="در حال جستجو">
    <!-- Section title -->
    <UiSkeleton class="h-4 w-40 self-end rounded-full" />

    <!-- Category tiles -->
    <div class="flex gap-4 overflow-hidden">
      <div v-for="i in 5" :key="i" class="flex shrink-0 flex-col items-center gap-2">
        <UiSkeleton class="size-[76px] rounded-[16px]" />
        <UiSkeleton class="h-3 w-14 rounded-full" />
      </div>
    </div>

    <div class="h-px w-full bg-T-200" />

    <!-- Product rows -->
    <div class="flex flex-col gap-3">
      <div
        v-for="i in 4"
        :key="i"
        class="flex items-center gap-3 rounded-xl border border-T-400 p-2"
      >
        <div class="flex min-w-0 flex-1 flex-col gap-2">
          <UiSkeleton class="h-3.5 w-full rounded-full" />
          <UiSkeleton class="h-3.5 w-2/3 rounded-full" />
          <UiSkeleton class="h-3 w-24 rounded-full" />
        </div>
        <UiSkeleton class="size-[84px] shrink-0 rounded-xl" />
      </div>
    </div>
  </div>
</template>
