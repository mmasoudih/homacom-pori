<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import {
  IconStarFilled,
  IconThumbUp,
  IconThumbDown,
  IconPencil,
  IconChevronDown,
  IconPhotoOff,
  IconUser,
} from '@tabler/icons-vue'
import type { CommentSort, ProductComment, ProductDetail } from '~/data/product'
import { apiErrorMessage } from '~/composables/useApi'
import { useCommentReaction } from '~/composables/useUserComments'
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

interface CommentVote {
  likes: number
  dislikes: number
  vote: 'up' | 'down' | null
}

const { react } = useCommentReaction()
const votes = reactive<Record<string, CommentVote>>({})

function currentVote(comment: ProductComment): CommentVote {
  return votes[comment.id] ?? {
    likes: comment.likes,
    dislikes: comment.dislikes,
    vote: null,
  }
}

function likesOf(comment: ProductComment) {
  return currentVote(comment).likes
}

function dislikesOf(comment: ProductComment) {
  return currentVote(comment).dislikes
}

async function vote(comment: ProductComment, type: 'up' | 'down') {
  try {
    const result = await react(comment.id, type)
    if (!result) return
    votes[comment.id] = {
      likes: result.reaction_up,
      dislikes: result.reaction_down,
      vote: result.reaction,
    }
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'ثبت بازخورد انجام نشد.'))
  }
}

/** Index 0 => 5-star … index 4 => 1-star. */
function starCount(star: number) {
  return summary.value.distribution[5 - star] ?? 0
}

/* ------------------------------------------------------------------------- *
 * Design frames use exported star glyphs (14px, gap 3).
 * Rating stars fill from the start (right in RTL) — the first child of the
 * row is the right-most star.
 * ------------------------------------------------------------------------- */
const STAR_ORANGE = '/icons/product-detail/star-orange-14.svg'
const STAR_GRAY = '/icons/product-detail/star-gray-14.svg'
const STAR_HALF = '/icons/product-detail/star-half-14.svg'

function commentStar(star: number, rating: number) {
  return star <= rating ? STAR_ORANGE : STAR_GRAY
}

function summaryStar(star: number) {
  const full = Math.floor(summary.value.average)
  const fraction = summary.value.average - full
  if (star <= full) return STAR_ORANGE
  if (star === full + 1 && fraction >= 0.25) return STAR_HALF
  return STAR_GRAY
}
</script>

<template>
  <section
    :id="props.id"
    :class="cn(
      'flex w-full scroll-mt-24 flex-col gap-5 lg:grid lg:scroll-mt-6 lg:grid-cols-[310px_minmax(0,1fr)] lg:items-start lg:gap-x-[44px] lg:gap-y-0',
      props.class,
    )"
  >
    <!-- ============ Header (design «Frame 3176»: right column, row 1) ============ -->
    <div class="flex items-center justify-between lg:col-start-1 lg:row-start-1 lg:h-[22px]">
      <div class="flex items-center gap-2 lg:gap-1">
        <span class="h-[18px] w-1 rounded-full bg-R-300 lg:hidden" />

        <img
          src="/icons/product-detail/spec-accent-20.svg"
          alt=""
          class="hidden h-5 w-[13px] shrink-0 lg:block"
        >

        <h2 class="text-[16px] font-bold text-T-900 lg:text-[18px] lg:leading-[22px]">دیدگاه کاربران</h2>
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

    <!-- ===================== Mobile summary inline row ===================== -->
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

    <!-- ============ Desktop summary (design «Frame 3185», row 2 right) ============ -->
    <div class="hidden lg:col-start-1 lg:row-start-2 lg:flex lg:flex-col lg:pt-6">
      <div class="flex flex-col items-start gap-5">
        <div class="flex flex-col items-start">
          <div class="flex h-[29px] items-center gap-2.5">
            <span class="text-[24px] font-bold leading-[29px] text-T-900">{{ summary.average }}</span>
            <span class="text-[12.5px] font-medium leading-[15px] text-T-600">
              از مجموع {{ summary.total }} امتیاز
            </span>
          </div>
          <div class="flex items-center gap-[3px]">
            <img
              v-for="i in 5"
              :key="i"
              :src="summaryStar(i)"
              alt=""
              class="size-3.5"
            >
          </div>
        </div>

        <!-- Distribution: 1 star on top … 5 stars at the bottom -->
        <div class="flex w-[191px] flex-col gap-1">
          <div v-for="star in 5" :key="star" class="flex h-[15px] items-center gap-[7px]">
            <span class="text-[12.5px] font-medium leading-[15px] text-T-900">{{ star }}</span>
            <div class="h-[9px] flex-1 overflow-hidden rounded-full bg-T-300">
              <div
                class="h-full rounded-full bg-R-200"
                :style="{ width: `${(starCount(star) / maxDistribution) * 100}%` }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Submit card (design «add comment») -->
      <div
        v-if="hasComments"
        class="mt-[29px] flex w-full flex-col items-center gap-2 rounded-xl border border-[#EFEFEF] bg-T-50 p-5"
      >
        <p class="text-center text-[12.5px] font-medium leading-[15px] text-T-700">
          شما هم درباره این کالا دیدگاه خود را ثبت کنید
        </p>
        <button
          type="button"
          class="flex h-[42px] w-[270px] items-center justify-center gap-1.5 rounded-xl bg-R-300 text-[14px] font-bold text-white transition-colors hover:bg-R-400"
          @click="emit('open-comment')"
        >
          <img src="/icons/product-detail/message-dots-plus-19.svg" alt="" class="size-[19px]">
          افزودن دیدگاه
        </button>
      </div>
    </div>

    <!-- ============ Sort bar (design «Frame 241», row 1 left) ============ -->
    <div
      class="hidden items-center justify-between border-b border-T-300 pb-3.5 lg:col-start-2 lg:row-start-1 lg:flex"
    >
      <span class="flex items-center gap-2.5 text-[14px] font-medium text-T-900">
        <img src="/icons/product-detail/sort-24.svg" alt="" class="size-6">
        مرتب سازی:
      </span>

      <div class="flex items-center gap-6">
        <button
          v-for="filter in filters"
          :key="filter.id"
          type="button"
          class="text-[12.5px] transition-colors"
          :class="activeFilter === filter.id
            ? 'text-R-300'
            : 'text-T-700 hover:text-T-900'"
          @click="activeFilter = filter.id"
        >
          {{ filter.label }}
        </button>
      </div>

      <span class="text-[12.5px] text-T-700">{{ product.commentsCount }} دیدگاه</span>
    </div>

    <!-- ============ Desktop list (design «Frame 3190», row 2 left) ============ -->
    <div class="hidden lg:col-start-2 lg:row-start-2 lg:flex lg:flex-col lg:pt-4">
      <div v-if="hasComments" class="flex flex-col gap-2.5">
        <template v-for="comment in items" :key="comment.id">
          <article class="flex flex-col gap-3 rounded-[20px] border border-T-400 bg-T-50 p-4">
            <!-- Header -->
            <div class="flex items-center gap-4">
              <div class="flex shrink-0 items-center gap-2">
                <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-T-400">
                  <img src="/icons/product-detail/user-18.svg" alt="" class="size-[18px]">
                </span>
                <div class="flex w-[103px] flex-col gap-0.5 text-right">
                  <span class="text-[14px] font-medium leading-[17px] text-T-900">{{ comment.author }}</span>
                  <span class="text-[12.5px] font-medium leading-[15px] text-T-600">{{ comment.date }}</span>
                </div>
              </div>

              <span
                v-if="comment.isBuyer"
                class="flex h-[26px] shrink-0 items-center rounded-full bg-[#EAECFF] px-2.5 text-[12.5px] font-semibold text-[#5A6AFF]"
              >خریدار</span>

              <div class="flex flex-1 items-center justify-end gap-[3px]">
                <img
                  v-for="i in 5"
                  :key="i"
                  :src="commentStar(i, comment.rating)"
                  alt=""
                  class="size-3.5"
                >
              </div>

              <button
                type="button"
                class="shrink-0 text-[#353566] transition-colors hover:text-T-900"
                aria-label="گزینه‌ها"
              >
                <img src="/icons/product-detail/more-vertical-18.svg" alt="" class="size-[18px]">
              </button>
            </div>

            <div class="h-px w-full bg-T-300" />

            <p class="text-[14px] leading-[28px] text-T-800">{{ comment.text }}</p>

            <button
              type="button"
              class="flex items-center gap-1 self-start text-[12.5px] font-bold text-R-300 transition-colors hover:text-R-400"
            >
              <span>مشاهده بیشتر</span>
              <img src="/icons/product-detail/angle-left-14.svg" alt="" class="size-3.5">
            </button>

            <!-- Footer: reactions on the left, reply on the right -->
            <div class="flex items-center justify-between gap-3">
              <button
                type="button"
                class="flex items-center gap-1.5 text-[12.5px] font-medium transition-colors hover:text-R-300"
              >
                <img src="/icons/product-detail/reply-16.svg" alt="" class="size-4">
                <span class="text-T-800">پاسخ</span>
                <span class="text-T-600">({{ comment.reply ? 1 : 0 }} پاسخ)</span>
              </button>

              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  class="flex h-[34px] w-16 items-center justify-center gap-1 rounded-lg border text-[14px] transition-colors hover:border-T-500"
                  :class="currentVote(comment).vote === 'up'
                    ? 'border-primary text-primary'
                    : 'border-T-400 text-T-800'"
                  @click="vote(comment, 'up')"
                >
                  {{ likesOf(comment) }}
                  <img src="/icons/product-detail/like-20.svg" alt="" class="size-5">
                </button>
                <button
                  type="button"
                  class="flex h-[34px] w-16 items-center justify-center gap-1 rounded-lg border text-[14px] transition-colors hover:border-T-500"
                  :class="currentVote(comment).vote === 'down'
                    ? 'border-primary text-primary'
                    : 'border-T-400 text-T-800'"
                  @click="vote(comment, 'down')"
                >
                  {{ dislikesOf(comment) }}
                  <img src="/icons/product-detail/dislike-20.svg" alt="" class="size-5">
                </button>
              </div>
            </div>

            <!-- Admin reply (design «Frame 3204»): full-bleed, top divider only -->
            <div
              v-if="comment.reply"
              class="-mx-4 -mb-4 flex flex-col gap-3 border-t border-T-400 px-8 py-4"
            >
              <div class="flex items-center gap-4">
                <div class="flex shrink-0 items-center gap-2">
                  <span class="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-T-50">
                    <img src="/homacom-logo.png" :alt="comment.reply.author" class="size-7 object-contain">
                  </span>
                  <div class="flex w-[103px] flex-col gap-0.5 text-right">
                    <span class="text-[14px] font-medium leading-[17px] text-T-900">{{ comment.reply.author }}</span>
                    <span class="text-[12.5px] font-medium leading-[15px] text-T-600">{{ comment.date }}</span>
                  </div>
                </div>

                <span class="flex h-[26px] shrink-0 items-center rounded-full bg-R-10 px-2.5 text-[12.5px] font-semibold text-R-300">
                  ادمین
                </span>

                <div class="flex-1" />

                <button
                  type="button"
                  class="shrink-0 text-[#353566] transition-colors hover:text-T-900"
                  aria-label="گزینه‌ها"
                >
                  <img src="/icons/product-detail/more-vertical-18.svg" alt="" class="size-[18px]">
                </button>
              </div>

              <p class="text-[14px] leading-[28px] text-T-800">{{ comment.reply.text }}</p>

              <div class="flex items-center gap-1.5">
                <button
                  type="button"
                  class="flex h-[34px] w-16 items-center justify-center gap-1 rounded-lg border border-T-400 text-[14px] text-T-800 transition-colors hover:border-T-500"
                >
                  ۰
                  <img src="/icons/product-detail/like-20.svg" alt="" class="size-5">
                </button>
                <button
                  type="button"
                  class="flex h-[34px] w-16 items-center justify-center gap-1 rounded-lg border border-T-400 text-[14px] text-T-800 transition-colors hover:border-T-500"
                >
                  ۰
                  <img src="/icons/product-detail/dislike-20.svg" alt="" class="size-5">
                </button>
              </div>
            </div>
          </article>
        </template>

        <button
          type="button"
          class="flex items-center justify-center gap-1 self-center text-[12.5px] font-bold text-R-300 transition-colors hover:text-R-400"
        >
          <span>مشاهده بیشتر</span>
          <img src="/icons/product-detail/angle-down-14.svg" alt="" class="size-3.5">
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

    <!-- ===================== Mobile comments list ===================== -->
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
            <button
              type="button"
              class="flex h-[30px] items-center gap-1.5 rounded-lg border px-2.5 text-[11.5px] transition-colors"
              :class="currentVote(comment).vote === 'up' ? 'border-primary text-primary' : 'border-T-300 text-T-700'"
              @click="vote(comment, 'up')"
            >
              {{ likesOf(comment) }}
              <IconThumbUp class="size-4" />
            </button>
            <button
              type="button"
              class="flex h-[30px] items-center gap-1.5 rounded-lg border px-2.5 text-[11.5px] transition-colors"
              :class="currentVote(comment).vote === 'down' ? 'border-primary text-primary' : 'border-T-300 text-T-700'"
              @click="vote(comment, 'down')"
            >
              {{ dislikesOf(comment) }}
              <IconThumbDown class="size-4" />
            </button>
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
