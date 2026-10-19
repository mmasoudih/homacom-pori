<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '~/composables/useAuth'
import { toEnglishDigits } from '~/utils/format'
import { IRAN_MOBILE_REGEX, MOBILE_MAX_LENGTH, sanitizeMobileInput } from '~/utils/auth'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { resetPassword } = useAuth()

const initialMobile = sanitizeMobileInput(route.query.mobile ?? '')

useSeoMeta({
  title: () => `${t('auth.resetTitle')} | ${t('common.brand')}`,
  description: () => t('auth.resetSubtitle'),
  robots: 'noindex,nofollow',
})

const formSchema = toTypedSchema(
  z.object({
    mobile: z
      .string()
      .min(1, t('auth.mobileRequired'))
      .regex(IRAN_MOBILE_REGEX, t('auth.mobileInvalid')),
    code: z
      .string()
      .regex(/^[0-9]{5}$/, t('auth.codeDigitsOnly')),
    password: z
      .string()
      .min(8, t('auth.passwordMin')),
    passwordConfirmation: z
      .string()
      .min(1, t('auth.passwordRequired')),
  }).refine(data => data.password === data.passwordConfirmation, {
    path: ['passwordConfirmation'],
    message: t('auth.passwordMismatch'),
  }),
)

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema,
  initialValues: {
    mobile: initialMobile,
    code: '',
    password: '',
    passwordConfirmation: '',
  },
})

const { value: mobile, errors: mobileErrors } = useField<string>('mobile')
const { value: code, errors: codeErrors } = useField<string>('code')
const { value: password, errors: passwordErrors } = useField<string>('password')
const { value: passwordConfirmation, errors: confirmErrors } = useField<string>('passwordConfirmation')

watch(mobile, (value) => {
  const clean = sanitizeMobileInput(value)
  if (clean !== value) mobile.value = clean
})

watch(code, (value) => {
  const clean = toEnglishDigits(String(value ?? '')).replace(/\D/g, '').slice(0, 5)
  if (clean !== value) code.value = clean
})

const onSubmit = handleSubmit(async (values) => {
  try {
    await resetPassword({
      mobile: sanitizeMobileInput(values.mobile),
      code: values.code,
      password: values.password,
      passwordConfirmation: values.passwordConfirmation,
    })
    toast.success(t('auth.resetSuccess'))
    await router.push('/auth/login-with-password')
  }
  catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : t('auth.resetFailed'))
  }
})
</script>

<template>
  <AuthShell :title="t('auth.resetTitle')" :subtitle="t('auth.resetSubtitle')">
    <form class="flex flex-col gap-6" novalidate @submit="onSubmit">
      <FieldGroup>
        <Field :data-invalid="!!mobileErrors.length">
          <FieldLabel for="reset-mobile">
            {{ t('auth.mobileLabel') }}
          </FieldLabel>
          <Input
            id="reset-mobile"
            v-model="mobile"
            type="tel"
            inputmode="numeric"
            pattern="[0-9]*"
            :maxlength="MOBILE_MAX_LENGTH"
            dir="ltr"
            autocomplete="tel-national"
            :placeholder="t('auth.mobilePlaceholder')"
            class="text-start"
            :aria-invalid="!!mobileErrors.length"
          />
          <FieldError v-if="mobileErrors.length" :errors="mobileErrors" />
        </Field>

        <Field :data-invalid="!!codeErrors.length">
          <FieldLabel for="reset-code">
            {{ t('auth.resetCodeLabel') }}
          </FieldLabel>
          <Input
            id="reset-code"
            v-model="code"
            type="text"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="5"
            dir="ltr"
            autocomplete="one-time-code"
            :aria-invalid="!!codeErrors.length"
          />
          <FieldError v-if="codeErrors.length" :errors="codeErrors" />
        </Field>

        <Field :data-invalid="!!passwordErrors.length">
          <FieldLabel for="reset-password">
            {{ t('auth.newPasswordLabel') }}
          </FieldLabel>
          <Input
            id="reset-password"
            v-model="password"
            type="password"
            autocomplete="new-password"
            :aria-invalid="!!passwordErrors.length"
          />
          <FieldError v-if="passwordErrors.length" :errors="passwordErrors" />
        </Field>

        <Field :data-invalid="!!confirmErrors.length">
          <FieldLabel for="reset-password-confirm">
            {{ t('auth.confirmPasswordLabel') }}
          </FieldLabel>
          <Input
            id="reset-password-confirm"
            v-model="passwordConfirmation"
            type="password"
            autocomplete="new-password"
            :aria-invalid="!!confirmErrors.length"
          />
          <FieldError v-if="confirmErrors.length" :errors="confirmErrors" />
        </Field>
      </FieldGroup>

      <Button type="submit" class="w-full" :disabled="isSubmitting">
        <Spinner v-if="isSubmitting" data-icon="inline-start" />
        {{ t('auth.resetSubmit') }}
      </Button>
    </form>

    <template #footer>
      <div class="flex justify-center text-sm">
        <NuxtLink to="/auth/login" class="text-primary hover:underline">
          {{ t('auth.loginWithOtp') }}
        </NuxtLink>
      </div>
    </template>
  </AuthShell>
</template>
