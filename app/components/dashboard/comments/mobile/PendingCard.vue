<script setup lang="ts">
import { IconMessagePlus } from '@tabler/icons-vue'
import type { PendingComment } from '~/data/comments'

const props = defineProps<{
  comment: PendingComment
}>()

const emit = defineEmits<{
  add: [comment: PendingComment]
}>()

const mood = ref(props.comment.mood ?? null)
</script>

<template>
  <article class="border-b-2 border-T-300 px-4 py-5">
    <div class="flex items-start gap-3">
      <ProductImage
        :src="comment.image"
        :alt="comment.title"
        container-class="size-16 shrink-0 rounded-xl bg-transparent"
      />

      <h3 class="min-w-0 flex-1 text-right text-[13px] font-bold leading-[22px] text-T-900">
        {{ comment.title }}
      </h3>
    </div>

    <div class="mt-4 flex items-center justify-between gap-2">
      <div class="flex items-center gap-2">
        <span class="text-[12.5px] text-T-700">امتیاز دهید:</span>
        <DashboardCommentsMoodPicker v-model="mood" size="sm" />
      </div>

      <button
        type="button"
        class="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-primary bg-T-50 px-3 text-[12px] font-bold text-primary transition-colors hover:bg-R-50"
        @click="emit('add', { ...comment, mood })"
      >
        <IconMessagePlus class="size-4" />
        افزودن دیدگاه
      </button>
    </div>
  </article>
</template>
