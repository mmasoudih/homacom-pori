<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  IconStarFilled,
  IconThumbUp,
  IconThumbDown,
  IconPencil,
  IconChevronDown,
  IconChevronLeft,
  IconPhotoOff,
  IconUser,
  IconDotsVertical,
  IconArrowsSort,
  IconMessagePlus,
  IconArrowBackUp,
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

const emit = defineEmits<{
  'open-comment': []
  'open-comments-sheet': []
}>()

const filters: Array<{ id: CommentSort, label: string }> = [
  { id: 'newest', label: 'جدیدترین' },
  { id: 'oldest', label: 'قدیمی‌ترین' },
  { id: 'highest', label: 'بیشترین امتیاز' },
  { id: 'lowest', label: 'کمترین امتیاز' },
]

const activeFilter = ref<CommentSort>('newest')

const items = computed<ProductComment[]>(() => {
  const list = [...props.product.comments.items]
  switch (activeFilter.value) {
    case 'oldest':
      return list
    case 'lowest':
      return list.sort((a, b) => a.rating - b.rating)
    case 'highest':
      return list.sort((a, b) => b.rating - a.rating)
    default:
      return list.reverse()
  }
})

const summary = computed(() => props.product.comments.summary)
const maxDistribution = computed(() => Math.max(...summary.value.distribution, 1))
const hasComments = computed(() => items.value.length > 0)

/** Index 0 => 5-star … index 4 => 1-star. */
function starCount(star: number) {
  return summary.value.distribution[5 - star] ?? 0
}
</script>

<template>
  <section :id="props.id" :class="cn('flex w-full scroll-mt-24 flex-col gap-5 lg:scroll-mt-6', props.class)">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="h-[18px] w-1 rounded-full bg-R-300" />
        <h2 class="text-[16px] font-bold text-T-900">دیدگاه کاربران</h2>
      </div>
      <button
        type="button"
        class="flex items-center gap-1 text-[12px] text-T-700 lg:hidden"
        @click="emit('open-comments-sheet')"
      >
        مشاهده همه
        <IconChevronDown class="size-4" />
      </button>
    </div>

    <!-- Sort bar (desktop) -->
    <div class="hidden items-center justify-between border-b border-T-300 pb-3.5 lg:flex">
      <div class="flex items-center gap-6">
        <span class="flex items-center gap-1.5 text-[13.5px] font-bold text-T-900">
          <IconArrowsSort class="size-4.5" />
          مرتب سازی:
        </span>
        <button
          v-for="filter in filters"
          :key="filter.id"
          type="button"
          class="text-[13px] transition-colors"
          :class="activeFilter === filter.id
            ? 'font-bold text-R-300'
            : 'text-T-700 hover:text-T-900'"
          @click="activeFilter = filter.id"
        >
          {{ filter.label }}
        </button>
      </div>
      <span class="text-[13.5px] font-bold text-T-900">{{ product.commentsCount }} دیدگاه</span>
    </div>

    <!-- Mobile summary inline row -->
    <div
      v-if="hasComments"
      class="flex items-center justify-between rounded-2xl border border-T-300 px-4 py-3 lg:hidden"
    >
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-1.5">
          <span class="text-[20px] font-extrabold leading-6 text-T-900">{{ summary.average }}</span>
          <span class="text-[12px] text-T-700">/ ۵</span>
        </div>
        <div class="flex items-center gap-0.5">
          <IconStarFilled
            v-for="i in 5"
            :key="i"
            class="size-3"
            :class="i <= Math.round(summary.average) ? 'text-[#FFAA39]' : 'text-T-400'"
          />
        </div>
      </div>
      <span class="text-[11.5px] text-T-700">از مجموع {{ summary.total }} امتیاز</span>
    </div>

    <!-- Desktop: summary aside + list -->
    <div class="hidden grid-cols-[360px_1fr] items-start gap-9 lg:grid">
      <!-- Summary -->
      <aside class="sticky top-6 flex w-full flex-col gap-5 rounded-2xl border border-T-300 bg-T-50 p-5">
        <div class="flex flex-col gap-2">
          <div class="flex items-baseline gap-2">
            <span class="text-[26px] font-extrabold leading-8 text-T-900">{{ summary.average }}</span>
            <span class="text-[13px] text-T-700">از مجموع {{ summary.total }} امتیاز</span>
          </div>
          <div class="flex items-center gap-0.5">
            <IconStarFilled
              v-for="i in 5"
              :key="i"
              class="size-4"
              :class="i <= Math.round(summary.average) ? 'text-[#FFAA39]' : 'text-T-400'"
            />
          </div>
        </div>

        <div class="flex flex-col gap-2.5">
          <div v-for="star in 5" :key="star" class="flex items-center gap-2.5">
            <span class="w-3 text-[11.5px] text-T-700">{{ star }}</span>
            <div class="h-2 flex-1 overflow-hidden rounded-full bg-T-200">
              <div
                class="h-full rounded-full bg-R-300"
                :style="{ width: `${(starCount(star) / maxDistribution) * 100}%` }"
              />
            </div>
          </div>
        </div>

        <template v-if="hasComments">
          <div class="flex flex-col items-center gap-3 rounded-xl border border-T-300 p-4">
            <p class="text-center text-[12.5px] leading-[20px] text-T-700">
              شما هم درباره این کالا دیدگاه خود را ثبت کنید
            </p>
            <button
              type="button"
              class="flex h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-R-300 text-[13px] font-bold text-white transition-colors hover:bg-R-400"
              @click="emit('open-comment')"
            >
              <IconMessagePlus class="size-4.5" />
              افزودن دیدگاه
            </button>
          </div>
        </template>
      </aside>

      <!-- List -->
      <div v-if="hasComments" class="flex min-w-0 flex-col gap-4">
        <template v-for="comment in items" :key="comment.id">
          <article class="flex flex-col gap-4 rounded-xl border border-T-300 bg-T-50 p-5">
            <!-- Header -->
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="flex size-11 shrink-0 items-center justify-center rounded-full bg-T-200 text-T-600">
                  <IconUser class="size-6" />
                </span>
                <div class="flex flex-col gap-0.5">
                  <span class="text-[13.5px] font-bold text-T-900">{{ comment.author }}</span>
                  <span class="text-[11.5px] text-T-600">{{ comment.date }}</span>
                </div>
                <span
                  v-if="comment.isBuyer"
                  class="flex h-[26px] items-center rounded-full bg-[#EEF0FF] px-3 text-[11px] font-medium text-[#5A6AFF]"
                >خریدار</span>
              </div>

              <div class="flex items-center gap-3">
                <div class="flex items-center gap-0.5">
                  <IconStarFilled
                    v-for="i in 5"
                    :key="i"
                    class="size-4"
                    :class="i <= comment.rating ? 'text-[#FFAA39]' : 'text-T-400'"
                  />
                </div>
                <button type="button" class="text-T-600 transition-colors hover:text-T-900" aria-label="گزینه‌ها">
                  <IconDotsVertical class="size-5" />
                </button>
              </div>
            </div>

            <div class="h-px w-full bg-T-300" />

            <p class="text-[13px] leading-[30px] text-T-800">{{ comment.text }}</p>

            <button
              type="button"
              class="flex items-center gap-1 self-start text-[13px] font-medium text-R-300 transition-colors hover:text-R-400"
            >
              مشاهده بیشتر
              <IconChevronLeft class="size-4" />
            </button>

            <!-- Footer -->
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2.5">
                <button
                  type="button"
                  class="flex h-[40px] items-center gap-2 rounded-lg border border-T-300 px-3.5 text-[12.5px] text-T-700 transition-colors hover:border-T-500"
                >
                  {{ comment.likes }}
                  <IconThumbUp class="size-4.5" />
                </button>
                <button
                  type="button"
                  class="flex h-[40px] items-center gap-2 rounded-lg border border-T-300 px-3.5 text-[12.5px] text-T-700 transition-colors hover:border-T-500"
                >
                  {{ comment.dislikes }}
                  <IconThumbDown class="size-4.5" />
                </button>
              </div>

              <button
                type="button"
                class="flex items-center gap-1.5 text-[12.5px] text-T-700 transition-colors hover:text-R-300"
              >
                پاسخ ({{ comment.reply ? 1 : 0 }} پاسخ)
                <IconArrowBackUp class="size-4" />
              </button>
            </div>
          </article>

          <!-- Admin reply -->
          <article
            v-if="comment.reply"
            class="flex flex-col gap-4 rounded-xl border border-T-300 bg-T-100 p-5"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <span class="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-T-50">
                  <img src="/homacom-logo.png" :alt="comment.reply.author" class="size-7 object-contain">
                </span>
                <div class="flex flex-col gap-0.5">
                  <span class="text-[13.5px] font-bold text-T-900">{{ comment.reply.author }}</span>
                  <span class="text-[11.5px] text-T-600">{{ comment.date }}</span>
                </div>
                <span class="flex h-[26px] items-center rounded-full bg-R-10 px-3 text-[11px] font-medium text-R-300">
                  ادمین
                </span>
              </div>
              <button type="button" class="text-T-600 transition-colors hover:text-T-900" aria-label="گزینه‌ها">
                <IconDotsVertical class="size-5" />
              </button>
            </div>

            <p class="text-[13px] leading-[30px] text-T-800">{{ comment.reply.text }}</p>

            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2.5">
                <button
                  type="button"
                  class="flex h-[40px] items-center gap-2 rounded-lg border border-T-300 bg-T-50 px-3.5 text-[12.5px] text-T-700 transition-colors hover:border-T-500"
                >
                  ۰
                  <IconThumbUp class="size-4.5" />
                </button>
                <button
                  type="button"
                  class="flex h-[40px] items-center gap-2 rounded-lg border border-T-300 bg-T-50 px-3.5 text-[12.5px] text-T-700 transition-colors hover:border-T-500"
                >
                  ۰
                  <IconThumbDown class="size-4.5" />
                </button>
              </div>
            </div>
          </article>
        </template>

        <button
          type="button"
          class="flex items-center gap-1 self-center text-[13px] font-medium text-R-300 transition-colors hover:text-R-400"
        >
          <IconChevronDown class="size-4" />
          مشاهده بیشتر
        </button>
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

    <!-- Mobile comments list -->
    <div v-if="hasComments" class="flex flex-col lg:hidden">
      <article
        v-for="comment in items"
        :key="comment.id"
        class="flex flex-col gap-2.5 border-b border-T-300 py-4 last:border-b-0"
      >
        <div class="flex items-center gap-3">
          <span class="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-T-200 text-T-600">
            <IconUser class="size-5" />
          </span>
          <div class="flex min-w-0 flex-1 flex-col gap-1">
            <div class="flex items-center gap-2">
              <span class="truncate text-[12.5px] font-bold text-T-900">{{ comment.author }}</span>
              <span
                v-if="comment.isBuyer"
                class="flex h-[20px] shrink-0 items-center rounded-md bg-[#EEF0FF] px-1.5 text-[10px] font-bold text-[#5A6AFF]"
              >خریدار</span>
            </div>
            <span class="text-[10.5px] text-T-600">{{ comment.date }}</span>
          </div>
        </div>

        <div class="flex items-center gap-0.5">
          <IconStarFilled
            v-for="i in 5"
            :key="i"
            class="size-3.5"
            :class="i <= comment.rating ? 'text-[#FFAA39]' : 'text-T-400'"
          />
        </div>

        <p class="line-clamp-4 text-[12px] leading-[22px] text-T-800">{{ comment.text }}</p>

        <div class="flex items-center justify-between pt-1">
          <span class="flex items-center gap-1 text-[11px] text-T-700">
            پاسخ ({{ comment.reply ? 1 : 0 }})
          </span>
          <div class="flex items-center gap-2">
            <span class="flex h-[30px] items-center gap-1.5 rounded-lg border border-T-300 px-2.5 text-[11.5px] text-T-700">
              {{ comment.likes }}
              <IconThumbUp class="size-4" />
            </span>
            <span class="flex h-[30px] items-center gap-1.5 rounded-lg border border-T-300 px-2.5 text-[11.5px] text-T-700">
              {{ comment.dislikes }}
              <IconThumbDown class="size-4" />
            </span>
          </div>
        </div>
      </article>
    </div>

    <!-- Mobile empty state -->
    <div
      v-else
      class="flex flex-col items-center justify-center gap-3 rounded-2xl border border-T-300 bg-T-50 p-8 text-center lg:hidden"
    >
      <span class="flex size-16 items-center justify-center rounded-2xl bg-T-200 text-T-600">
        <IconPhotoOff class="size-7" />
      </span>
      <p class="text-[14px] font-bold text-T-900">هنوز دیدگاهی ثبت نشده است</p>
      <p class="max-w-[320px] text-[12.5px] leading-[20px] text-T-700">
        شما می‌توانید در انتشار اولین دیدگاه این کالا و راهنمایی سایر خریداران سهیم شوید.
      </p>
    </div>

    <!-- Mobile: submit button -->
    <button
      type="button"
      class="flex h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-T-300 text-[12.5px] text-T-700 lg:hidden"
      @click="emit('open-comment')"
    >
      <IconPencil class="size-4" />
      ثبت دیدگاه
    </button>
  </section>
</template>
