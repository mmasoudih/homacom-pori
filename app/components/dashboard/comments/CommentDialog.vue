<script setup lang="ts">
import type { MyComment, PendingComment } from '~/data/comments'

const props = defineProps<{
  comment: MyComment | PendingComment | null
}>()

const emit = defineEmits<{
  submitted: []
}>()

const open = defineModel<boolean>('open', { default: false })

const product = computed(() => ({
  title: props.comment?.title ?? '',
  images: props.comment ? [{ src: props.comment.image }] : [],
}))

const editable = computed<MyComment | null>(() =>
  props.comment && 'text' in props.comment ? props.comment : null,
)
</script>

<template>
  <ProductDetailCommentDialog
    v-model:open="open"
    :product="product"
    :comment-id="editable?.id ?? null"
    :initial-rating="editable?.rating ?? 0"
    :initial-text="editable?.text ?? ''"
    @submitted="emit('submitted')"
  />
</template>
