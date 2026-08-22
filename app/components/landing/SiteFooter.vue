<script setup lang="ts">
import { IconPhoneCall, IconMailOpened, IconMapPin } from '@tabler/icons-vue'
import { footerData } from '~/data/landing'
</script>

<template>
  <footer class="bg-[#f5f6f7] pt-10">
    <!-- Links section -->
    <div class="mx-auto max-w-[1260px] px-4">
      <div class="grid grid-cols-2 gap-8 md:grid-cols-5">
        <!-- Trust badges -->
        <div class="flex flex-col items-center gap-4">
          <img
            v-for="(badge, i) in footerData.badges"
            :key="i"
            :src="badge.image"
            :alt="badge.alt"
            class="h-[66px] w-[66px] object-contain"
          >
        </div>

        <!-- Contact -->
        <div class="flex flex-col gap-3">
          <h4 class="text-[14px] font-bold text-foreground">ارتباط با هماکام</h4>
          <div class="flex items-center gap-2 text-[13px] text-foreground">
            <IconPhoneCall class="size-4 shrink-0 text-primary" />
            <span class="font-medium">تماس:</span>
            <span dir="ltr">{{ footerData.phones.join(' | ') }}</span>
          </div>
          <div class="flex items-center gap-2 text-[13px] text-foreground">
            <IconMailOpened class="size-4 shrink-0 text-primary" />
            <span class="font-medium">ایمیل:</span>
            <span>{{ footerData.email }}</span>
          </div>
          <div class="flex items-start gap-2 text-[13px] text-foreground">
            <IconMapPin class="mt-0.5 size-4 shrink-0 text-primary" />
            <span class="font-medium">آدرس:</span>
            <span class="leading-[20px]">{{ footerData.address }}</span>
          </div>
        </div>

        <!-- Link columns -->
        <div
          v-for="col in footerData.columns"
          :key="col.title"
          class="flex flex-col gap-3"
        >
          <h4 class="text-[14px] font-bold text-foreground">{{ col.title }}</h4>
          <nav class="flex flex-col gap-2">
            <a
              v-for="link in col.links"
              :key="link"
              href="#"
              class="text-[13px] text-[#6b7280] transition-colors hover:text-primary"
            >{{ link }}</a>
          </nav>
        </div>
      </div>
    </div>

    <!-- About section -->
    <div class="mx-auto mt-8 max-w-[1260px] px-4">
      <div class="flex items-start gap-6 rounded-2xl bg-white p-6">
        <a href="#" class="shrink-0">
          <img src="/homacom-logo.png" alt="هماکام" class="h-[86px] w-[91px] object-contain">
        </a>
        <p class="flex-1 text-[13px] leading-[22px] text-[#6b7280]">
          {{ footerData.about }}
        </p>
      </div>
    </div>

    <!-- Back to top + Copyright -->
    <div class="mx-auto mt-4 max-w-[1260px] px-4">
      <div class="flex flex-col items-center gap-3 border-t border-[#e5e7eb] py-4">
        <a
          href="#"
          class="flex items-center gap-2 text-[13px] font-medium text-foreground transition-colors hover:text-primary"
          @click.prevent="window.scrollTo({ top: 0, behavior: 'smooth' })"
        >
          <span class="h-px w-16 bg-[#e5e7eb]" />
          بازگشت به بالا
          <span class="h-px w-16 bg-[#e5e7eb]" />
        </a>
        <p class="text-[12px] text-[#9ca3af]">{{ footerData.copyright }}</p>
      </div>
    </div>
  </footer>
</template>
