<script setup lang="ts">
const error = useError()

const is404 = computed(() => error.value?.statusCode === 404)

const title = computed(() =>
  is404.value ? 'صفحه مورد نظر شما پیدا نشد' : 'خطایی رخ داده است',
)
const subtitle = computed(() =>
  is404.value
    ? 'متاسفانه محتوای مورد نظر شما تغییر کرده یا حذف شده است.'
    : 'مشکلی در پردازش درخواست شما پیش آمد. لطفاً دوباره تلاش کنید.',
)

useHead({
  title: 'صفحه پیدا نشد | هماکام',
})

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-background">
    <LandingSiteHeader />

    <main class="flex flex-col items-center px-4 pb-16 pt-16 lg:pt-24">
      <!-- 404 graphic -->
      <div class="flex flex-col items-center">
        <img
          v-if="is404"
          src="/assets/404.svg"
          alt="خطای ۴۰۴"
          class="w-[112px] object-contain lg:w-[140px]"
        >
        <span
          v-else
          class="text-[96px] font-black leading-none text-T-500 lg:text-[140px]"
        >
          !
        </span>
      </div>

      <!-- Message -->
      <h1 class="mt-8 text-center text-[24px] font-bold leading-[36px] text-foreground lg:mt-10 lg:text-[30px]">
        {{ title }}
      </h1>
      <p class="mt-3 max-w-[520px] text-center text-[15px] leading-[28px] text-T-700">
        {{ subtitle }}
      </p>

      <!-- Back home -->
      <button
        class="mt-10 flex h-[52px] items-center gap-2 rounded-full bg-primary px-10 text-[15px] font-semibold text-white shadow-[0_10px_25px_rgba(239,35,60,0.3)] transition-colors hover:bg-primary/90"
        @click="goHome"
      >
        بازگشت به صفحه اصلی
      </button>
    </main>

    <PagesAboutBand class="mt-auto" />

    <LandingSiteFooter class="mt-auto" />
    <LandingMobileBottomNav />
  </div>
</template>
