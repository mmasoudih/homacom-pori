<script setup lang="ts">
import {
  IconChevronUp,
  IconMail,
  IconMapPin,
  IconPhone,
} from '@tabler/icons-vue'
import { footerLinks } from '~/data/landing'

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <footer class="border-t border-border/60 bg-secondary/30">
    <div class="mx-auto max-w-[1400px] px-5 pb-8 pt-10">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-12">
        <!-- brand + about -->
        <div class="lg:col-span-4">
          <img src="/homacom-logo.png" alt="هماکام" class="h-16 w-16 object-contain">
          <p class="mt-4 text-justify text-sm leading-7 text-muted-foreground">
            {{
              'شرکت بازرگانی کهن تجارت کنگان با نام تجاری هماکام (HomaCom)، یک مجموعه تخصصی در حوزه فروش و توزیع محصولات الکترونیکی است. هماکام فعالیت خود را در بازار آنلاین از تابستان ۱۴۰۱ آغاز کرد و در مدت کوتاهی توانست جایگاهی ارزشمند در میان مشتریان به دست آورد.'
            }}
          </p>
        </div>

        <!-- popular links -->
        <div class="lg:col-span-2">
          <h3 class="mb-4 text-base font-bold text-foreground">
            لینک‌های پربازدید
          </h3>
          <ul class="space-y-3">
            <li v-for="link in footerLinks.popularLinks" :key="link.label + link.href">
              <a :href="link.href" class="text-sm text-muted-foreground transition-colors hover:text-primary">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- customer guide -->
        <div class="lg:col-span-2">
          <h3 class="mb-4 text-base font-bold text-foreground">
            راهنمای مشتریان
          </h3>
          <ul class="space-y-3">
            <li v-for="link in footerLinks.customerGuide" :key="link.label + link.href">
              <a :href="link.href" class="text-sm text-muted-foreground transition-colors hover:text-primary">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- quick access / contact -->
        <div class="lg:col-span-2">
          <h3 class="mb-4 text-base font-bold text-foreground">
            دسترسی سریع
          </h3>
          <ul class="space-y-3">
            <li v-for="link in footerLinks.quickAccess" :key="link.label + link.href">
              <a :href="link.href" class="text-sm text-muted-foreground transition-colors hover:text-primary">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <!-- contact + trust -->
        <div class="lg:col-span-2">
          <h3 class="mb-4 text-base font-bold text-foreground">
            ارتباط با هماکام
          </h3>
          <div class="space-y-3 text-sm text-muted-foreground">
            <p class="flex items-center gap-2">
              <IconPhone class="size-4 shrink-0 text-primary" />
              <span dir="ltr">۰۱۳-۳۲۵۰۷۸۹</span>
            </p>
            <p class="flex items-center gap-2">
              <IconMail class="size-4 shrink-0 text-primary" />
              <span dir="ltr">info@homacom.ir</span>
            </p>
            <p class="flex items-start gap-2">
              <IconMapPin class="mt-1 size-4 shrink-0 text-primary" />
              <span>رشت، خیابان امام خمینی، نبش کوچه یاس، پلاک ۲۴، واحد ۵</span>
            </p>
          </div>
        </div>
      </div>

      <!-- bottom bar -->
      <div class="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 md:flex-row">
        <p class="text-center text-xs text-muted-foreground">
          © تمامی حقوق مادی و معنوی برای هماکام محفوظ است.
        </p>
        <button
          class="flex cursor-pointer items-center gap-2 rounded-full border border-border px-5 py-2 text-xs font-bold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          @click="scrollTop"
        >
          <IconChevronUp class="size-4" />
          بازگشت به بالا
        </button>
      </div>
    </div>
  </footer>
</template>
