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

const firstName = ref('')
const lastName = ref('')

watch(
  () => props.open,
  (open) => {
    if (open) {
      firstName.value = props.firstName
      lastName.value = props.lastName
    }
  },
  { immediate: true },
)

function close() {
  emit('update:open', false)
}

function submit() {
  if (!firstName.value.trim() || !lastName.value.trim()) return
  emit('submit', { firstName: firstName.value.trim(), lastName: lastName.value.trim() })
  close()
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="rounded-2xl p-6 max-sm:top-auto max-sm:bottom-0 max-sm:max-w-none max-sm:translate-y-0 max-sm:rounded-b-none max-sm:rounded-t-3xl max-sm:border-x-0 max-sm:border-b-0 max-sm:data-[state=open]:slide-in-from-bottom max-sm:data-[state=closed]:slide-out-to-bottom sm:max-w-[380px]">
      <DialogTitle class="text-start text-[15px] font-bold text-T-900">
        نام و نام خانوادگی
      </DialogTitle>

      <p class="text-start text-[12.5px] leading-6 text-T-600">
        لطفا نام و نام خانوادگی خود را به زبان فارسی وارد کنید
      </p>

      <div class="flex flex-col gap-2">
        <span class="text-[13px] text-T-800">نام</span>
        <Input v-model="firstName" class="h-11 rounded-xl border-T-400 text-[13px]" />
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-[13px] text-T-800">نام خانوادگی</span>
        <Input v-model="lastName" class="h-11 rounded-xl border-T-400 text-[13px]" />
      </div>

      <div class="flex gap-3">
        <Button variant="secondary" class="h-11 flex-1 rounded-xl" @click="close">انصراف</Button>
        <Button class="h-11 flex-1 rounded-xl" @click="submit">ثبت</Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
