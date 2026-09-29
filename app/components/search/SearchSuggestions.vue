<script setup lang="ts">
import { IconHistory, IconTrash, IconTrendingUp, IconX } from '@tabler/icons-vue'
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
        <h3 class="flex items-center gap-2 text-[14px] font-bold text-T-900">
          <IconHistory class="size-5 text-T-700" />
          جستجوهای اخیر شما
        </h3>

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
          <span class="flex items-center gap-1 rounded-full bg-T-200 py-1 pe-1.5 ps-4 text-[13px] font-medium text-T-800">
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
          </span>
        </li>
      </ul>
    </section>

    <!-- «محبوب‌ترین جستجوها» -->
    <section class="flex flex-col gap-4">
      <h3 class="flex items-center gap-2 text-[14px] font-bold text-T-900">
        <IconTrendingUp class="size-5 text-T-700" />
        محبوب‌ترین جستجوها
      </h3>

      <ul class="flex flex-wrap gap-3">
        <li v-for="term in popularSearches" :key="term">
          <button
            type="button"
            class="rounded-full bg-T-200 px-4 py-2.5 text-[13px] font-medium text-T-800 transition-colors hover:bg-T-300"
            @click="emit('select', term)"
          >
            {{ term }}
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>
