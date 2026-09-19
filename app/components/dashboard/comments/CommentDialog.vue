<script setup lang="ts">
const props = defineProps<{
  comment: { title: string, image: string } | null
}>()

const open = defineModel<boolean>('open', { default: false })

const product = computed(() => ({
  title: props.comment?.title ?? '',
  images: props.comment ? [{ src: props.comment.image }] : [],
}))
</script>

<template>
  <ProductDetailCommentDialog v-model:open="open" :product="product" />
</template>
