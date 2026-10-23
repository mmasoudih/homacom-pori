<script setup lang="ts">
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
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '~/composables/useAuth'
import { toEnglishDigits } from '~/utils/format'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const mobile = computed(() => String(route.query.mobile ?? ''))

useSeoMeta({
  title: () => `${t('auth.verifyTitle')} | ${t('common.brand')}`,
  description: () => t('auth.verifyTitle'),
  robots: 'noindex,nofollow',
})

const formSchema = toTypedSchema(
  z.object({
    code: z
      .string()
      .regex(/^[0-9]{5}$/, t('auth.codeDigitsOnly')),
  }),
)

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema,
  initialValues: { code: '' },
})

const { value: code, errors: codeErrors } = useField<string>('code')

// OTP inputs must only ever contain ASCII digits — strip anything else,
// including Persian/Arabic digits pasted from an SMS.
watch(code, (value) => {
  const clean = toEnglishDigits(String(value ?? ''))
    .replace(/\D/g, '')
    .slice(0, 5)
  if (clean !== value) code.value = clean
})

const { sendOtp, verifyCode, setSession } = useAuth()

const isResending = ref(false)

const onSubmit = handleSubmit(async (formValues) => {
  if (!mobile.value) {
    toast.error(t('auth.mobileMissing'))
    return
  }

  try {
    const res = await verifyCode(mobile.value, formValues.code)
    if (res.data?.token)
      setSession(res.data.token, { ...res.data.user, mobile: res.data.user?.mobile ?? mobile.value })

    await router.push('/')
  }
  catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : t('auth.otpVerifyFailed'))
  }
})

const onResend = async () => {
  if (!mobile.value) {
    toast.error(t('auth.mobileMissing'))
    return
  }
  isResending.value = true
  try {
    await sendOtp(mobile.value)
    toast.success(t('auth.resendSuccess'))
  }
  catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : t('auth.resendFailed'))
  }
  finally {
    isResending.value = false
  }
}
</script>

<template>
  <AuthShell :title="t('auth.verifyTitle')">
    <template #subtitle>
      <p class="text-sm text-muted-foreground">
        {{ t('auth.verifySubtitlePrefix') }}
        <span dir="ltr" class="font-medium text-foreground">{{ mobile }}</span>
        {{ t('auth.verifySubtitleSuffix') }}
      </p>
    </template>

    <form class="flex flex-col gap-6" novalidate @submit="onSubmit">
      <Field :data-invalid="!!codeErrors.length">
        <FieldLabel for="verify-code">
          {{ t('auth.codeLabel') }}
        </FieldLabel>
        <InputOTP
          id="verify-code"
          v-model="code"
          :maxlength="5"
          inputmode="numeric"
          pattern="^[0-9]*$"
          autocomplete="one-time-code"
          :aria-invalid="!!codeErrors.length"
          @complete="onSubmit()"
        >
          <InputOTPGroup class="flex w-full gap-2" dir="ltr">
            <InputOTPSlot v-for="index in 5" :key="index" :index="index - 1" class="h-11 min-w-0 flex-1 text-base" />
          </InputOTPGroup>
        </InputOTP>
        <FieldError v-if="codeErrors.length" :errors="codeErrors" />
      </Field>

      <Button type="submit" class="w-full" :disabled="isSubmitting">
        <Spinner v-if="isSubmitting" data-icon="inline-start" />
        {{ t('auth.verifyAndLogin') }}
      </Button>

      <Button as-child variant="outline" class="w-full">
        <NuxtLink to="/auth/login-with-password">
          {{ t('auth.loginWithPassword') }}
        </NuxtLink>
      </Button>
    </form>

    <template #footer>
      <div class="flex items-center justify-center gap-1 text-sm">
        <span class="text-muted-foreground">{{ t('auth.resendHint') }}</span>
        <Button
          variant="link"
          class="h-auto p-0 text-primary"
          :disabled="isResending"
          @click="onResend"
        >
          {{ t('auth.resendCode') }}
        </Button>
      </div>
    </template>
  </AuthShell>
</template>
