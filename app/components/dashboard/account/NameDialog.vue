<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

const props = defineProps<{
  open: boolean
  firstName: string
  lastName: string
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  'submit': [payload: { firstName: string, lastName: string }]
}>()

const form = reactive({ firstName: '', lastName: '' })

watch(
  () => props.open,
  (open) => {
    if (open) {
      form.firstName = props.firstName
      form.lastName = props.lastName
    }
  },
  { immediate: true },
)

function close() {
  emit('update:open', false)
}

function submit() {
  if (!form.firstName.trim() || !form.lastName.trim()) return
  emit('submit', { firstName: form.firstName.trim(), lastName: form.lastName.trim() })
  close()
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="gap-6 rounded-2xl p-6 max-lg:top-auto max-lg:bottom-0 max-lg:max-w-none max-lg:translate-y-0 max-lg:rounded-b-none max-lg:rounded-t-3xl max-lg:border-x-0 max-lg:border-b-0 max-lg:data-[state=open]:slide-in-from-bottom max-lg:data-[state=closed]:slide-out-to-bottom lg:max-w-[380px]">
      <div class="border-b border-T-300 pb-4">
        <DialogTitle class="text-start text-[16px] font-bold text-T-900">
          نام و نام خانوادگی
        </DialogTitle>
      </div>

      <p class="text-start text-[12.5px] leading-6 text-T-600">
        لطفا نام و نام خانوادگی خود را به زبان فارسی وارد کنید
      </p>

      <div class="flex flex-col gap-2">
        <span class="text-[13px] text-T-800">نام</span>
        <Input v-model="form.firstName" class="h-11 rounded-xl border-T-400 text-[13px]" />
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-[13px] text-T-800">نام خانوادگی</span>
        <Input v-model="form.lastName" class="h-11 rounded-xl border-T-400 text-[13px]" />
      </div>

      <div class="flex gap-3">
        <Button variant="secondary" class="h-11 flex-1 rounded-xl" @click="close">انصراف</Button>
        <Button class="h-11 flex-1 rounded-xl" @click="submit">ثبت</Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
