<script setup lang="ts">
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-vue'

const showFull = ref(false)
</script>

<template>
  <section class="mx-auto w-full max-w-[1400px] px-5">
    <div class="relative overflow-hidden rounded-3xl border border-border bg-card p-8 md:p-12">
      <div class="flex flex-col items-center gap-6 text-center">
        <h2 class="text-2xl font-black text-foreground md:text-3xl">
          درباره فروشگاه اینترنتی هماکام
        </h2>
        <button
          class="mb-4 flex cursor-pointer items-center gap-1 rounded-full border border-primary px-5 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          @click="showFull = !showFull"
        >
          {{ showFull ? 'بستن' : 'نمایش بیشتر' }}
          <IconChevronLeft v-if="!showFull" class="size-4" />
          <IconChevronRight v-else class="size-4" />
        </button>
      </div>
      <div class="mx-auto max-w-4xl space-y-4 text-center leading-9 text-muted-foreground">
        <p>
          شرکت بازرگانی کهن تجارت کنگان با نام تجاری هماکام (HomaCom)، یک مجموعه تخصصی در حوزه فروش و
          توزیع محصولات الکترونیکی است. هماکام فعالیت خود را در بازار آنلاین از تابستان ۱۴۰۱ آغاز کرد و
          در مدت کوتاهی توانست جایگاهی ارزشمند در میان مشتریان و همکاران حوزه دیجیتال به دست آورد.
        </p>
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200"
          leave-to-class="opacity-0 -translate-y-2"
          leave-from-class="opacity-100 translate-y-0"
        >
          <p v-if="showFull" class="pt-2">
            فروشگاه اینترنتی هماکام مرجعی بزرگ و معتبر برای خرید انواع لوازم دیجیتال و غیردیجیتال مورد
            نیاز شماست. با ورود به فروشگاه آنلاین هماکام، کلیه لوازم مورد نیاز خود نظیر گجت‌ها، موبایل و
            لپ تاپ، لوازم خانگی برقی و غیربرقی و... را با ضمانت اصالت و بهترین قیمت تهیه کنید.
          </p>
        </Transition>
      </div>
    </div>
  </section>
</template>
