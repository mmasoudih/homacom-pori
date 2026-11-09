<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { IconPlus, IconMinus, IconX } from '@tabler/icons-vue'
import { apiErrorMessage } from '~/composables/useApi'
import { typographyVariants } from '~/components/ui/typography'
import { toastIcons } from '~/utils/toast'
import { RATING_FACE_SELECTED_SRC, RATING_FACE_SRC } from '~/utils/productDetailIcons'

/** Minimal shape so the dialog can serve both the product page and dashboard comments. */
export interface CommentDialogProduct {
  title: string
  images: Array<{ src?: string }>
}

const props = withDefaults(
  defineProps<{
    open: boolean
    product: CommentDialogProduct
    /** Backend product id; when set the comment is posted to the API. */
    productId?: number | null
    /** Backend relation type; blog posts use `post`. */
    relateTo?: 'product' | 'post'
    /** When set, the dialog edits this comment instead of creating one. */
    commentId?: string | null
    initialRating?: number
    initialText?: string
    initialPositives?: string[]
    initialNegatives?: string[]
    /** `figma` renders the product-page design; `legacy` keeps the shared dashboard/blog look. */
    variant?: 'legacy' | 'figma'
  }>(),
  {
    productId: null,
    relateTo: 'product',
    commentId: null,
    initialRating: 0,
    initialText: '',
    initialPositives: () => [],
    initialNegatives: () => [],
    variant: 'legacy',
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  'submitted': []
}>()

const ratings = [
  { value: 5, label: 'عالی', emoji: '😍' },
  { value: 4, label: 'خوب', emoji: '🙂' },
  { value: 3, label: 'متوسط', emoji: '😐' },
  { value: 2, label: 'ضعیف', emoji: '🙁' },
  { value: 1, label: 'بد', emoji: '😠' },
]

const rating = ref<number>(0)
const text = ref('')
const positives = ref<string[]>([])
const negatives = ref<string[]>([])
const positiveDraft = ref('')
const negativeDraft = ref('')

watch(
  () => props.open,
  (open) => {
    if (open) {
      rating.value = props.initialRating
      text.value = props.initialText
      positives.value = [...props.initialPositives]
      negatives.value = [...props.initialNegatives]
      positiveDraft.value = ''
      negativeDraft.value = ''
    }
  },
)

const canSubmit = computed(() => rating.value > 0 && text.value.trim().length >= 10)

const ratingLabel = computed(() => ratings.find(item => item.value === rating.value)?.label ?? '')
const ratingSummary = computed(() =>
  rating.value > 0
    ? `${ratingLabel.value} (${rating.value} از 5)`
    : 'امتیازی انتخاب نشده',
)

function addPoint(list: 'positive' | 'negative') {
  const value = (list === 'positive' ? positiveDraft : negativeDraft).value.trim()
  if (!value)
    return
  if (list === 'positive')
    positives.value.push(value)
  else negatives.value.push(value)
  ;(list === 'positive' ? positiveDraft : negativeDraft).value = ''
}

async function submit() {
  if (!canSubmit.value) {
    toast.error('لطفا امتیاز و متن دیدگاه (حداقل ۱۰ کاراکتر) را وارد کنید.')
    return
  }

  try {
    const api = useApi()
    const body = {
      title: text.value.trim().slice(0, 80),
      content: text.value.trim(),
      score: rating.value,
      strength: positives.value,
      weakness: negatives.value,
    }

    if (props.commentId) {
      await api.put(`/shop/user/comments/${encodeURIComponent(props.commentId)}`, body)
    }
    else if (props.productId) {
      await api.post('/shop/user/comments', {
        ...body,
        relate_to: props.relateTo,
        relate_id: props.productId,
      })
    }
  }
  catch (err) {
    toast.error(apiErrorMessage(err, props.commentId ? 'ویرایش دیدگاه انجام نشد.' : 'ارسال دیدگاه انجام نشد.'))
    return
  }

  toast.success(
    props.commentId
      ? 'دیدگاه شما ویرایش شد.'
      : 'نظر شما با موفقیت ارسال شد و پس از تایید نمایش داده خواهد شد',
    { icon: toastIcons.message },
  )
  emit('submitted')
  emit('update:open', false)
}

/** Centered dialog on desktop, bottom sheet on mobile. */
const dialogShell
  = 'max-lg:top-auto! max-lg:bottom-0! max-lg:start-0! max-lg:translate-x-0! max-lg:translate-y-0! max-lg:w-full! max-lg:max-w-full! max-lg:rounded-b-none! max-lg:rounded-t-2xl! max-lg:pb-[env(safe-area-inset-bottom)] max-lg:data-[state=open]:slide-in-from-bottom-full! max-lg:data-[state=closed]:slide-out-to-bottom-full! max-lg:data-[state=open]:zoom-in-100! max-lg:data-[state=closed]:zoom-out-100! max-lg:data-[state=open]:fade-in-100! max-lg:data-[state=closed]:fade-out-100! max-lg:duration-300!'
</script>

<template>
  <UiDialog v-if="variant === 'legacy'" :open="open" @update:open="emit('update:open', $event)">
    <UiDialogContent
      :class="dialogShell"
      :show-close-button="false"
      class="max-w-[520px] gap-0 rounded-2xl p-0 lg:max-w-[520px]"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-6 pt-5">
        <UiDialogTitle class="text-[16px] font-bold text-T-900">ثبت دیدگاه</UiDialogTitle>
        <UiDialogClose
          class="flex size-9 items-center justify-center rounded-full text-T-600 transition-colors hover:bg-T-100 hover:text-T-900"
          aria-label="بستن"
        >
          <IconX class="size-5" />
        </UiDialogClose>
      </div>

      <div class="flex max-h-[70vh] flex-col gap-5 overflow-y-auto px-6 py-5">
        <!-- Product summary -->
        <div class="flex items-center gap-3 rounded-2xl bg-T-100 p-3">
          <div class="size-16 shrink-0 overflow-hidden rounded-xl bg-T-50">
            <img
              :src="product.images[0]?.src"
              :alt="product.title"
              class="size-full object-contain p-1"
            >
          </div>
          <p class="line-clamp-2 text-[12.5px] font-medium leading-[20px] text-T-900">
            {{ product.title }}
          </p>
        </div>

        <!-- Rating -->
        <div class="flex flex-col gap-3">
          <p class="text-[13.5px] text-T-900">
            امتیاز شما به این کالا <b class="text-R-300">چقدر</b> می‌دهد؟
          </p>
          <div class="flex items-center justify-center gap-3">
            <button
              v-for="option in ratings"
              :key="option.value"
              type="button"
              class="flex h-[72px] w-[68px] flex-col items-center justify-center gap-1 rounded-2xl border transition-colors"
              :class="rating === option.value
                ? 'border-R-300 bg-R-10'
                : 'border-T-300 bg-T-50 hover:border-T-500'"
              :aria-pressed="rating === option.value"
              @click="rating = option.value"
            >
              <span class="text-[24px] leading-7">{{ option.emoji }}</span>
              <span class="text-[11.5px]" :class="rating === option.value ? 'text-R-300' : 'text-T-700'">
                {{ option.label }}
              </span>
            </button>
          </div>
        </div>

        <!-- Review text -->
        <div class="flex flex-col gap-2">
          <p class="text-[13.5px] text-T-900">دیدگاه شما درباره این کالا</p>
          <textarea
            v-model="text"
            rows="4"
            placeholder="دیدگاه خود را بنویسید..."
            class="w-full resize-none rounded-xl border border-T-300 bg-T-50 p-3.5 text-[12.5px] leading-[22px] text-T-900 outline-none transition-colors placeholder:text-T-600 focus:border-R-300"
          />
        </div>

        <!-- Positive points -->
        <div class="flex flex-col gap-2.5">
          <p class="flex items-center gap-1.5 text-[13.5px] font-bold text-[#2EA36D]">
            <IconPlus class="size-4" />
            بخش مثبت
          </p>
          <div class="flex items-center gap-2 rounded-xl border border-T-300 bg-T-50 px-3">
            <input
              v-model="positiveDraft"
              type="text"
              placeholder="نقطه قوت این کالا"
              class="h-[42px] flex-1 bg-transparent text-[12.5px] text-T-900 outline-none placeholder:text-T-600"
              @keydown.enter.prevent="addPoint('positive')"
            >
            <button
              type="button"
              class="text-T-600 transition-colors hover:text-[#2EA36D]"
              aria-label="افزودن نقطه قوت"
              @click="addPoint('positive')"
            >
              <IconPlus class="size-4.5" />
            </button>
          </div>
          <div v-if="positives.length" class="flex flex-col gap-2">
            <div
              v-for="(point, i) in positives"
              :key="`pos-${i}`"
              class="flex items-center gap-2 rounded-xl border border-T-300 bg-T-100 px-3"
            >
              <button
                type="button"
                class="text-T-600 transition-colors hover:text-R-300"
                :aria-label="`حذف ${point}`"
                @click="positives.splice(i, 1)"
              >
                <IconX class="size-4" />
              </button>
              <span class="h-[42px] flex-1 leading-[42px] text-[12.5px] text-T-900">{{ point }}</span>
            </div>
          </div>
        </div>

        <!-- Negative points -->
        <div class="flex flex-col gap-2.5">
          <p class="flex items-center gap-1.5 text-[13.5px] font-bold text-R-300">
            <IconMinus class="size-4" />
            بخش منفی
          </p>
          <div class="flex items-center gap-2 rounded-xl border border-T-300 bg-T-50 px-3">
            <input
              v-model="negativeDraft"
              type="text"
              placeholder="نقطه ضعف این کالا"
              class="h-[42px] flex-1 bg-transparent text-[12.5px] text-T-900 outline-none placeholder:text-T-600"
              @keydown.enter.prevent="addPoint('negative')"
            >
            <button
              type="button"
              class="text-T-600 transition-colors hover:text-R-300"
              aria-label="افزودن نقطه ضعف"
              @click="addPoint('negative')"
            >
              <IconPlus class="size-4.5" />
            </button>
          </div>
          <div v-if="negatives.length" class="flex flex-col gap-2">
            <div
              v-for="(point, i) in negatives"
              :key="`neg-${i}`"
              class="flex items-center gap-2 rounded-xl border border-T-300 bg-T-100 px-3"
            >
              <button
                type="button"
                class="text-T-600 transition-colors hover:text-R-300"
                :aria-label="`حذف ${point}`"
                @click="negatives.splice(i, 1)"
              >
                <IconX class="size-4" />
              </button>
              <span class="h-[42px] flex-1 leading-[42px] text-[12.5px] text-T-900">{{ point }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-3 border-t border-T-300 px-6 py-4">
        <button
          type="button"
          class="flex h-[42px] w-[140px] items-center justify-center rounded-xl bg-T-300 text-[13.5px] font-bold text-T-900 transition-colors hover:bg-T-400"
          @click="emit('update:open', false)"
        >
          انصراف
        </button>
        <UiButton
          class="h-[42px] w-[140px] rounded-xl text-[13.5px] font-bold"
          @click="submit"
        >
          ثبت دیدگاه
        </UiButton>
      </div>
    </UiDialogContent>
  </UiDialog>

  <!-- ================================================ -->
  <!-- Product-page design variant                       -->
  <!-- ================================================ -->
  <UiDialog v-else :open="open" @update:open="emit('update:open', $event)">
    <UiDialogContent
      :class="dialogShell"
      overlay-class="bg-[#1D1D1F]/45"
      :show-close-button="false"
      class="flex max-w-[506px] flex-col gap-0 overflow-hidden rounded-3xl border-0 bg-white p-0 shadow-none lg:h-[1098px] lg:max-h-[calc(100dvh-2px)] lg:max-w-[506px]"
    >
      <!-- Header -->
      <div class="flex h-[71px] shrink-0 items-center gap-3 px-6">
        <div class="flex min-w-0 flex-1 flex-col gap-[5px]">
          <UiDialogTitle as-child>
            <UiTypography as="h2" size="xl" weight="bold">
              ثبت دیدگاه
            </UiTypography>
          </UiDialogTitle>
        </div>
        <UiDialogClose
          class="flex size-5 shrink-0 items-center justify-center transition-opacity hover:opacity-70"
          aria-label="بستن"
        >
          <img src="/icons/product-detail/xmark-20.svg" alt="" class="size-5">
        </UiDialogClose>
      </div>

      <div class="mx-6 h-px shrink-0 bg-T-400" />

      <!-- Scrollable body -->
      <div class="flex min-h-0 flex-1 flex-col gap-[25px] overflow-y-auto px-6 pt-[27px] pb-2 max-lg:max-h-[62vh] max-lg:px-4 max-lg:pt-4 lg:pb-1.5">
        <!-- Product summary -->
        <div class="flex h-[90px] shrink-0 items-center gap-5 rounded-xl border border-T-400 p-3">
          <img
            :src="product.images[0]?.src"
            :alt="product.title"
            class="size-16 shrink-0 rounded-[7px] object-contain lg:border lg:border-T-400"
          >
          <UiTypography as="p" size="md" class="line-clamp-2 flex-1 text-start">
            {{ product.title }}
          </UiTypography>
        </div>

        <!-- Rating -->
        <div class="flex shrink-0 flex-col gap-[15px]">
          <div class="flex items-center gap-2.5">
            <UiTypography as="p" size="lg" weight="medium">امتیاز شما به این کالا:</UiTypography>
            <UiTypography as="span" size="lg" color="muted">{{ ratingSummary }}</UiTypography>
          </div>

          <div class="flex items-stretch gap-2">
            <button
              v-for="option in [...ratings].reverse()"
              :key="option.value"
              type="button"
              class="flex h-[104px] flex-1 flex-col items-center justify-center gap-3 rounded-[20px] border p-5 transition-colors"
              :class="rating === option.value
                ? 'border-R-300 bg-R-25'
                : 'border-T-400 bg-transparent hover:bg-T-100'"
              :aria-pressed="rating === option.value"
              @click="rating = option.value"
            >
              <img
                :src="rating === option.value
                  ? RATING_FACE_SELECTED_SRC[option.value]
                  : RATING_FACE_SRC[option.value]"
                alt=""
                class="size-8 shrink-0 object-contain"
              >
              <UiTypography as="span" size="md">{{ option.label }}</UiTypography>
            </button>
          </div>
        </div>

        <!-- Comment text -->
        <div class="flex shrink-0 flex-col gap-1.5 lg:min-h-[143px] lg:justify-center">
          <UiTypography as="p" size="lg" weight="medium" class="px-1">دیدگاه شما درباره این کالا:</UiTypography>
          <textarea
            v-model="text"
            rows="3"
            placeholder="متن دیدگاه ..."
            class="h-[112px] w-full resize-none rounded-xl border border-T-500 bg-T-50 px-3 py-[15px] text-T-900 outline-none transition-colors placeholder:text-T-600 focus:border-R-300 lg:bg-white"
            :class="typographyVariants({ size: 'lg' })"
          />
        </div>

        <!-- Positive points -->
        <div class="flex shrink-0 flex-col gap-1.5 rounded-xl border border-T-400 p-3 lg:min-h-[214px]">
          <div class="flex items-center gap-1">
            <img src="/icons/product-detail/plus-18.svg" alt="" class="size-[18px]">
            <UiTypography as="p" size="lg" weight="medium">نکات مثبت</UiTypography>
          </div>

          <div class="flex h-[50px] items-center gap-1.5 rounded-xl border border-T-500 bg-white px-3 py-4">
            <input
              v-model="positiveDraft"
              type="text"
              placeholder="نکات مثبت"
              class="min-w-0 flex-1 bg-transparent text-T-900 outline-none placeholder:text-T-600"
              :class="typographyVariants({ size: 'lg' })"
              @keydown.enter.prevent="addPoint('positive')"
            >
            <button
              type="button"
              class="flex h-7 shrink-0 items-center justify-center rounded-lg px-2 transition-colors"
              :class="positiveDraft.trim() ? 'text-T-900 hover:text-R-300' : 'text-T-600'"
              @click="addPoint('positive')"
            >
              <UiTypography size="lg" weight="semibold">ثبت</UiTypography>
            </button>
          </div>

          <div class="flex flex-col gap-1.5 lg:min-h-[105px] lg:justify-center">
            <div
              v-for="(point, i) in positives"
              :key="`fig-pos-${i}`"
              class="flex min-h-[40px] items-center gap-1 rounded-lg border border-T-300 bg-T-200 p-2.5"
            >
              <img src="/icons/product-detail/plus-14.svg" alt="" class="size-3.5 shrink-0">
              <UiTypography as="span" size="md" class="min-w-0 flex-1 truncate text-start">{{ point }}</UiTypography>
              <button
                type="button"
                class="flex size-4 shrink-0 items-center justify-center transition-opacity hover:opacity-70"
                :aria-label="`حذف ${point}`"
                @click="positives.splice(i, 1)"
              >
                <img src="/icons/product-detail/xmark-16-gray.svg" alt="" class="size-4">
              </button>
            </div>
          </div>
        </div>

        <!-- Negative points -->
        <div class="flex shrink-0 flex-col gap-1.5 rounded-xl border border-T-400 p-3 lg:min-h-[214px]">
          <div class="flex items-center gap-1">
            <img src="/icons/product-detail/minus-18.svg" alt="" class="size-[18px]">
            <UiTypography as="p" size="lg" weight="medium">نکات منفی</UiTypography>
          </div>

          <div class="flex h-[50px] items-center gap-1.5 rounded-xl border border-T-500 bg-white px-3 py-4">
            <input
              v-model="negativeDraft"
              type="text"
              placeholder="نکات منفی"
              class="min-w-0 flex-1 bg-transparent text-T-900 outline-none placeholder:text-T-600"
              :class="typographyVariants({ size: 'lg' })"
              @keydown.enter.prevent="addPoint('negative')"
            >
            <button
              type="button"
              class="flex h-7 shrink-0 items-center justify-center rounded-lg px-2 transition-colors"
              :class="negativeDraft.trim() ? 'text-T-900 hover:text-R-300' : 'text-T-600'"
              @click="addPoint('negative')"
            >
              <UiTypography size="lg" weight="semibold">ثبت</UiTypography>
            </button>
          </div>

          <div class="flex flex-col gap-1.5 lg:min-h-[105px] lg:justify-center">
            <div
              v-for="(point, i) in negatives"
              :key="`fig-neg-${i}`"
              class="flex min-h-[40px] items-center gap-1 rounded-lg border border-T-300 bg-T-200 p-2.5"
            >
              <img src="/icons/product-detail/minus-14.svg" alt="" class="size-3.5 shrink-0">
              <UiTypography as="span" size="md" class="min-w-0 flex-1 truncate text-start">{{ point }}</UiTypography>
              <button
                type="button"
                class="flex size-4 shrink-0 items-center justify-center transition-opacity hover:opacity-70"
                :aria-label="`حذف ${point}`"
                @click="negatives.splice(i, 1)"
              >
                <img src="/icons/product-detail/xmark-16-gray.svg" alt="" class="size-4">
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex h-[92px] shrink-0 items-center justify-between gap-2.5 border-t border-T-300 bg-white px-6 py-6 lg:items-start">
        <button
          type="button"
          class="flex h-[42px] w-[182px] items-center justify-center rounded-xl bg-T-300 max-lg:w-auto max-lg:flex-1 px-[18px] transition-colors hover:bg-T-400"
          @click="emit('update:open', false)"
        >
          <UiTypography size="lg" weight="bold">انصراف</UiTypography>
        </button>
        <button
          type="button"
          class="flex h-[42px] w-[182px] items-center justify-center rounded-xl bg-R-300 max-lg:w-auto max-lg:flex-1 px-[18px] transition-colors hover:bg-R-400"
          @click="submit"
        >
          <UiTypography size="lg" weight="bold" color="white">ثبت دیدگاه</UiTypography>
        </button>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>
