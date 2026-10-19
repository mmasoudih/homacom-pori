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
import { IRAN_MOBILE_REGEX, MOBILE_MAX_LENGTH, sanitizeMobileInput } from '~/utils/auth'

const { t } = useI18n()
const router = useRouter()
const { sendOtp } = useAuth()

useSeoMeta({
  title: () => `${t('auth.loginTitle')} | ${t('common.brand')}`,
  description: () => t('auth.loginSubtitle'),
  robots: 'noindex,follow',
})

const formSchema = toTypedSchema(
  z.object({
    mobile: z
      .string()
      .min(1, t('auth.mobileRequired'))
      .regex(IRAN_MOBILE_REGEX, t('auth.mobileInvalid')),
  }),
)

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema,
  initialValues: { mobile: '' },
})

const { value: mobile, errors: mobileErrors } = useField<string>('mobile')

// Keep the field numeric and capped at 11 characters even when the user
// pastes Persian digits or a formatted number.
watch(mobile, (value) => {
  const clean = sanitizeMobileInput(value)
  if (clean !== value) mobile.value = clean
})

const onSubmit = handleSubmit(async (values) => {
  try {
    await sendOtp(sanitizeMobileInput(values.mobile))
    await router.push({ path: '/auth/verify', query: { mobile: sanitizeMobileInput(values.mobile) } })
  }
  catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : t('auth.otpSendFailed'))
  }
})
</script>

<template>
  <AuthShell :title="t('auth.loginTitle')" :subtitle="t('auth.loginSubtitle')">
    <form class="flex flex-col gap-6" novalidate @submit="onSubmit">
      <FieldGroup>
        <Field :data-invalid="!!mobileErrors.length">
          <FieldLabel for="login-mobile">
            {{ t('auth.mobileLabel') }}
          </FieldLabel>
          <Input
            id="login-mobile"
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
      </FieldGroup>

      <Button type="submit" class="w-full" :disabled="isSubmitting">
        <Spinner v-if="isSubmitting" data-icon="inline-start" />
        {{ t('common.continue') }}
      </Button>

      <Button as-child variant="outline" class="w-full">
        <NuxtLink to="/auth/login-with-password">
          {{ t('auth.loginWithPassword') }}
        </NuxtLink>
      </Button>
    </form>

    <template #footer>
      <p class="text-center text-xs text-muted-foreground">
        {{ t('auth.termsPrefix') }}
        <NuxtLink to="/terms" class="text-primary underline-offset-4 hover:underline">
          {{ t('auth.terms') }}
        </NuxtLink>
        {{ ' ' }}
        <span>و</span>
        {{ ' ' }}
        <NuxtLink to="/terms" class="text-primary underline-offset-4 hover:underline">
          {{ t('auth.privacy') }}
        </NuxtLink>
        {{ t('auth.termsSuffix') }}
      </p>
      <p class="mt-2 text-center text-xs text-muted-foreground">
        {{ t('auth.noAccountHint') }}
      </p>
    </template>
  </AuthShell>
</template>
