<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  IconStarFilled,
  IconThumbUp,
  IconThumbDown,
  IconPencil,
  IconChevronRight,
  IconChevronLeft,
  IconPhotoOff,
  IconUser,
} from '@tabler/icons-vue'
import type { CommentSort, ProductComment, ProductDetail } from '~/data/product'
import { cn } from '~/lib/utils'

const props = withDefaults(
  defineProps<{
    id?: string
    product: ProductDetail
    class?: string
  }>(),
  { id: 'product-comments', class: '' },
)

const emit = defineEmits<{ 'open-comment': [] }>()

const filters: Array<{ id: CommentSort, label: string }> = [
  { id: 'useful', label: 'مفیدترین' },
  { id: 'newest', label: 'جدیدترین' },
  { id: 'oldest', label: 'قدیمی‌ترین' },
  { id: 'lowest', label: 'کمترین امتیاز' },
  { id: 'highest', label: 'بیشترین امتیاز' },
]

const activeFilter = ref<CommentSort>('useful')
const activePage = ref(1)
const firstPage = 1
const lastPage = 3
const pages = [firstPage, 2, lastPage]

const items = computed<ProductComment[]>(() => {
  const list = [...props.product.comments.items]
  switch (activeFilter.value) {
    case 'newest':
      return list.reverse()
    case 'oldest':
      return list
    case 'lowest':
      return list.sort((a, b) => a.rating - b.rating)
    case 'highest':
      return list.sort((a, b) => b.rating - a.rating)
    default:
      return list.sort((a, b) => b.likes - a.likes)
  }
})

const summary = computed(() => props.product.comments.summary)
const maxDistribution = computed(() => Math.max(...summary.value.distribution, 1))
const hasComments = computed(() => items.value.length > 0)
</script>

<template>
  <section :id="props.id" :class="cn('flex w-full scroll-mt-6 flex-col gap-4', props.class)">
    <div class="flex items-center gap-2">
      <span class="h-[18px] w-1 rounded-full bg-R-300" />
      <h2 class="text-[16px] font-bold text-T-900">نظرات کاربران</h2>
    </div>

    <!-- Filter row -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="me-2 flex h-[32px] items-center gap-1.5 rounded-full bg-R-10 px-3 text-[12.5px] font-bold text-R-300 transition-colors hover:bg-R-50"
          @click="emit('open-comment')"
        >
          <IconPencil class="size-4" />
          ثبت دیدگاه
        </button>
        <button
          v-for="filter in filters"
          :key="filter.id"
          type="button"
          class="flex h-[32px] items-center rounded-full px-3.5 text-[12.5px] transition-colors"
          :class="activeFilter === filter.id
            ? 'bg-R-10 font-medium text-R-300'
            : 'text-T-700 hover:bg-T-100'"
          @click="activeFilter = filter.id"
        >
          {{ filter.label }}
        </button>
      </div>
      <span class="text-[12.5px] text-T-700">{{ product.commentsCount }} دیدگاه</span>
    </div>

    <!-- Body -->
    <div class="grid grid-cols-[324px_1fr] items-start gap-9">
      <!-- Summary aside -->
      <aside class="flex w-full flex-col gap-4 rounded-2xl border border-T-300 bg-T-50 p-5">
        <h3 class="text-[14px] font-bold text-T-900">دیدگاه کاربران</h3>

        <div class="flex flex-col gap-1">
          <div class="flex items-center gap-2">
            <span class="text-[22px] font-extrabold leading-7 text-T-900">{{ summary.average }}</span>
            <span class="text-[13px] text-T-700">/ ۵</span>
          </div>
          <div class="flex items-center gap-0.5">
            <IconStarFilled
              v-for="i in 5"
              :key="i"
              class="size-3.5"
              :class="i <= Math.round(summary.average) ? 'text-[#FFAA39]' : 'text-T-400'"
            />
          </div>
          <span class="mt-1 text-[11.5px] text-T-700">از مجموع {{ summary.total }} امتیاز</span>
        </div>

        <div class="flex flex-col gap-2">
          <div
            v-for="(count, i) in summary.distribution"
            :key="i"
            class="flex items-center gap-2"
          >
            <span class="w-3 text-[11px] text-T-700">{{ 5 - i }}</span>
            <div class="h-2 flex-1 overflow-hidden rounded-full bg-T-200">
              <div
                class="h-full rounded-full bg-R-300"
                :style="{ width: `${(count / maxDistribution) * 100}%` }"
              />
            </div>
            <span class="w-6 text-end text-[11px] text-T-600">{{ count }}</span>
          </div>
        </div>

        <template v-if="hasComments">
          <div class="h-px w-full bg-T-300" />
          <p class="text-[12.5px] leading-[20px] text-T-700">
            شما هم درباره این کالا دیدگاه خود را ثبت کنید
          </p>
          <button
            type="button"
            class="flex h-[42px] w-full items-center justify-center gap-2 rounded-xl bg-R-300 text-[13px] font-bold text-white transition-colors hover:bg-R-400"
            @click="emit('open-comment')"
          >
            <IconPencil class="size-4" />
            افزودن دیدگاه
          </button>
        </template>
      </aside>

      <!-- Comments list / empty state -->
      <div v-if="hasComments" class="flex min-w-0 flex-col gap-4">
        <article
          v-for="comment in items"
          :key="comment.id"
          class="flex flex-col gap-3 rounded-2xl border border-T-300 bg-T-50 p-4"
        >
          <!-- Header -->
          <div class="flex items-center gap-3">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-T-200 text-T-600">
              <IconUser class="size-5" />
            </span>
            <div class="flex items-center gap-2">
              <span class="text-[13px] font-bold text-T-900">{{ comment.author }}</span>
              <span
                v-if="comment.isBuyer"
                class="flex h-[20px] items-center rounded-md bg-R-10 px-1.5 text-[10.5px] font-bold text-R-300"
              >خریدار</span>
            </div>
            <span class="ms-auto text-[11px] text-T-600">{{ comment.date }}</span>
          </div>

          <!-- Stars -->
          <div class="flex items-center gap-0.5">
            <IconStarFilled
              v-for="i in 5"
              :key="i"
              class="size-3.5"
              :class="i <= comment.rating ? 'text-[#FFAA39]' : 'text-T-400'"
            />
          </div>

          <!-- Body -->
          <p class="text-[12.5px] leading-[22px] text-T-800">{{ comment.text }}</p>

          <!-- Reply -->
          <div
            v-if="comment.reply"
            class="flex flex-col gap-2 rounded-xl bg-T-100 p-3"
          >
            <span class="flex h-[22px] w-fit items-center rounded-lg bg-R-10 px-2 text-[11px] font-bold text-R-300">
              پاسخ {{ comment.reply.author }}
            </span>
            <p class="text-[12px] leading-[20px] text-T-700">{{ comment.reply.text }}</p>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between">
            <span
              class="flex h-[26px] items-center rounded-lg px-2.5 text-[11.5px] font-bold"
              :class="comment.recommends
                ? 'bg-[#3BB77E]/10 text-[#2EA36D]'
                : 'bg-R-10 text-R-300'"
            >
              خرید این محصول را {{ comment.recommends ? 'پیشنهاد می‌کنم' : 'پیشنهاد نمی‌کنم' }}
            </span>

            <div class="flex items-center gap-4 text-T-600">
              <button type="button" class="flex items-center gap-1 text-[12px] transition-colors hover:text-R-300">
                {{ comment.likes }}
                <IconThumbUp class="size-4" />
              </button>
              <button type="button" class="flex items-center gap-1 text-[12px] transition-colors hover:text-R-300">
                {{ comment.dislikes }}
                <IconThumbDown class="size-4" />
              </button>
            </div>
          </div>
        </article>

        <!-- Pagination -->
        <nav class="flex items-center justify-center gap-2" aria-label="صفحه‌بندی دیدگاه‌ها">
          <button
            type="button"
            class="flex size-8 items-center justify-center rounded-lg border border-T-300 text-T-700 transition-colors hover:border-T-500 disabled:opacity-40"
            :disabled="activePage === firstPage"
            aria-label="صفحه قبل"
            @click="activePage = Math.max(firstPage, activePage - 1)"
          >
            <IconChevronRight class="size-4" />
          </button>
          <button
            v-for="page in pages"
            :key="page"
            type="button"
            class="flex size-8 items-center justify-center rounded-lg text-[12.5px] transition-colors"
            :class="activePage === page
              ? 'bg-R-300 font-bold text-white'
              : 'border border-T-300 text-T-700 hover:border-T-500'"
            :aria-current="activePage === page ? 'page' : undefined"
            @click="activePage = page"
          >
            {{ page }}
          </button>
          <button
            type="button"
            class="flex size-8 items-center justify-center rounded-lg border border-T-300 text-T-700 transition-colors hover:border-T-500 disabled:opacity-40"
            :disabled="activePage === lastPage"
            aria-label="صفحه بعد"
            @click="activePage = Math.min(lastPage, activePage + 1)"
          >
            <IconChevronLeft class="size-4" />
          </button>
        </nav>
      </div>

      <!-- Empty state -->
      <div
        v-else
        class="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-2xl border border-T-300 bg-T-50 p-8 text-center"
      >
        <span class="flex size-16 items-center justify-center rounded-2xl bg-T-200 text-T-600">
          <IconPhotoOff class="size-7" />
        </span>
        <p class="text-[14px] font-bold text-T-900">هنوز دیدگاهی ثبت نشده است</p>
        <p class="max-w-[320px] text-[12.5px] leading-[20px] text-T-700">
          شما می‌توانید در انتشار اولین دیدگاه این کالا و راهنمایی سایر خریداران سهیم شوید.
        </p>
        <button
          type="button"
          class="mt-2 flex h-[42px] items-center justify-center gap-2 rounded-xl bg-R-300 px-6 text-[13px] font-bold text-white transition-colors hover:bg-R-400"
          @click="emit('open-comment')"
        >
          <IconPencil class="size-4" />
          ثبت دیدگاه
        </button>
      </div>
    </div>
  </section>
</template>
