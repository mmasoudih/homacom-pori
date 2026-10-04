<script setup lang="ts">
import { cn } from '~/lib/utils'
import mobileIcon from '../../../public/icons/mobile.svg?raw'
import laptopIcon from '../../../public/icons/laptop.svg?raw'
import headphonesIcon from '../../../public/icons/headphones-waveform.svg?raw'

type ColumnItem = {
  id?: string
  image: string
  title: string
  price: string
  oldPrice?: string
  discount?: string
}

const props = withDefaults(
  defineProps<{
    category: string
    icon: string
    items: ColumnItem[]
    class?: string
  }>(),
  { class: '' },
)

const iconMap: Record<string, string> = {
  mobile: mobileIcon,
  laptop: laptopIcon,
  headphones: headphonesIcon,
}
</script>

<template>
  <div
    :class="cn('flex flex-col overflow-hidden rounded-3xl border border-T-400 bg-T-50', props.class)"
  >
    <!-- Column header -->
    <div class="flex h-[60px] items-center justify-center gap-2 bg-T-200 px-4 lg:h-[70px]">
      <span
        class="[&>svg]:block [&>svg]:size-[32px] text-T-700"
        aria-hidden="true"
        v-html="iconMap[icon]"
      />
      <UiTypography
        as="h3"
        size="xl"
        weight="semibold"
        class="text-T-900 lg:text-foreground"
      >{{ category }}</UiTypography>
    </div>

    <!-- Mini cards -->
    <Product
      v-for="(item, i) in items"
      :key="i"
      :product="item"
      variant="horizontal"
      discount-placement="inline"
      badge-size="lg"
      :href="item.id ? `/product/${item.id}` : ''"
      class="h-[122px] border-b-0 border-T-400 px-4 last:border-b-0 rounded-none transition-colors hover:bg-secondary/30 lg:h-[150px]"
      image-class="w-[90px] lg:w-[123px] lg:h-[123px] bg-transparent"
    />
  </div>
</template>
