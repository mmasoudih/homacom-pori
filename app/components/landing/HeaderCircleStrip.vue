<script setup lang="ts">
import { IconChevronLeft } from "@tabler/icons-vue";
import { headerCircles } from "~/data/landing";
import type { StoryApiItem, StoryItem } from "~/types/story";
import { isVideoStory } from "~/types/story";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const config = useRuntimeConfig();

// Stories come from the shop API. If the endpoint is unavailable the design's
// placeholder circles keep the strip usable instead of leaving it empty.
const { data: storiesResponse } = await useFetch<{ data?: StoryApiItem[] }>(
  () => `${config.public.apiBase}/shop/stories`,
  { key: "shop-stories", default: () => ({ data: [] }) },
);

const displayItems = computed<StoryItem[]>(() => {
  const apiStories = (storiesResponse.value?.data ?? []).filter(
    story => story.image || story.thumbnail,
  );

  if (apiStories.length) {
    return apiStories.map(story => ({
      id: story.id,
      title: story.text || "استوری هماکام",
      subtitle: "",
      image: story.image || story.thumbnail || "",
      thumbnail: story.thumbnail || story.image || "",
      // Only internal links are safe to expose as a CTA.
      href: story.link?.startsWith("/") ? story.link : undefined,
      badge: "مشاهده",
      type: isVideoStory(story.image) ? "video" : "image",
    }));
  }

  return headerCircles.map((item, i) => ({
    id: i,
    title: item.title,
    subtitle: item.subtitle,
    image: item.image,
    thumbnail: item.image,
    href: item.href && item.href !== "#" ? item.href : undefined,
    badge: item.badge,
    accent: item.accent,
  }));
});

// Stories open in the full-screen viewer instead of navigating to `#`.
const storyOpen = ref(false);
const storyIndex = ref(0);

function openStory(index: number) {
  storyIndex.value = index;
  storyOpen.value = true;
}
</script>

<template>
  <div class="relative w-full">
    <Carousel
      v-slot="{ canScrollNext, canScrollPrev, scrollNext, scrollPrev }"
      class="relative w-full overflow-x-clip pb-4 [overflow-clip-margin:24px]"
      :opts="{
        direction: 'rtl',
        align: 'start',
        containScroll: 'trimSnaps',
        dragFree: true,
      }"
    >
      <CarouselContent class="ms-0">
        <CarouselItem
          v-for="(item, i) in displayItems"
          :key="item.id ?? i"
          class="basis-auto ps-0 pe-[11px] lg:pe-7"
        >
          <button
            type="button"
            class="group flex w-[76px] flex-col items-center gap-2 lg:w-[96px]"
            :aria-label="$t('story.open', { title: item.title })"
            @click="openStory(i)"
          >
            <span
              class="border-R-300 relative flex size-[76px] items-center justify-center overflow-hidden rounded-full border-[2px] p-1 transition-colors lg:size-[96px]"
              :class="
                item.accent
                  ? 'group-hover:border-primary'
                  : 'group-hover:border-R-100'
              "
            >
              <img
                :src="item.thumbnail || item.image"
                :alt="`${item.title} ${item.subtitle}`"
                class="size-full object-cover"
                loading="lazy"
              >
            </span>

            <UiTypography
              as="span"
              size="md"
              weight="regular"
              class="text-center leading-[17px] text-foreground"
            >
              {{ item.title }}
              <span class="block">{{ item.subtitle }}</span>
            </UiTypography>
          </button>
        </CarouselItem>
      </CarouselContent>

      <!-- Arrows (desktop / tablet) -->
      <button
        v-if="canScrollNext"
        type="button"
        class="absolute left-0 top-[39px] z-20 hidden size-[34px] -translate-y-1/2 items-center justify-center rounded-full border border-T-400 bg-T-50 text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40 lg:flex lg:top-[48px] lg:-left-4"
        :aria-label="$t('landing.heroPrev')"
        :disabled="!canScrollNext"
        @click="scrollNext"
      >
        <IconChevronLeft class="size-[18px]" />
      </button>
      <button
        v-if="canScrollPrev"
        type="button"
        class="absolute -right-4 top-[39px] z-20 hidden size-[34px] -translate-y-1/2 items-center justify-center rounded-full border border-T-400 bg-T-50 text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40 lg:flex lg:top-[48px]"
        :aria-label="$t('landing.heroNext')"
        :disabled="!canScrollPrev"
        @click="scrollPrev"
      >
        <IconChevronLeft class="size-[18px] rotate-180" />
      </button>
    </Carousel>

    <LandingStoryViewer
      v-model:open="storyOpen"
      :items="displayItems"
      :start-index="storyIndex"
    />
  </div>
</template>
