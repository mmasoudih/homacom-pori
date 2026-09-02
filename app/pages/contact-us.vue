<script setup lang="ts">
import {
  IconMapPin,
  IconMailOpened,
  IconPhoneCall,
  IconSend,
  IconInfoCircle,
  IconHelpCircle,
  IconBrandTelegram,
  IconBrandX,
  IconBrandYoutube,
  IconBrandInstagram,
  IconChevronLeft,
} from '@tabler/icons-vue'
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
import { Textarea } from '@/components/ui/textarea'
import { contactPage } from '~/data/pages/contact'

useHead({
  title: 'تماس با ما | هماکام',
})

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(3, 'نام و نام خانوادگی را وارد کنید.'),
    contact: z.string().min(5, 'شماره تماس یا ایمیل معتبر وارد کنید.'),
    subject: z.string().min(1, 'موضوع را انتخاب کنید.'),
    message: z.string().min(10, 'متن پیام حداقل ۱۰ کاراکتر باشد.'),
  }),
)

const { handleSubmit, isSubmitting, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: { name: '', contact: '', subject: '', message: '' },
})

const onSubmit = handleSubmit(async (values) => {
  await new Promise(resolve => setTimeout(resolve, 600))
  toast.success('پیام شما با موفقیت ثبت شد.', {
    description: `کارشناسان ما به زودی با شما تماس می‌گیرند. (${values.name})`,
  })
  resetForm()
})

const socialIcons = {
  telegram: IconBrandTelegram,
  x: IconBrandX,
  youtube: IconBrandYoutube,
  instagram: IconBrandInstagram,
} as const
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-T-100">
    <LandingSiteHeader />

    <main class="flex w-full flex-col items-center px-4 pb-16 lg:px-0">
      <!-- Page hero -->
      <div class="flex flex-col items-center pt-10 lg:pt-14">
        <div class="flex items-center gap-3">
          <span class="h-[38px] w-[7px] rounded-full bg-primary" />
          <h1 class="text-[26px] font-bold leading-[38px] text-primary lg:text-[30px]">
            {{ contactPage.title }}
          </h1>
          <span class="h-[38px] w-[7px] rounded-full bg-primary" />
        </div>
        <p class="mt-3 max-w-[620px] text-center text-[14.5px] leading-[26px] text-T-700">
          {{ contactPage.subtitle }}
        </p>
      </div>

      <div class="mt-10 flex w-full max-w-[1100px] flex-col gap-4 lg:mt-12">
        <!-- Online guide -->
        <section class="rounded-[16px] border border-T-400 bg-T-50 p-5 lg:p-6">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-10">
            <div class="flex min-w-[220px] flex-col gap-2">
              <h2 class="text-[17px] font-bold text-foreground">{{ contactPage.guideTitle }}</h2>
              <p class="text-[13px] leading-[22px] text-T-600">پاسخ سوالات خود را سریع‌تر پیدا کنید.</p>
            </div>
            <div class="flex flex-1 flex-col gap-3">
            <NuxtLink
              v-for="(row, i) in contactPage.guideRows"
              :key="i"
              :to="i === 0 ? '/guarantee' : '/faq'"
              class="group flex items-center gap-4 rounded-[12px] bg-T-100 px-5 py-3 transition-colors hover:bg-R-10"
            >
              <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-T-50">
                <IconInfoCircle v-if="i === 0" class="size-5 text-primary" />
                <IconHelpCircle v-else class="size-5 text-primary" />
              </span>
              <span class="flex min-w-0 flex-1 flex-col">
                <span class="text-[15px] font-semibold text-foreground">{{ row.title }}</span>
                <span class="mt-1 text-[12.5px] leading-[20px] text-T-600">{{ row.subtitle }}</span>
              </span>
              <IconChevronLeft class="size-4 shrink-0 text-T-500 transition-colors group-hover:text-primary" />
            </NuxtLink>
            </div>
          </div>
        </section>

        <!-- Phone & socials -->
        <section class="flex flex-col gap-3 rounded-[16px] bg-T-50 p-5 lg:flex-row lg:items-center lg:justify-between lg:p-6">
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3">
              <IconPhoneCall class="size-5 text-primary" />
              <h2 class="text-[16px] font-bold text-foreground">{{ contactPage.phone.title }}</h2>
            </div>
            <p class="text-[13px] leading-[22px] text-T-600">
              {{ contactPage.phone.subtitle }}
            </p>
            <a
              href="tel:0213250789"
              class="inline-flex w-full items-center justify-center rounded-full bg-T-100 px-5 py-2 text-[20px] font-bold leading-[30px] text-primary lg:w-fit"
              dir="ltr"
            >
              {{ contactPage.phone.number }}
            </a>
          </div>
          <div class="mt-3 flex items-center gap-2 lg:mt-0">
            <span
              v-for="(social, si) in contactPage.phone.socials"
              :key="si"
              class="flex size-10 items-center justify-center rounded-full bg-T-100 text-T-700 transition-colors hover:text-primary"
            >
              <component :is="socialIcons[social as keyof typeof socialIcons]" class="size-[18px]" />
            </span>
          </div>
        </section>

        <!-- Email -->
        <section class="flex flex-col gap-3 rounded-[16px] bg-T-50 p-5 lg:flex-row lg:items-center lg:justify-between lg:p-6">
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3">
              <IconMailOpened class="size-5 text-primary" />
              <h2 class="text-[16px] font-bold text-foreground">{{ contactPage.email.title }}</h2>
            </div>
            <p class="text-[13px] leading-[22px] text-T-600">
              {{ contactPage.email.subtitle }}
            </p>
          </div>
          <a
            href="mailto:Homacom@info.mail"
            class="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-T-100 px-5 py-2.5 text-[14px] font-semibold text-T-800 transition-colors hover:text-primary lg:mt-0 lg:w-fit"
            dir="ltr"
          >
            <IconMailOpened class="size-4" />
            {{ contactPage.email.address }}
          </a>
        </section>

        <!-- Map + address -->
        <section class="flex flex-col gap-4 rounded-[16px] border border-T-400 bg-T-50 p-5 lg:p-6">
          <h2 class="text-[16px] font-bold text-foreground">{{ contactPage.store.title }}</h2>
          <PagesMapPlaceholder class="h-[240px] w-full lg:h-[320px]" />
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <p class="text-[13.5px] leading-[24px] text-T-700">
              {{ contactPage.store.address }}
            </p>
            <a
              href="#"
              class="inline-flex w-fit items-center gap-2 rounded-full bg-T-100 px-5 py-2.5 text-[13px] font-medium text-T-800 transition-colors hover:text-primary"
            >
              <IconMapPin class="size-4 text-primary" />
              نمایش در نقشه
            </a>
          </div>
        </section>
      </div>

      <!-- Message form -->
      <section class="mt-10 w-full max-w-[1100px] rounded-[16px] border border-T-400 bg-T-50 p-5 lg:p-8">
        <h2 class="text-[18px] font-bold text-foreground">{{ contactPage.form.title }}</h2>
        <p class="mt-2 text-[13.5px] leading-[22px] text-T-600">
          {{ contactPage.form.subtitle }}
        </p>

        <form class="mt-6 flex flex-col gap-5" novalidate @submit="onSubmit">
          <div class="grid gap-5 lg:grid-cols-3">
            <FieldGroup>
              <VeeField v-slot="{ componentField, errors }" name="name">
                <Field :data-invalid="!!errors.length">
                  <FieldLabel for="contact-name">
                    {{ contactPage.form.nameLabel }}
                  </FieldLabel>
                  <Input
                    id="contact-name"
                    v-bind="componentField"
                    type="text"
                    placeholder="مثال: علی رضایی"
                    :aria-invalid="!!errors.length"
                  />
                  <FieldError v-if="errors.length" :errors="errors" />
                </Field>
              </VeeField>
            </FieldGroup>

            <FieldGroup>
              <VeeField v-slot="{ componentField, errors }" name="contact">
                <Field :data-invalid="!!errors.length">
                  <FieldLabel for="contact-phone">
                    {{ contactPage.form.contactLabel }}
                  </FieldLabel>
                  <Input
                    id="contact-phone"
                    v-bind="componentField"
                    type="text"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹ یا email@example.com"
                    :aria-invalid="!!errors.length"
                  />
                  <FieldError v-if="errors.length" :errors="errors" />
                </Field>
              </VeeField>
            </FieldGroup>
          </div>

          <FieldGroup class="lg:col-span-1">
            <VeeField v-slot="{ componentField, errors }" name="subject">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="contact-subject">
                  {{ contactPage.form.subjectLabel }}
                </FieldLabel>
                <select
                  id="contact-subject"
                  v-bind="componentField"
                  class="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                  :aria-invalid="!!errors.length"
                >
                  <option value="" disabled selected>
                    {{ contactPage.form.subjectPlaceholder }}
                  </option>
                  <option
                    v-for="subject in contactPage.form.subjects"
                    :key="subject"
                    :value="subject"
                  >
                    {{ subject }}
                  </option>
                </select>
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>
          </FieldGroup>

          <FieldGroup>
            <VeeField v-slot="{ componentField, errors }" name="message">
              <Field :data-invalid="!!errors.length">
                <FieldLabel for="contact-message">
                  {{ contactPage.form.messageLabel }}
                </FieldLabel>
                <Textarea
                  id="contact-message"
                  v-bind="componentField"
                  :placeholder="contactPage.form.messagePlaceholder"
                  class="min-h-[140px]"
                  :aria-invalid="!!errors.length"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>
          </FieldGroup>

          <div class="flex justify-end">
            <Button type="submit" class="rounded-full px-8" :disabled="isSubmitting">
              <IconSend class="size-4" />
              {{ contactPage.form.submitLabel }}
            </Button>
          </div>
        </form>
      </section>
    </main>

    <LandingSiteFooter class="mt-auto" />
    <LandingMobileBottomNav />
  </div>
</template>
