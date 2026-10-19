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
const { requestPasswordReset } = useAuth()

useSeoMeta({
  title: () => `${t('auth.forgotTitle')} | ${t('common.brand')}`,
  description: () => t('auth.forgotSubtitle'),
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

watch(mobile, (value) => {
  const clean = sanitizeMobileInput(value)
  if (clean !== value) mobile.value = clean
})

const onSubmit = handleSubmit(async (values) => {
  const normalized = sanitizeMobileInput(values.mobile)
  try {
    await requestPasswordReset(normalized)
    toast.success(t('auth.forgotSuccess'))
    await router.push({ path: '/auth/reset-password', query: { mobile: normalized } })
  }
  catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : t('auth.forgotFailed'))
  }
})
</script>

<template>
  <AuthShell :title="t('auth.forgotTitle')" :subtitle="t('auth.forgotSubtitle')">
    <form class="flex flex-col gap-6" novalidate @submit="onSubmit">
      <FieldGroup>
        <Field :data-invalid="!!mobileErrors.length">
          <FieldLabel for="forgot-mobile">
            {{ t('auth.mobileLabel') }}
          </FieldLabel>
          <Input
            id="forgot-mobile"
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
        {{ t('auth.forgotSubmit') }}
      </Button>
    </form>

    <template #footer>
      <div class="flex justify-center text-sm">
        <NuxtLink to="/auth/login-with-password" class="text-primary hover:underline">
          {{ t('auth.loginWithPassword') }}
        </NuxtLink>
      </div>
    </template>
  </AuthShell>
</template>
