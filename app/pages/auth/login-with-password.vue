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
const { loginWithPassword } = useAuth()

useSeoMeta({
  title: () => `${t('auth.passwordLoginTitle')} | ${t('common.brand')}`,
  description: () => t('auth.passwordLoginSubtitle'),
  robots: 'noindex,follow',
})

const formSchema = toTypedSchema(
  z.object({
    mobile: z
      .string()
      .min(1, t('auth.mobileRequired'))
      .regex(IRAN_MOBILE_REGEX, t('auth.mobileInvalid')),
    password: z
      .string()
      .min(1, t('auth.passwordRequired'))
      .min(8, t('auth.passwordMin')),
  }),
)

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema,
  initialValues: { mobile: '', password: '' },
})

const { value: mobile, errors: mobileErrors } = useField<string>('mobile')
const { value: password, errors: passwordErrors } = useField<string>('password')

watch(mobile, (value) => {
  const clean = sanitizeMobileInput(value)
  if (clean !== value) mobile.value = clean
})

const onSubmit = handleSubmit(async (values) => {
  try {
    const res = await loginWithPassword(sanitizeMobileInput(values.mobile), values.password)
    const token = useCookie('auth_token')
    token.value = res.token ?? ''

    const authUser = useCookie<{ id?: number, mobile?: string, nickname?: string | null } | null>('auth_user')
    authUser.value = {
      id: res.user?.id,
      mobile: res.user?.mobile ?? sanitizeMobileInput(values.mobile),
      nickname: res.user?.nickname,
    }

    await router.push('/')
  }
  catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : t('auth.passwordLoginFailed'))
  }
})
</script>

<template>
  <AuthShell :title="t('auth.passwordLoginTitle')" :subtitle="t('auth.passwordLoginSubtitle')">
    <form class="flex flex-col gap-6" novalidate @submit="onSubmit">
      <FieldGroup>
        <Field :data-invalid="!!mobileErrors.length">
          <FieldLabel for="password-login-mobile">
            {{ t('auth.mobileLabel') }}
          </FieldLabel>
          <Input
            id="password-login-mobile"
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

        <Field :data-invalid="!!passwordErrors.length">
          <FieldLabel for="password-login-password">
            {{ t('auth.passwordLabel') }}
          </FieldLabel>
          <Input
            id="password-login-password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            :aria-invalid="!!passwordErrors.length"
          />
          <FieldError v-if="passwordErrors.length" :errors="passwordErrors" />
        </Field>
      </FieldGroup>

      <Button type="submit" class="w-full" :disabled="isSubmitting">
        <Spinner v-if="isSubmitting" data-icon="inline-start" />
        {{ t('auth.loginButton') }}
      </Button>
    </form>

    <template #footer>
      <div class="flex flex-col items-center gap-3 text-sm">
        <NuxtLink to="/auth/forgot-password" class="text-primary hover:underline">
          {{ t('auth.forgotPassword') }}
        </NuxtLink>
        <Button as-child variant="outline" class="w-full">
          <NuxtLink to="/auth/login">
            {{ t('auth.loginWithOtp') }}
          </NuxtLink>
        </Button>
      </div>
    </template>
  </AuthShell>
</template>
