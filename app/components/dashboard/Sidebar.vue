<template>
  <aside class="relative w-full">
    <div class="rounded-[20px] border border-T-400 bg-T-50 p-4">
      <DashboardProfileCard />
      <DashboardNavMenu class="mt-5" />
    </div>

    <!-- Support FAB -->
    <button
      type="button"
      class="absolute end-[-14px] top-[300px] hidden size-11 items-center justify-center rounded-full bg-primary text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 xl:flex"
      aria-label="پشتیبانی"
    >
      ؟
    </button>
  </aside>
</template>
