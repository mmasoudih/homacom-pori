<script setup lang="ts">
import { IconArrowRight } from '@tabler/icons-vue'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Spinner } from '@/components/ui/spinner'
import { useAuth } from '~/composables/useAuth'

const config = useRuntimeConfig()
const router = useRouter()

const formSchema = toTypedSchema(
  z.object({
    mobile: z
      .string()
      .regex(/^09\d{9}$/, 'شماره موبایل معتبر نیست.'),
  }),
)

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema,
  initialValues: { mobile: '' },
})

const { data: loginPage } = await useFetch(() => `${config.public.apiBase}/getLoginPageInfo`)

const backgroundImage = computed(() => loginPage.value?.data?.image?.img ?? '')
const backgroundAlt = computed(() => loginPage.value?.data?.image?.alt ?? 'تصویر ورود')

const { sendOtp } = useAuth()

const onSubmit = handleSubmit(async (values) => {
  try {
    await sendOtp(values.mobile)
    await router.push({ path: '/auth/verify', query: { mobile: values.mobile } })
  }
  catch (err: any) {
    toast.error(err?.message || 'ارسال کد تأیید با خطا مواجه شد.')
  }
})
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
            <h1 class="text-2xl font-bold">ثبت‌نام یا ورود</h1>
            <p class="text-sm text-muted-foreground">
              شماره موبایل خود را وارد کنید.
            </p>
          </div>
        </div>

        <form class="flex flex-col gap-6" novalidate @submit="onSubmit">
          <FieldGroup>
            <VeeField v-slot="{ componentField, errors }" name="mobile">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="login-mobile">
                  شماره موبایل
                </FieldLabel>
                <Input
                  id="login-mobile"
                  v-bind="componentField"
                  type="tel"
                  inputmode="numeric"
                  dir="ltr"
                  autocomplete="tel"
                  placeholder="09xxxxxxxxx"
                  class="text-start"
                  :aria-invalid="!!errors.length"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>
          </FieldGroup>

          <Button type="submit" class="w-full" :disabled="isSubmitting">
            <Spinner v-if="isSubmitting" data-icon="inline-start" />
            ادامه
          </Button>
        </form>

        <p class="text-center text-xs text-muted-foreground">
          با ادامه، <a href="#" class="text-primary underline-offset-4 hover:underline">قوانین و مقررات</a> و
          <a href="#" class="text-primary underline-offset-4 hover:underline">حریم خصوصی</a> را می‌پذیرید.
        </p>
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