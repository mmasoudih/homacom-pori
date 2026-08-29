<script setup lang="ts">
import { IconChevronLeft, IconHeadphones, IconDeviceWatch, IconDeviceLaptop, IconDeviceMobile, IconSpeakerphone, IconUsb, IconDeviceDesktop, IconDeviceGamepad2 } from '@tabler/icons-vue'
import { categories } from '~/data/landing'

const iconMap: Record<string, typeof IconHeadphones> = {
  headphones: IconHeadphones,
  watch: IconDeviceWatch,
  laptop: IconDeviceLaptop,
  mobile: IconDeviceMobile,
  speakers: IconSpeakerphone,
  usb: IconUsb,
  display: IconDeviceDesktop,
  gamepad: IconDeviceGamepad2,
}
</script>

<template>
  <section id="categories" class="mx-auto w-full max-w-[1350px] px-4 py-5 md:px-0 md:py-6">
    <LandingSectionTitle title="دسته‌بندی‌ها" variant="centered" />

    <!-- Mobile: circular icon grid -->
    <div class="mt-[18px] grid grid-cols-4 gap-y-[13px] md:hidden">
      <a
        v-for="cat in categories"
        :key="cat.title"
        href="#"
        class="flex flex-col items-center gap-[6px]"
      >
        <span
          class="flex size-[78px] items-center justify-center rounded-full border-[5px]"
          :class="cat.accent ? 'border-[#fde9ec] bg-white' : 'border-[#f5f6f7] bg-white'"
        >
          <component
            :is="iconMap[cat.icon]"
            class="size-[30px]"
            :class="cat.accent ? 'text-primary' : 'text-[#6b7280]'"
          />
        </span>
        <span class="text-center text-[13px] font-medium leading-[18px] text-foreground">
          {{ cat.title }}
        </span>
      </a>
    </div>

    <!-- Desktop: card grid -->
    <div class="mt-[18px] hidden grid-cols-2 gap-x-[18px] gap-y-[13px] md:grid md:grid-cols-4">
      <article
        v-for="cat in categories"
        :key="cat.title"
        class="group relative h-[95px]"
      >
        <!-- Content card -->
        <a
          href="#"
          class="absolute inset-y-[5px] left-0 right-[63px] flex items-center rounded-[20px] border border-[#e5e7eb] bg-white pl-[12px] pr-[45px] transition-shadow hover:shadow-md"
        >
          <div class="flex flex-col gap-[2px]">
            <h3 class="text-[16px] font-bold leading-[24px] text-foreground">
              {{ cat.title }}
            </h3>
            <p class="flex items-center gap-1 text-[12.5px] text-[#9ca3af]">
              <span>محصول موجود است</span>
              <span class="text-[14px] font-bold text-foreground">{{ cat.count }}</span>
            </p>
          </div>
        </a>

        <!-- Circle -->
        <div
          class="absolute bottom-0 left-0 flex size-[95px] items-center justify-center rounded-full border-[5px] transition-colors"
          :class="cat.accent ? 'border-[#fde9ec] bg-white' : 'border-[#f5f6f7] bg-white'"
        >
          <component
            :is="iconMap[cat.icon]"
            class="size-[47px]"
            :class="cat.accent ? 'text-primary' : 'text-[#6b7280]'"
          />
        </div>

        <!-- Arrow button -->
        <a
          href="#"
          class="absolute bottom-[10px] left-[10px] flex size-[35px] items-center justify-center rounded-full border border-[#e5e7eb] bg-white transition-colors group-hover:border-primary group-hover:text-primary"
        >
          <IconChevronLeft class="size-[18px]" />
        </a>
      </article>
    </div>
  </section>
</template>
