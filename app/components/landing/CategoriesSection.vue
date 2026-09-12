<script setup lang="ts">
import { categories } from '~/data/landing'
import mobileIcon from '../../../public/icons/mobile.svg?raw'
import laptopIcon from '../../../public/icons/laptop.svg?raw'
import smartWatchIcon from '../../../public/icons/smart-watch.svg?raw'
import headphonesIcon from '../../../public/icons/headphones-waveform.svg?raw'
import gameControllerIcon from '../../../public/icons/game-controller.svg?raw'
import displayIcon from '../../../public/icons/display.svg?raw'
import usbDriveIcon from '../../../public/icons/usb-drive.svg?raw'
import speakersIcon from '../../../public/icons/speakers.svg?raw'
import arrowUpLeftSmall from '../../../public/icons/arrow-up-left-small.svg?raw'

const iconMap: Record<string, string> = {
  headphones: headphonesIcon,
  watch: smartWatchIcon,
  laptop: laptopIcon,
  mobile: mobileIcon,
  speakers: speakersIcon,
  usb: usbDriveIcon,
  display: displayIcon,
  gamepad: gameControllerIcon,
}
</script>

<template>
  <section id="categories" class="mx-auto w-full max-w-[1350px] px-4 py-5 md:px-0 md:py-16">
    <LandingSectionTitle title="دسته‌بندی‌ها" variant="centered" class="mb-8" />

    <!-- Mobile: circular icon grid -->
    <div class="mt-[18px] grid grid-cols-4 gap-y-[13px] md:hidden">
      <a
        v-for="cat in categories"
        :key="cat.title"
        href="#"
        class="group flex flex-col items-center gap-[6px]"
      >
        <span
          class="flex size-[78px] items-center justify-center rounded-full border-[5px] transition-colors group-hover:border-R-50"
          :class="cat.accent ? 'border-R-10 bg-T-50' : 'border-T-200 bg-T-50'"
        >
          <span
            class="[&>svg]:block [&>svg]:size-[30px] group-hover:text-R-300"
            :class="cat.accent ? 'text-primary' : 'text-T-700'"
            aria-hidden="true"
            v-html="iconMap[cat.icon]"
          />
        </span>
        <span class="text-center text-[13px] font-medium leading-[18px] text-foreground">
          {{ cat.title }}
        </span>
      </a>
    </div>

    <!-- Desktop: card grid -->
    <div class="mt-[18px] hidden grid-cols-2 gap-x-[18px] gap-y-[13px] md:grid md:grid-cols-4 md:pr-[63px]">
      <article
        v-for="cat in categories"
        :key="cat.title"
        class="group grid h-[95px] grid-cols-[63px_1fr_32px]"
        dir="ltr"
      >
        <!-- Content card -->
        <a
          href="#"
          class="col-span-2 col-start-2 row-start-1 my-[5px] flex items-center justify-end rounded-[20px] border-2 border-T-400 bg-T-50 pl-[45px] pr-[12px] transition-colors group-hover:border-R-50"
          dir="rtl"
        >
          <div class="flex flex-col gap-[2px]">
            <h3 class="text-[16px] font-bold leading-[24px] text-foreground">
              {{ cat.title }}
            </h3>
            <p class="flex items-center gap-1 text-[12.5px] text-T-600">
              <span>محصول موجود است</span>
              <span class="text-[14px] font-bold text-foreground">{{ cat.count }}</span>
            </p>
          </div>
        </a>

        <!-- Circle -->
        <div
          class="col-start-3 row-start-1 flex size-[95px] items-center justify-center justify-self-start rounded-full border-[5px] transition-colors group-hover:border-R-50"
          :class="cat.accent ? 'border-R-10 bg-T-50' : 'border-T-200 bg-T-50'"
        >
          <span
            class="[&>svg]:block [&>svg]:size-[47px] group-hover:text-R-300"
            :class="cat.accent ? 'text-primary' : 'text-T-700'"
            aria-hidden="true"
            v-html="iconMap[cat.icon]"
          />
        </div>

        <!-- Arrow button -->
        <a
          href="#"
          class="col-start-2 row-start-1 ml-[5px] mt-[13px] flex size-[35px] items-center justify-center justify-self-start self-start rounded-full border border-T-400 bg-T-50 transition-colors group-hover:border-primary group-hover:text-primary"
        >
          <span
            class="[&>svg]:block [&>svg]:size-[18px]"
            aria-hidden="true"
            v-html="arrowUpLeftSmall"
          />
        </a>
      </article>
    </div>
  </section>
</template>
