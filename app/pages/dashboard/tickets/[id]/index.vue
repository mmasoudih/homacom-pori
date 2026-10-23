<script setup lang="ts">
import { toast } from 'vue-sonner'
import { apiErrorMessage } from '~/composables/useApi'

const route = useRoute()

const id = computed(() => String(route.params.id))
const {
  ticket,
  notFound,
  load: loadTicket,
  reply,
  close,
} = useTicketDetail(id)

await loadTicket().catch(() => {
  // The not-found state is rendered below.
})

const closed = computed(() => ticket.value?.status === 'closed')

async function closeTicket() {
  try {
    await close()
    toast.success('تیکت بسته شد.')
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'بستن تیکت انجام نشد.'))
  }
}

async function sendMessage(text: string, file?: File | null) {
  try {
    await reply(text, file)
  }
  catch (err) {
    toast.error(apiErrorMessage(err, 'ارسال پیام انجام نشد.'))
  }
}

useHead({ title: 'جزئیات تیکت | هماکام' })
</script>

<template>
  <div>
    <DashboardTicketsShell>
      <section v-if="ticket" class="rounded-[20px] border border-T-400 bg-T-50 p-4 lg:absolute lg:inset-0 lg:flex lg:flex-col lg:p-6">
        <DashboardTicketsDetailHeader
          :subject="ticket.subject"
          :department="ticket.department"
          :status="ticket.status"
          @close="closeTicket"
        />

        <div class="mt-5 -mx-4 border-t border-T-300 px-4 pt-6 lg:-mx-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:px-6">
          <DashboardTicketsMessageList :messages="ticket.messages" />
        </div>

        <div class="mt-6 -mx-4 border-t border-T-300 lg:-mx-6 lg:-mb-6">
          <DashboardTicketsMessageComposer @send="sendMessage" />
        </div>
      </section>

      <div v-else-if="notFound" class="rounded-[20px] border border-T-400 bg-T-50 p-10 text-center">
        <p class="text-[14px] font-bold text-T-900">تیکت مورد نظر یافت نشد.</p>
        <NuxtLink to="/dashboard/tickets" class="mt-3 inline-block text-[13px] font-semibold text-primary">
          بازگشت به پشتیبانی
        </NuxtLink>
      </div>
    </DashboardTicketsShell>

    <DashboardTicketsMobileShell title="جزئیات تیکت" :show-fab="false" :show-nav="false">
      <template #action>
        <button
          v-if="ticket && !closed"
          type="button"
          class="flex h-9 items-center justify-center rounded-lg border border-T-400 px-[38px]"
          @click="closeTicket"
        >
          <UiTypography as="span" size="md" weight="medium" color="default">بستن تیکت</UiTypography>
        </button>
        <span v-else-if="ticket" class="text-[12px] font-semibold text-T-500">بسته شده</span>
      </template>

      <DashboardTicketsMessageList v-if="ticket" :messages="ticket.messages" />
      <div v-else-if="notFound" class="pt-[210px] text-center">
        <p class="text-[14px] font-bold text-T-900">تیکت مورد نظر یافت نشد.</p>
        <NuxtLink to="/dashboard/tickets" class="mt-3 inline-block text-[13px] font-semibold text-primary">
          بازگشت به پشتیبانی
        </NuxtLink>
      </div>

      <template #footer>
        <DashboardTicketsMessageComposer v-if="ticket" @send="sendMessage" />
      </template>
    </DashboardTicketsMobileShell>
  </div>
</template>
