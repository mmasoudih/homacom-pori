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
  <article class="rounded-2xl border border-T-400 bg-T-50 p-6">
    <div class="flex items-start gap-4">
      <ProductImage
        :src="comment.image"
        :alt="comment.title"
        container-class="size-16 shrink-0 rounded-xl bg-transparent"
      />

      <h3 class="min-w-0 flex-1 text-right text-[14px] font-bold leading-[24px] text-T-900">
        {{ comment.title }}
      </h3>
    </div>

    <div class="mt-5 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <span class="text-[13.5px] text-T-700">امتیاز دهید:</span>
        <DashboardCommentsMoodPicker v-model="mood" />
      </div>

      <button
        type="button"
        class="inline-flex h-10 items-center gap-2 rounded-xl border border-primary bg-T-50 px-4 text-[13px] font-bold text-primary transition-colors hover:bg-R-50"
        @click="emit('add', { ...comment, mood })"
      >
        <IconMessagePlus class="size-5" />
        افزودن دیدگاه
      </button>
    </div>
  </article>
</template>
