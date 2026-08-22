<script setup lang="ts">
import {
  IconChevronLeft,
  IconDeviceGamepad2,
  IconDeviceLaptop,
  IconDeviceTv,
  IconDeviceWatch,
  IconDevices,
  IconHeadphones,
  IconSmartHome,
  IconSpeakerphone,
} from '@tabler/icons-vue'
import type { Component } from 'vue'
import type { Category } from '~/data/landing'
import { categories } from '~/data/landing'

const iconMap: Record<string, Component> = {
  headphones: IconHeadphones,
  watch: IconDeviceWatch,
  laptop: IconDeviceLaptop,
  smartphone: IconDevices,
  speaker: IconSpeakerphone,
  monitor: IconDeviceTv,
  gamepad: IconDeviceGamepad2,
  home: IconSmartHome,
}

const items = ref<Category[]>(categories)
</script>

<template>
  <section class="mx-auto max-w-[1400px] px-5">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <NuxtLink
        v-for="item in items"
        :key="item.id"
        href="#"
        class="group flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-card p-3 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
      >
        <div class="flex items-center gap-3">
          <!-- icon -->
          <div class="flex size-[68px] shrink-0 items-center justify-center rounded-full border-[5px] border-secondary bg-card">
            <component :is="iconMap[item.icon] || IconHeadphones" class="size-8 text-primary/30" />
          </div>
          <div class="flex flex-col">
            <span class="text-base font-semibold text-foreground">{{ item.title }}</span>
            <span class="text-xs text-muted-foreground">
              {{ item.count }} محصول موجود است
            </span>
          </div>
        </div>
        <span class="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-hover:bg-secondary">
          <IconChevronLeft class="size-4" />
        </span>
      </NuxtLink>
    </div>
  </section>
</template>
