<script setup lang="ts">
import { IconArrowRight } from '@tabler/icons-vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '~/composables/useAuth'

const config = useRuntimeConfig()
const router = useRouter()
const route = useRoute()

const mobile = computed(() => String(route.query.mobile ?? ''))

const formSchema = toTypedSchema(
  z.object({
    code: z
      .string()
      .length(5, 'کد تأیید باید ۵ رقم باشد.'),
  }),
)

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema,
  initialValues: { code: '' },
})

const { value: code, errors: codeErrors } = useField('code')

const { data: loginPage } = await useFetch(() => `${config.public.apiBase}/getLoginPageInfo`)

const backgroundImage = computed(() => loginPage.value?.data?.image?.img ?? '')
const backgroundAlt = computed(() => loginPage.value?.data?.image?.alt ?? 'تصویر ورود')

const { sendOtp, verifyCode } = useAuth()

const isResending = ref(false)

const onSubmit = handleSubmit(async (formValues) => {
  try {
    const res = await verifyCode(mobile.value, formValues.code)
    if (res.data?.token) {
      const token = useCookie('auth_token')
      token.value = res.data.token
    }
    await router.push('/')
  }
  catch (err: any) {
    toast.error(err?.message || 'کد تأیید صحیح نیست.')
  }
})

const onResend = async () => {
  if (!mobile.value) {
    toast.error('شماره موبایل پیدا نشد.')
    return
  }
  isResending.value = true
  try {
    await sendOtp(mobile.value)
    toast.success('کد تأیید مجدداً ارسال شد.')
  }
  catch (err: any) {
    toast.error(err?.message || 'ارسال مجدد کد با خطا مواجه شد.')
  }
  finally {
    isResending.value = false
  }
}
</script>

<template>
  <div dir="rtl" class="grid min-h-dvh bg-background lg:grid-cols-12">
    <section class="flex flex-col lg:col-span-3">
      <div class="flex items-start justify-start p-6">
        <Button
          variant="ghost"
          class="text-primary hover:bg-primary hover:text-white cursor-pointer"
          aria-label="بازگشت"
          @click="router.back()"
        >
          <IconArrowRight data-icon="inline-start" />
          بازگشت
        </Button>
      </div>

      <div class="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-8 px-6 pb-16 sm:px-12 lg:px-16">
        <div class="flex flex-col items-center gap-4 text-center">
          <img
            src="/homacom-logo.png"
            alt="هماکام"
            class="size-14 rounded-2xl object-contain"
          >

          <div class="flex flex-col gap-2">
            <h1 class="text-2xl font-bold">کد تأیید</h1>
            <p class="text-sm text-muted-foreground">
              کد ۵ رقمی ارسال‌شده به <span dir="ltr" class="font-medium text-foreground">{{ mobile }}</span> را وارد کنید.
            </p>
          </div>
        </div>

        <form class="flex flex-col gap-6" novalidate @submit="onSubmit">
          <Field :data-invalid="!!codeErrors.length">
            <FieldLabel for="verify-code">
              کد تأیید
            </FieldLabel>
            <InputOTP
              v-model="code"
              id="verify-code"
              :maxlength="5"
              inputmode="numeric"
              :aria-invalid="!!codeErrors.length"
            >
              <InputOTPGroup class="flex w-full gap-2" dir="ltr">
                <InputOTPSlot v-for="index in 5" :key="index" :index="index - 1" class="h-11 min-w-0 flex-1 text-base" />
              </InputOTPGroup>
            </InputOTP>
            <FieldError v-if="codeErrors.length" :errors="codeErrors" />
          </Field>

          <Button type="submit" class="w-full" :disabled="isSubmitting">
            <Spinner v-if="isSubmitting" data-icon="inline-start" />
            تأیید و ورود
          </Button>
        </form>

        <div class="flex items-center justify-center gap-1 text-sm">
          <span class="text-muted-foreground">کد را دریافت نکردید؟</span>
          <Button
            variant="link"
            class="h-auto p-0 text-primary"
            :disabled="isResending"
            @click="onResend"
          >
            ارسال مجدد کد
          </Button>
        </div>
      </div>
    </section>

    <section class="hidden lg:col-span-9 lg:block">
      <div class="relative h-full min-h-dvh w-full">
        <Skeleton v-if="!backgroundImage" class="absolute inset-0 size-full rounded-none" />
        <img
          v-else
          :src="backgroundImage"
          :alt="backgroundAlt"
          class="absolute inset-0 size-full rounded-none object-cover"
        >
      </div>
    </section>
  </div>
</template>