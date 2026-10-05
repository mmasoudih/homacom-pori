<script setup lang="ts">
import { IconPencil, IconTrash } from '@tabler/icons-vue'
import type { MyComment } from '~/data/comments'
import { toPersianDigits } from '~/utils/format'

const props = defineProps<{
  comment: MyComment
}>()

const emit = defineEmits<{
  remove: [id: string]
  edit: [comment: MyComment]
}>()

const likes = ref(props.comment.likes)
const dislikes = ref(props.comment.dislikes)
const vote = ref<'like' | 'dislike' | null>(null)

function toggleLike() {
  if (vote.value === 'like') {
    vote.value = null
    likes.value -= 1
    return
  }
  if (vote.value === 'dislike') dislikes.value -= 1
  vote.value = 'like'
  likes.value += 1
}

function toggleDislike() {
  if (vote.value === 'dislike') {
    vote.value = null
    dislikes.value -= 1
    return
  }
  if (vote.value === 'like') likes.value -= 1
  vote.value = 'dislike'
  dislikes.value += 1
}
</script>

<template>
  <article class="border-b-2 border-T-300 px-4 py-5">
    <div class="flex items-start gap-3">
      <ProductImage
        :src="comment.image"
        :alt="comment.title"
        container-class="size-16 shrink-0 rounded-xl bg-transparent"
      />

      <div class="min-w-0 flex-1">
        <UiTypography
          as="h3"
          size="md"
          weight="medium"
          color="default"
          class="line-clamp-2 text-right leading-[22px]"
        >
          {{ comment.title }}
        </UiTypography>
        <DashboardCommentsStars :value="comment.rating" class="mt-2" />
      </div>

      <UiDropdownMenu>
        <UiDropdownMenuTrigger as-child>
          <button
            type="button"
            class="flex size-[38px] shrink-0 items-center justify-center rounded-[10px] border border-T-400 text-T-800"
            aria-label="گزینه‌های دیدگاه"
          >
            <svg
              class="size-[18px] text-T-900"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M7.6875 1.875C7.6875 1.15013 8.27513 0.5625 9 0.5625C9.72487 0.5625 10.3126 1.15013 10.3126 1.875C10.3126 2.59987 9.72495 3.1875 9.00007 3.1875C8.2752 3.1875 7.6875 2.59987 7.6875 1.875Z" fill="currentColor" />
              <path d="M7.6875 9C7.6875 8.27513 8.27513 7.6875 9 7.6875C9.72487 7.6875 10.3126 8.27513 10.3126 9C10.3126 9.72487 9.72495 10.3125 9.00007 10.3125C8.2752 10.3125 7.6875 9.72487 7.6875 9Z" fill="currentColor" />
              <path d="M9 14.8125C8.27513 14.8125 7.6875 15.4001 7.6875 16.125C7.6875 16.8499 8.27513 17.4375 9 17.4375C9.72487 17.4375 10.3126 16.8499 10.3126 16.125C10.3126 15.4001 9.72487 14.8125 9 14.8125Z" fill="currentColor" />
            </svg>
          </button>
        </UiDropdownMenuTrigger>
        <UiDropdownMenuContent align="start" class="min-w-[160px]">
          <UiDropdownMenuItem class="gap-2" @select="emit('edit', comment)">
            <IconPencil class="size-4" />
            ویرایش دیدگاه
          </UiDropdownMenuItem>
          <UiDropdownMenuSeparator />
          <UiDropdownMenuItem class="gap-2 text-primary focus:text-primary" @select="emit('remove', comment.id)">
            <IconTrash class="size-4" />
            حذف دیدگاه
          </UiDropdownMenuItem>
        </UiDropdownMenuContent>
      </UiDropdownMenu>
    </div>

    <UiTypography as="p" size="md" weight="regular" class="mt-3 text-right leading-[26px] text-T-800">
      {{ comment.text }}
    </UiTypography>

    <div class="mt-4 flex items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="group inline-flex h-9 items-center gap-1.5 rounded-[8px] border px-3 text-[12.5px] font-medium transition-colors"
          :class="vote === 'dislike' ? 'border-primary text-primary' : 'border-T-400 text-T-800'"
          aria-label="نپسندیدن دیدگاه"
          @click="toggleDislike"
        >
          {{ toPersianDigits(dislikes) }}
          <svg
            class="size-5 shrink-0 transition-colors group-hover:text-current"
            :class="vote === 'dislike' ? 'text-current' : 'text-T-600'"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M12.4999 11.6654L11.8834 11.7681C11.8533 11.5869 11.9043 11.4015 12.023 11.2614C12.1418 11.1212 12.3162 11.0404 12.4999 11.0404V11.6654ZM3.33325 11.6654V12.2904C2.98808 12.2904 2.70825 12.0105 2.70825 11.6654H3.33325ZM4.99992 2.70703H14.4669V3.95703H4.99992V2.70703ZM15.4669 12.2904H12.4999V11.0404H15.4669V12.2904ZM13.1164 11.5626L13.788 15.5923L12.555 15.7978L11.8834 11.7681L13.1164 11.5626ZM12.3495 17.2904H12.1713V16.0404H12.3495V17.2904ZM9.57109 15.8988L7.47467 12.7542L8.51475 12.0609L10.6111 15.2054L9.57109 15.8988ZM6.60794 12.2904H3.33325V11.0404H6.60794V12.2904ZM2.70825 11.6654V4.9987H3.95825V11.6654H2.70825ZM16.7141 4.54926L17.7141 9.54928L16.4883 9.79445L15.4883 4.79441L16.7141 4.54926ZM7.47467 12.7542C7.28147 12.4644 6.95623 12.2904 6.60794 12.2904V11.0404C7.37417 11.0404 8.0897 11.4233 8.51475 12.0609L7.47467 12.7542ZM13.788 15.5923C13.9362 16.4812 13.2507 17.2904 12.3495 17.2904V16.0404C12.4783 16.0404 12.5762 15.9248 12.555 15.7978L13.788 15.5923ZM15.4669 11.0404C16.1243 11.0404 16.6173 10.4389 16.4883 9.79445L17.7141 9.54928C17.9977 10.9674 16.9131 12.2904 15.4669 12.2904V11.0404ZM14.4669 2.70703C15.5593 2.70703 16.4998 3.47808 16.7141 4.54926L15.4883 4.79441C15.391 4.30751 14.9634 3.95703 14.4669 3.95703V2.70703ZM12.1713 17.2904C11.1263 17.2904 10.1507 16.7682 9.57109 15.8988L10.6111 15.2054C10.9588 15.727 11.5443 16.0404 12.1713 16.0404V17.2904ZM4.99992 3.95703C4.42462 3.95703 3.95825 4.4234 3.95825 4.9987H2.70825C2.70825 3.73305 3.73427 2.70703 4.99992 2.70703V3.95703Z" fill="currentColor" />
            <path d="M6.66675 11.6654V3.33203" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </button>
        <button
          type="button"
          class="group inline-flex h-9 items-center gap-1.5 rounded-[8px] border px-3 text-[12.5px] font-medium transition-colors"
          :class="vote === 'like' ? 'border-primary text-primary' : 'border-T-400 text-T-800'"
          aria-label="پسندیدن دیدگاه"
          @click="toggleLike"
        >
          {{ toPersianDigits(likes) }}
          <svg
            class="size-5 shrink-0 transition-colors group-hover:text-current"
            :class="vote === 'like' ? 'text-current' : 'text-T-600'"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <g transform="translate(0 20) scale(1 -1)">
              <path d="M12.4999 11.6654L11.8834 11.7681C11.8533 11.5869 11.9043 11.4015 12.023 11.2614C12.1418 11.1212 12.3162 11.0404 12.4999 11.0404V11.6654ZM3.33325 11.6654V12.2904C2.98808 12.2904 2.70825 12.0105 2.70825 11.6654H3.33325ZM4.99992 2.70703H14.4669V3.95703H4.99992V2.70703ZM15.4669 12.2904H12.4999V11.0404H15.4669V12.2904ZM13.1164 11.5626L13.788 15.5923L12.555 15.7978L11.8834 11.7681L13.1164 11.5626ZM12.3495 17.2904H12.1713V16.0404H12.3495V17.2904ZM9.57109 15.8988L7.47467 12.7542L8.51475 12.0609L10.6111 15.2054L9.57109 15.8988ZM6.60794 12.2904H3.33325V11.0404H6.60794V12.2904ZM2.70825 11.6654V4.9987H3.95825V11.6654H2.70825ZM16.7141 4.54926L17.7141 9.54928L16.4883 9.79445L15.4883 4.79441L16.7141 4.54926ZM7.47467 12.7542C7.28147 12.4644 6.95623 12.2904 6.60794 12.2904V11.0404C7.37417 11.0404 8.0897 11.4233 8.51475 12.0609L7.47467 12.7542ZM13.788 15.5923C13.9362 16.4812 13.2507 17.2904 12.3495 17.2904V16.0404C12.4783 16.0404 12.5762 15.9248 12.555 15.7978L13.788 15.5923ZM15.4669 11.0404C16.1243 11.0404 16.6173 10.4389 16.4883 9.79445L17.7141 9.54928C17.9977 10.9674 16.9131 12.2904 15.4669 12.2904V11.0404ZM14.4669 2.70703C15.5593 2.70703 16.4998 3.47808 16.7141 4.54926L15.4883 4.79441C15.391 4.30751 14.9634 3.95703 14.4669 3.95703V2.70703ZM12.1713 17.2904C11.1263 17.2904 10.1507 16.7682 9.57109 15.8988L10.6111 15.2054C10.9588 15.727 11.5443 16.0404 12.1713 16.0404V17.2904ZM4.99992 3.95703C4.42462 3.95703 3.95825 4.4234 3.95825 4.9987H2.70825C2.70825 3.73305 3.73427 2.70703 4.99992 2.70703V3.95703Z" fill="currentColor" />
              <path d="M6.66675 11.6654V3.33203" stroke="currentColor" stroke-width="1.5" />
            </g>
          </svg>
        </button>
      </div>

      <DashboardCommentsStatusChip :status="comment.status" />
    </div>
  </article>
</template>
