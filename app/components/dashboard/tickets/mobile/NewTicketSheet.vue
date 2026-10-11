<script setup lang="ts">
import { IconChevronDown, IconX } from '@tabler/icons-vue'
import { toast } from 'vue-sonner'
import {
  Dialog as UiDialog,
  DialogClose as UiDialogClose,
  DialogContent as UiDialogContent,
  DialogTitle as UiDialogTitle,
} from '@/components/ui/dialog'
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

watch(
  () => props.open,
  (open) => {
    if (!open) {
      subject.value = ''
      topic.value = ''
      description.value = ''
      attachment.value = ''
    }
  },
)

function onFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  attachment.value = file ? file.name : ''
}

function close() {
  emit('update:open', false)
}

function submit() {
  if (!subject.value.trim() || !topic.value || !description.value.trim()) {
    toast.error('لطفا عنوان، موضوع و توضیحات را کامل کنید.')
    return
  }
  emit('submit', {
    subject: subject.value.trim(),
    topic: topic.value,
    description: description.value.trim(),
    attachment: attachment.value,
  })
  toast.success('تیکت شما ثبت شد.')
  close()
}

const sheetShell
  = 'top-auto! bottom-0! start-0! end-0! translate-x-0! rtl:translate-x-0! translate-y-0! w-full! max-w-full! lg:max-w-full! max-h-[90dvh]! gap-0! rounded-t-2xl! rounded-b-none! p-0! flex! flex-col! overflow-hidden!'
</script>

<template>
  <UiDialog :open="open" @update:open="emit('update:open', $event)">
    <UiDialogContent :class="sheetShell" :show-close-button="false">
      <div class="flex shrink-0 items-center justify-between border-b border-T-300 px-4 py-4">
        <UiDialogTitle class="text-[15px] font-bold text-T-900">ایجاد تیکت جدید</UiDialogTitle>
        <UiDialogClose
          class="flex size-9 items-center justify-center rounded-full text-T-600 transition-colors hover:bg-T-100 hover:text-T-900"
          aria-label="بستن"
        >
          <IconX class="size-5" />
        </UiDialogClose>
      </div>

      <div class="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <UiTypography as="p" size="lg" weight="medium" color="default" class="text-start">لطفا نام و نام خانوادگی خود را به زبان فارسی وارد کنید</UiTypography>

        <div class="grid grid-cols-2 gap-3">
          <div class="flex flex-col gap-2">
            <UiTypography as="span" size="lg" weight="regular" color="default">عنوان تیکت</UiTypography>
            <Input v-model="subject" placeholder="عنوان تیکت" class="h-11 rounded-xl border-T-400 text-[13px] shadow-none" />
          </div>

          <div class="flex flex-col gap-2">
            <UiTypography as="span" size="lg" weight="regular" color="default">موضوع</UiTypography>
            <div class="relative">
              <select
                v-model="topic"
                class="h-11 w-full appearance-none rounded-xl border border-T-400 bg-T-50 px-3 pe-9 text-[13px] text-T-800 outline-none focus:border-primary"
              >
                <option value="" disabled>انتخاب موضوع</option>
                <option v-for="item in ticketSubjects" :key="item.value" :value="item.value">
                  {{ item.label }}
                </option>
              </select>
              <IconChevronDown class="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-T-500" />
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <UiTypography as="span" size="lg" weight="regular" color="default">توضیحات</UiTypography>
          <Textarea v-model="description" class="min-h-[150px] rounded-xl border-T-400 text-[13px] shadow-none" placeholder="لطفا جزئیات مشکل را شرح دهید" />
        </div>

        <div class="flex flex-col gap-2">
          <UiTypography as="span" size="lg" weight="regular" color="default">پیوست فایل (اختیاری)</UiTypography>
          <div class="flex h-11 items-center justify-between gap-3 rounded-xl border border-T-400 ps-3 text-[12.5px]">
            <span class="min-w-0 flex-1 truncate text-T-600">{{ attachment || 'فایلی انتخاب نشد' }}</span>
            <input id="ticket-attachment" type="file" class="hidden" @change="onFileChange">
            <label
              for="ticket-attachment"
              class="flex h-full shrink-0 cursor-pointer items-center rounded-e-xl rounded-s-none border border-T-400 bg-T-300 px-3 text-T-900 hover:bg-T-200"
            >
              <UiTypography as="span" size="lg" weight="regular" color="inherit">انتخاب فایل</UiTypography>
            </label>
          </div>
        </div>
      </div>

      <div class="flex shrink-0 gap-3 p-4 pt-0">
        <button
          type="button"
          class="h-11 flex-1 rounded-xl bg-T-100 text-[13px] font-semibold text-T-800 transition-colors hover:bg-T-200"
          @click="close"
        >
          انصراف
        </button>
        <button
          type="button"
          class="h-11 flex-1 rounded-xl bg-primary text-[13px] font-bold text-white transition-colors hover:bg-primary/90"
          @click="submit"
        >
          ثبت
        </button>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>
