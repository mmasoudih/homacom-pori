<script setup lang="ts">
import { IconChevronDown } from '@tabler/icons-vue'
import { toast } from 'vue-sonner'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { NewTicketPayload } from '~/data/tickets'
import { ticketSubjects } from '~/data/tickets'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'submit': [payload: NewTicketPayload]
}>()

const subject = ref('')
const topic = ref('')
const description = ref('')
const attachment = ref('')

function reset() {
  subject.value = ''
  topic.value = ''
  description.value = ''
  attachment.value = ''
}

watch(
  () => props.open,
  (open) => {
    if (!open) reset()
  },
)

function close() {
  emit('update:open', false)
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  attachment.value = target.files?.[0]?.name ?? ''
}

function submit() {
  if (!subject.value.trim() || !topic.value || !description.value.trim()) {
    toast.error('لطفا عنوان، موضوع و توضیحات را کامل کنید.')
    return
  }
  emit('submit', {
    subject: subject.value,
    topic: topic.value,
    description: description.value,
    attachment: attachment.value,
  })
  toast.success('تیکت شما ثبت شد.')
  close()
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="rounded-[20px] p-6 shadow-none lg:max-w-[560px]">
      <DialogTitle class="text-start">
        <UiTypography as="span" size="xl" weight="bold" color="default">ایجاد تیکت جدید</UiTypography>
      </DialogTitle>

      <div class="h-px w-full bg-T-400" />

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div class="flex flex-col gap-2">
          <UiTypography as="span" size="lg" weight="regular" color="default">عنوان تیکت</UiTypography>
          <Input
            v-model="subject"
            placeholder="عنوان تیکت"
            class="h-11 rounded-xl border-T-400 text-[13px] shadow-none"
          />
        </div>

        <div class="flex flex-col gap-2">
          <UiTypography as="span" size="lg" weight="regular" color="default">موضوع</UiTypography>
          <div class="relative">
            <select
              v-model="topic"
              class="h-11 w-full appearance-none rounded-xl border border-T-400 bg-T-50 px-3 pe-9 text-[13px] text-T-800 outline-none focus:border-primary"
            >
              <option value="" disabled>انتخاب موضوع</option>
              <option v-for="s in ticketSubjects" :key="s.value" :value="s.value">
                {{ s.label }}
              </option>
            </select>
            <IconChevronDown class="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-T-500" />
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <UiTypography as="span" size="lg" weight="regular" color="default">توضیحات</UiTypography>
        <Textarea
          v-model="description"
          class="min-h-[150px] rounded-xl border-T-400 text-[13px] shadow-none"
          placeholder="لطفا جزئیات مشکل را شرح دهید"
        />
      </div>

      <div class="flex flex-col gap-2">
        <UiTypography as="span" size="lg" weight="regular" color="default">پیوست فایل (اختیاری)</UiTypography>
        <div class="flex h-11 items-center justify-between gap-3 rounded-xl border border-T-400 ps-3 text-[12.5px]">
          <span class="truncate text-T-600">{{ attachment || 'فایلی انتخاب نشد' }}</span>
          <input
            id="ticket-file"
            type="file"
            class="hidden"
            @change="onFileChange"
          >
          <label
            for="ticket-file"
            class="flex h-full shrink-0 cursor-pointer items-center rounded-e-xl rounded-s-none border border-T-400 bg-T-300 px-3 text-T-900 hover:bg-T-200"
          >
            <UiTypography as="span" size="lg" weight="regular" color="inherit">انتخاب فایل</UiTypography>
          </label>
        </div>
      </div>

      <div class="mt-2 flex gap-3">
        <button
          type="button"
          class="h-[42px] flex-1 rounded-xl bg-T-100 text-T-800 transition-colors hover:bg-T-200"
          @click="close"
        >
          <UiTypography as="span" size="lg" weight="bold" color="inherit">انصراف</UiTypography>
        </button>
        <button
          type="button"
          class="h-[42px] flex-1 rounded-xl bg-primary text-white transition-colors hover:bg-primary/90"
          @click="submit"
        >
          <UiTypography as="span" size="lg" weight="bold" color="inherit">ایجاد تیکت</UiTypography>
        </button>
      </div>
    </DialogContent>
  </Dialog>
</template>
