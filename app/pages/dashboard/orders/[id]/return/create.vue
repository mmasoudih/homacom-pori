<script setup lang="ts">
import { IconArrowRight, IconChevronDown, IconMinus, IconPlus, IconTrash } from '@tabler/icons-vue'
import { toast } from 'vue-sonner'
import { apiErrorMessage } from '~/composables/useApi'
import type { ReferPayloadItem } from '~/composables/useOrders'
import { returnReasons } from '~/data/orders'
import { formatPriceFa, toPersianDigits } from '~/utils/format'

const route = useRoute()
const router = useRouter()
const id = computed(() => String(route.params.id))
const { order } = useOrderDetail(id)
const { refer: referOrder } = useOrderActions()

interface ReturnForm {
  quantity: number
  reason: string
  description: string
}

const form = reactive<Record<string, ReturnForm>>({})
const removedIds = ref<string[]>([])
const submitting = ref(false)

const selectedItems = computed(() => {
  const items = order.value?.items ?? []
  const query = String(route.query.items ?? '')
  const ids = query ? query.split(',') : null
  return items.filter(item => (ids ? ids.includes(item.id) : true) && !removedIds.value.includes(item.id))
})

function entry(itemId: string): ReturnForm {
  if (!form[itemId]) {
    form[itemId] = { quantity: 1, reason: returnReasons[0]!, description: '' }
  }
  return form[itemId]!
}

watchEffect(() => {
  selectedItems.value.forEach(item => entry(item.id))
})

function increment(itemId: string) {
  const row = selectedItems.value.find(item => item.id === itemId)
  const target = form[itemId]!
  // The API guards `count` against the invoice row's quantity.
  if (row && target.quantity < row.quantity) target.quantity += 1
}

function decrement(itemId: string) {
  const target = form[itemId]!
  if (target.quantity > 1) target.quantity -= 1
}

function removeItem(itemId: string) {
  removedIds.value = [...removedIds.value, itemId]
  Reflect.deleteProperty(form, itemId)
}

function goBack() {
  router.push(`/dashboard/orders/${id.value}/return`)
}

async function submit() {
  if (!order.value) return
  if (!selectedItems.value.length) {
    toast.error('حداقل یک کالا را برای مرجوعی انتخاب کنید.')
    return
  }

  // The refer contract only accepts `item_id`, `count` and `description`; the
  // reason select is folded into the description (there is no image upload).
  const items: ReferPayloadItem[] = selectedItems.value.map((item) => {
    const row = entry(item.id)
    const count = Math.min(Math.max(1, row.quantity), item.quantity)
    const description = [row.reason, row.description.trim()].filter(Boolean).join(' - ')

    return {
      item_id: Number(item.id),
      count,
      ...(description ? { description } : {}),
    }
  })

  submitting.value = true
  try {
    const res = await referOrder(order.value.id, items)
    toast.success(res.message || 'درخواست مرجوعی شما ثبت شد.')
    router.push('/dashboard/returns/success')
  }
  catch (err) {
    // 422 guards: unpaid, already requested, 24h window expired, bad item ids.
    toast.error(apiErrorMessage(err, 'ثبت درخواست مرجوعی انجام نشد.'))
  }
  finally {
    submitting.value = false
  }
}

useHead({
  title: 'ثبت درخواست مرجوعی | هماکام',
})
</script>

<template>
  <div>
  <DashboardOrdersBareShell>
    <div class="flex items-center justify-between gap-3 pb-6">
      <h1 class="text-lg font-bold text-T-900">انتخاب کالاهای مرجوعی</h1>
      <button
        type="button"
        class="flex size-9 items-center justify-center rounded-lg border border-T-400 text-T-600 transition-colors hover:border-T-500 hover:text-T-900"
        aria-label="بازگشت"
        @click="goBack"
      >
        <IconArrowRight class="size-4" />
      </button>
    </div>

    <div class="flex flex-col gap-4">
      <section
        v-for="item in selectedItems"
        :key="item.id"
        class="rounded-[16px] border border-T-400 bg-T-50 p-4 lg:p-6"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="flex min-w-0 flex-1 flex-col gap-2.5">
            <p class="text-[13px] font-medium leading-[24px] text-T-900">{{ item.title }}</p>
            <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11.5px] text-T-600">
              <span class="flex items-center gap-1.5">
                رنگ: <b class="font-semibold text-T-800">{{ item.color }}</b>
                <span class="size-3 rounded-full border border-T-300" :style="{ backgroundColor: item.colorHex }" />
              </span>
              <span>گارانتی: <b class="font-semibold text-T-800">{{ item.warranty }}</b></span>
              <span>مبلغ: <b class="font-semibold text-T-800">{{ formatPriceFa(item.price) }}</b> تومان</span>
              <span>تعداد: <b class="font-semibold text-T-800">{{ toPersianDigits(item.quantity) }}</b></span>
            </div>
          </div>

          <ProductImage
            :src="item.image"
            :alt="item.title"
            container-class="size-[72px] shrink-0 rounded-xl bg-transparent"
          />
        </div>

        <div class="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div class="flex flex-col gap-2">
            <span class="text-[12px] font-medium text-T-700">تعداد مرجوعی</span>
            <div class="flex h-11 items-center justify-between rounded-xl border border-T-400 px-3">
              <div class="flex items-center gap-3">
                <button type="button" aria-label="افزودن" class="text-T-800" @click="increment(item.id)">
                  <IconPlus class="size-4" />
                </button>
                <span class="min-w-4 text-center text-[13px] font-bold text-T-900">
                  {{ toPersianDigits(form[item.id]?.quantity ?? 1) }}
                </span>
                <button type="button" aria-label="کاهش" class="text-T-800" @click="decrement(item.id)">
                  <IconMinus class="size-4" />
                </button>
              </div>
              <button type="button" aria-label="حذف" class="text-T-500 hover:text-primary" @click="removeItem(item.id)">
                <IconTrash class="size-4" />
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <span class="text-[12px] font-medium text-T-700">علت مرجوعی</span>
            <div class="relative">
              <select
                v-model="entry(item.id).reason"
                class="h-11 w-full appearance-none rounded-xl border border-T-400 bg-T-50 px-3 pe-9 text-[12.5px] text-T-800 outline-none transition-colors focus:border-primary"
              >
                <option v-for="reason in returnReasons" :key="reason" :value="reason">
                  {{ reason }}
                </option>
              </select>
              <IconChevronDown class="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-T-500" />
            </div>
          </div>
        </div>

        <div class="mt-4 flex flex-col gap-2">
          <span class="text-[12px] font-medium text-T-700">شرح</span>
          <Textarea
            v-model="entry(item.id).description"
            class="min-h-[70px] rounded-xl border-T-400 text-[13px]"
            placeholder="علت مرجوعی را شرح دهید"
          />
        </div>

      </section>
    </div>

    <div class="mt-6 flex flex-wrap items-center justify-between gap-3">
      <button
        type="button"
        class="h-11 min-w-[160px] rounded-xl border border-T-400 bg-T-50 px-6 text-[13px] font-semibold text-T-800 transition-colors hover:border-T-500"
        @click="goBack"
      >
        بازگشت
      </button>

      <button
        type="button"
        class="h-11 min-w-[160px] rounded-xl bg-primary px-6 text-[13px] font-bold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="submitting"
        @click="submit"
      >
        {{ submitting ? 'در حال ثبت…' : 'ثبت درخواست' }}
      </button>
    </div>
  </DashboardOrdersBareShell>

  <DashboardOrdersMobileBareShell
    title="انتخاب کالاهای مرجوعی"
    align="center"
    :back-to="`/dashboard/orders/${id}/return`"
  >
    <DashboardOrdersMobileReturnFormCard
      v-for="item in selectedItems"
      :key="item.id"
      :item="item"
      :quantity="form[item.id]?.quantity ?? 1"
      :reason="form[item.id]?.reason ?? ''"
      :description="form[item.id]?.description ?? ''"
      @update:quantity="entry(item.id).quantity = $event"
      @update:reason="entry(item.id).reason = $event"
      @update:description="entry(item.id).description = $event"
      @increment="increment(item.id)"
      @decrement="decrement(item.id)"
      @remove="removeItem(item.id)"
    />

    <template #footer>
      <div class="flex gap-3">
        <button
          type="button"
          class="h-11 flex-1 rounded-xl border border-T-300 font-semibold text-T-800"
          @click="goBack"
        >
          بازگشت
        </button>
        <button
          type="button"
          class="h-11 flex-1 rounded-xl bg-primary font-bold text-white disabled:opacity-60"
          :disabled="submitting"
          @click="submit"
        >
          {{ submitting ? 'در حال ثبت…' : 'ثبت درخواست' }}
        </button>
      </div>
    </template>
  </DashboardOrdersMobileBareShell>
  </div>
</template>
