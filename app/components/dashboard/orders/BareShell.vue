<template>
  <div class="hidden min-h-dvh flex-col bg-T-50 xl:flex">
    <LandingSiteHeader />

    <main class="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 lg:px-6 lg:py-8">
      <slot />
    </main>
  </div>
</template>
