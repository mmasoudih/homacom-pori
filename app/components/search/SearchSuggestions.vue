<script setup lang="ts">
import { IconTrash, IconX } from '@tabler/icons-vue'
import { popularSearches } from '~/data/search'

defineProps<{
  recent: string[]
}>()

const emit = defineEmits<{
  select: [term: string]
  remove: [term: string]
  clear: []
}>()
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- «جستجوهای اخیر شما» -->
    <section v-if="recent.length" class="flex flex-col gap-4">
      <div class="flex items-center justify-between gap-4">
        <UiTypography as="h3" size="lg" weight="medium" color="default" class="flex items-center gap-2">
          <img src="/icons/clock-history.svg" alt="" class="size-5">
          جستجوهای اخیر شما
        </UiTypography>

        <button
          type="button"
          class="flex size-6 shrink-0 items-center justify-center text-T-600 transition-colors hover:text-primary"
          aria-label="پاک کردن همه جستجوهای اخیر"
          @click="emit('clear')"
        >
          <IconTrash class="size-5" />
        </button>
      </div>

      <ul class="flex flex-wrap gap-3">
        <li v-for="term in recent" :key="term">
          <UiTypography as="span" size="md" weight="regular" class="flex h-[34px] items-center gap-1 rounded-full border border-T-500 bg-T-200 pe-1.5 ps-4">
            <button
              type="button"
              class="py-1.5 transition-colors hover:text-primary"
              @click="emit('select', term)"
            >
              {{ term }}
            </button>
            <button
              type="button"
              class="flex size-5 items-center justify-center rounded-full text-T-700 transition-colors hover:text-primary"
              :aria-label="`حذف ${term} از جستجوهای اخیر`"
              @click="emit('remove', term)"
            >
              <IconX class="size-3.5" />
            </button>
          </UiTypography>
        </li>
      </ul>
    </section>

    <!-- «محبوب‌ترین جستجوها» -->
    <section class="flex flex-col gap-4">
      <UiTypography as="h3" size="lg" weight="medium" color="default" class="flex items-center gap-2">
        <img src="/icons/trending-up.svg" alt="" class="size-5">
        محبوب‌ترین جستجوها
      </UiTypography>

      <ul class="flex flex-wrap gap-3">
        <li v-for="term in popularSearches" :key="term">
          <button
            type="button"
            class="inline-flex h-[38px] items-center rounded-full border border-T-500 bg-T-200 px-4 text-T-800 transition-colors hover:bg-T-300"
            @click="emit('select', term)"
          >
            <UiTypography as="span" size="md" weight="regular" color="inherit">
              {{ term }}
            </UiTypography>
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>
