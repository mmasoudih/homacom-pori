<script setup lang="ts">
import type { PendingComment } from '~/data/comments'

const props = defineProps<{
  comment: PendingComment
}>()

const mood = ref(props.comment.mood ?? null)
</script>

<template>
  <article class="border-b-2 border-T-300 px-4 py-5">
    <div class="flex items-start gap-3">
      <ProductImage
        :src="comment.image"
        :alt="comment.title"
        container-class="size-[74px] shrink-0 rounded-xl bg-transparent"
      />

      <div class="flex min-w-0 flex-1 flex-col gap-2">
        <UiTypography
          as="h3"
          size="md"
          weight="medium"
          color="default"
          class="line-clamp-2 text-right leading-[22px]"
        >
          {{ comment.title }}
        </UiTypography>

        <div class="flex items-center gap-2">
          <UiTypography as="span" size="xs" weight="regular" color="muted">امتیاز دهید:</UiTypography>
          <DashboardCommentsMoodPicker v-model="mood" />
        </div>
      </div>
    </div>
  </article>
</template>
