<script setup lang="ts">
import { ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import { IconBell } from '@tabler/icons-vue'

const props = withDefaults(
  defineProps<{ open: boolean }>(),
  {},
)

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const options = [
  { id: 'sms', label: 'از طریق پیامک به شماره ۰۹۳۹۳۲۰۶۰۶۶' },
  { id: 'email', label: 'از طریق ایمیل به آدرس user@example.com' },
]

const checked = ref<Set<string>>(new Set(['email']))

watch(
  () => props.open,
  (open) => {
    if (open) checked.value = new Set(['email'])
  },
)

function toggle(id: string) {
  if (checked.value.has(id))
    checked.value.delete(id)
  else checked.value.add(id)
  checked.value = new Set(checked.value)
}

function submit() {
  if (!checked.value.size) {
    toast.error('لطفا حداقل یک روش اطلاع‌رسانی را انتخاب کنید.')
    return
  }
  toast.success('درخواست شما ثبت شد؛ به محض موجود شدن محصول به شما اطلاع می‌دهیم.')
  emit('update:open', false)
}

const dialogShell
  = 'max-sm:top-auto! max-sm:bottom-0! max-sm:start-0! max-sm:translate-x-0! max-sm:translate-y-0! max-sm:w-full! max-sm:max-w-full! max-sm:rounded-b-none! max-sm:rounded-t-2xl! max-sm:pb-[env(safe-area-inset-bottom)] max-sm:data-[state=open]:slide-in-from-bottom-full! max-sm:data-[state=closed]:slide-out-to-bottom-full! max-sm:data-[state=open]:zoom-in-100! max-sm:data-[state=closed]:zoom-out-100! max-sm:data-[state=open]:fade-in-100! max-sm:data-[state=closed]:fade-out-100! max-sm:duration-300!'
</script>

<template>
  <UiDialog :open="open" @update:open="emit('update:open', $event)">
    <UiDialogContent
      :class="dialogShell"
      :show-close-button="false"
      class="max-w-[420px] gap-0 rounded-2xl p-0 sm:max-w-[420px]"
    >
      <!-- Header -->
      <div class="flex flex-col gap-3.5 px-6 pt-5">
        <div class="flex items-center justify-between">
          <UiDialogTitle class="text-[16px] font-bold text-T-900">اطلاع‌رسانی موجودی</UiDialogTitle>
          <UiDialogClose
            class="flex size-9 items-center justify-center rounded-full text-T-600 transition-colors hover:bg-T-100 hover:text-T-900"
            aria-label="بستن"
          />
        </div>
        <div class="h-px w-full bg-T-300" />
      </div>

      <!-- Body -->
      <div class="flex flex-col gap-7 px-6 py-6">
        <p class="text-[15px] leading-[24px] text-T-900">
          در صورت موجود شدن کالا، چطور می‌توانیم به شما اطلاع دهیم؟
        </p>

        <div class="flex flex-col gap-2.5">
          <label
            v-for="option in options"
            :key="option.id"
            class="flex cursor-pointer items-center justify-end gap-2"
          >
            <span class="order-1 text-[12.5px] text-T-900">{{ option.label }}</span>
            <UiCheckbox
              :model-value="checked.has(option.id)"
              class="order-2 size-[18px]"
              @update:model-value="toggle(option.id)"
            />
          </label>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between gap-6 px-6 pb-6">
        <button
          type="button"
          class="flex h-[42px] flex-1 items-center justify-center gap-2 rounded-xl bg-R-300 text-[14px] font-bold text-white transition-colors hover:bg-R-400"
          @click="submit"
        >
          ثبت
          <IconBell v-if="false" class="size-4" />
        </button>
        <button
          type="button"
          class="flex h-[42px] flex-1 items-center justify-center rounded-xl bg-T-300 text-[14px] font-semibold text-T-900 transition-colors hover:bg-T-400"
          @click="emit('update:open', false)"
        >
          انصراف
        </button>
      </div>
    </UiDialogContent>
  </UiDialog>
</template>
