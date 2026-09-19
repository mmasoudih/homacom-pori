<script setup lang="ts">
import { IconArrowRight } from '@tabler/icons-vue'
import { toast } from 'vue-sonner'
import { Checkbox } from '@/components/ui/checkbox'
import { findOrder } from '~/data/orders'

const route = useRoute()
const router = useRouter()
const id = computed(() => String(route.params.id))
const order = computed(() => findOrder(id.value))

const selected = ref<Record<string, boolean>>({})

watchEffect(() => {
  const items = order.value?.items ?? []
  items.forEach((item, index) => {
    if (!(item.id in selected.value)) selected.value[item.id] = index < 2
  })
})

function goBack() {
  router.push(`/dashboard/orders/${id.value}`)
}

function submit() {
  const ids = Object.entries(selected.value).filter(([, checked]) => checked).map(([itemId]) => itemId)
  if (!ids.length) {
    toast.error('حداقل یک کالا را برای مرجوعی انتخاب کنید.')
    return
  }
  router.push({ path: `/dashboard/orders/${id.value}/return/create`, query: { items: ids.join(',') } })
}

useHead({
  title: 'انتخاب کالاهای مرجوعی | هماکام',
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

    <div v-if="order" class="flex flex-col gap-4">
      <label
        v-for="item in order.items"
        :key="item.id"
        class="flex cursor-pointer items-center gap-4 rounded-[16px] border border-T-400 bg-T-50 p-4 transition-colors hover:border-T-500"
        :class="selected[item.id] ? 'border-primary/40' : ''"
      >
        <Checkbox
          :id="`return-${item.id}`"
          v-model="selected[item.id]"
          class="size-5 rounded-md"
        />
        <span class="min-w-0 flex-1 text-[13px] font-medium leading-[24px] text-T-800">
          {{ item.title }}
        </span>
        <ProductImage
          :src="item.image"
          :alt="item.title"
          container-class="size-[72px] shrink-0 rounded-xl bg-transparent"
        />
      </label>
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
        class="h-11 min-w-[160px] rounded-xl bg-primary px-6 text-[13px] font-bold text-white transition-colors hover:bg-primary/90"
        @click="submit"
      >
        تایید و ادامه
      </button>
    </div>
  </DashboardOrdersBareShell>

  <DashboardOrdersMobileBareShell
    title="انتخاب کالاهای مرجوعی"
    align="center"
    :back-to="`/dashboard/orders/${id}`"
  >
    <DashboardOrdersMobileReturnSelectRow
      v-for="item in order?.items ?? []"
      :key="item.id"
      v-model="selected[item.id]"
      :item="item"
    />

    <template #footer>
      <button
        type="button"
        class="h-11 w-full rounded-xl bg-primary text-[13px] font-bold text-white"
        @click="submit"
      >
        تایید و ادامه
      </button>
    </template>
  </DashboardOrdersMobileBareShell>
  </div>
</template>
