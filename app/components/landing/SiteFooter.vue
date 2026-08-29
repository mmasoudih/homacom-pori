<script setup lang="ts">
import { IconPhoneCall, IconMailOpened, IconMapPin, IconChevronDown, IconArrowUp } from '@tabler/icons-vue'
import { footerData } from '~/data/landing'

const openRow = ref('')

const accordionRows = [
  ...footerData.columns.map((col) => ({ title: col.title, links: col.links })),
  {
    title: 'ارتباط با هماکام',
    links: [
      `تماس: ${footerData.phones.join(' | ')}`,
      `ایمیل: ${footerData.email}`,
      `آدرس: ${footerData.address}`,
    ],
  },
]

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <footer class="bg-T-200 pt-10">
    <!-- Mobile: accordion + about + back to top -->
    <div class="lg:hidden">
      <!-- Accordion -->
      <div class="mx-auto flex max-w-[1260px] flex-col px-4">
        <div
          v-for="row in accordionRows"
          :key="row.title"
          class="border-b border-T-400"
        >
          <button
            class="flex h-[60px] w-full items-center justify-between text-[15px] font-bold text-foreground"
            @click="openRow = openRow === row.title ? '' : row.title"
          >
            <span>{{ row.title }}</span>
            <IconChevronDown
              class="size-4 text-T-600 transition-transform duration-200"
              :class="openRow === row.title ? 'rotate-180' : ''"
            />
          </button>
          <div
            v-if="openRow === row.title"
            class="flex flex-col gap-3 pb-4"
          >
            <a
              v-for="(link, li) in row.links"
              :key="li"
              href="#"
              class="text-[13px] text-T-700 transition-colors hover:text-primary"
            >{{ link }}</a>
          </div>
        </div>

        <!-- Trust badges -->
        <div class="flex items-center justify-center gap-6 py-6">
          <img
            v-for="(badge, i) in footerData.badges"
            :key="i"
            :src="badge.image"
            :alt="badge.alt"
            class="h-[66px] w-[66px] object-contain"
          >
        </div>
      </div>

      <!-- About -->
      <div class="border-t border-T-400">
        <div class="mx-auto max-w-[1260px] px-4 py-6">
          <div class="flex items-start gap-3">
            <a href="#" class="shrink-0">
              <img src="/homacom-logo.png" alt="هماکام" class="h-[61px] w-[58px] object-contain">
            </a>
            <div class="flex flex-col gap-2">
              <h3 class="text-[16px] font-bold text-foreground">فروشگاه اینترنتی هماکام</h3>
              <p class="line-clamp-3 text-[13px] leading-[22px] text-T-700">
                {{ footerData.about }}
              </p>
              <a href="#" class="text-[13px] font-medium text-primary">نمایش بیشتر</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Back to top + Copyright -->
      <div class="mx-auto max-w-[1260px] px-4 pb-28 pt-2 xl:pb-10">
        <div class="flex flex-col items-center gap-4 border-t border-T-400 py-4">
          <a
            href="#"
            class="flex h-[46px] items-center gap-2 rounded-full border border-T-400 bg-T-50 px-6 text-[13px] font-medium text-foreground transition-colors hover:text-primary"
            @click.prevent="scrollTop"
          >
            <IconArrowUp class="size-4 text-primary" />
            بازگشت به بالا
          </a>
          <p class="text-[12px] text-T-600">{{ footerData.copyright }}</p>
        </div>
      </div>
    </div>

    <!-- Desktop -->
    <div class="hidden lg:block">
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
                class="text-[13px] text-T-700 transition-colors hover:text-primary"
              >{{ link }}</a>
            </nav>
          </div>
        </div>
      </div>

      <!-- About section -->
      <div class="mx-auto mt-8 max-w-[1260px] px-4">
        <div class="flex items-start gap-6 rounded-2xl bg-T-50 p-6">
          <a href="#" class="shrink-0">
            <img src="/homacom-logo.png" alt="هماکام" class="h-[86px] w-[91px] object-contain">
          </a>
          <p class="flex-1 text-[13px] leading-[22px] text-T-700">
            {{ footerData.about }}
          </p>
        </div>
      </div>

      <!-- Back to top + Copyright -->
      <div class="mx-auto mt-4 max-w-[1260px] px-4">
        <div class="flex flex-col items-center gap-3 border-t border-T-400 py-4">
          <a
            href="#"
            class="flex items-center gap-2 text-[13px] font-medium text-foreground transition-colors hover:text-primary"
            @click.prevent="scrollTop"
          >
            <span class="h-px w-16 bg-T-400" />
            بازگشت به بالا
            <span class="h-px w-16 bg-T-400" />
          </a>
          <p class="text-[12px] text-T-600">{{ footerData.copyright }}</p>
        </div>
      </div>
    </div>
  </footer>
</template>
