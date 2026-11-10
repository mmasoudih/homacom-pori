<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTelegram,
  IconBrandWhatsapp,
  IconBrandX,
  IconBrandYoutube,
  IconPhone,
} from '@tabler/icons-vue'
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
import { apiErrorMessage, ApiError } from '~/composables/useApi'
import { contactPage } from '~/data/pages/contact'
import { toMailtoHref, toTelHref } from '~/utils/auth'
import { toEnglishDigits, toPersianDigits } from '~/utils/format'

useHead({
  title: 'تماس با ما | هماکام',
})

// Live contact details (`GET /shop/public/contact`); the designed copy is the
// fallback for every missing/null setting.
const { contact } = useContactPage()

// Route-driven trail (`~/utils/breadcrumbs`), not mock page copy.
const breadcrumb = useBreadcrumb()

const phone = computed(() => contact.value.tel || contact.value.mobile || contactPage.phone.number)
const mobile = computed(() => {
  const value = contact.value.mobile
  return value && value !== phone.value ? value : ''
})
const email = computed(() => contact.value.email || contactPage.email.address)
const address = computed(() => contact.value.address || contactPage.store.address)

const socialLinks = computed(() => {
  const socials = contact.value.socials
  const fromApi = [
    { key: 'instagram', label: 'اینستاگرام', href: socials.instagram, icon: IconBrandInstagram },
    { key: 'telegram', label: 'تلگرام', href: socials.telegram, icon: IconBrandTelegram },
    { key: 'twitter', label: 'ایکس', href: socials.twitter, icon: IconBrandX },
    { key: 'linkedin', label: 'لینکدین', href: socials.linkedin, icon: IconBrandLinkedin },
    { key: 'whatsapp', label: 'واتساپ', href: socials.whatsapp, icon: IconBrandWhatsapp },
  ].filter(item => !!item.href)

  if (fromApi.length) return fromApi

  // No live socials: keep the designed row as non-clickable icons.
  return [
    { key: 'instagram', label: 'اینستاگرام', href: '', icon: IconBrandInstagram },
    { key: 'youtube', label: 'یوتیوب', href: '', icon: IconBrandYoutube },
    { key: 'twitter', label: 'ایکس', href: '', icon: IconBrandX },
    { key: 'telegram', label: 'تلگرام', href: '', icon: IconBrandTelegram },
  ]
})

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const MOBILE_RE = /^09\d{9}$/

/** Persian digits, spaces and dashes are accepted; the API wants 11 ASCII digits. */
function normalizeContact(value: string): string {
  return toEnglishDigits(value).replace(/[\s-]/g, '').trim()
}

function isEmail(value: string): boolean {
  return EMAIL_RE.test(value)
}

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(3, 'نام و نام خانوادگی را وارد کنید.').max(150, 'نام حداکثر ۱۵۰ کاراکتر باشد.'),
    contact: z.string().min(5, 'شماره تماس یا ایمیل معتبر وارد کنید.'),
    subject: z.string().min(1, 'موضوع را انتخاب کنید.'),
    message: z.string().min(10, 'متن پیام حداقل ۱۰ کاراکتر باشد.').max(5000, 'متن پیام حداکثر ۵۰۰۰ کاراکتر باشد.'),
  }).refine(
    values => MOBILE_RE.test(normalizeContact(values.contact)) || isEmail(normalizeContact(values.contact)),
    { message: 'شماره موبایل ۱۱ رقمی یا ایمیل معتبر وارد کنید.', path: ['contact'] },
  ),
)

const api = useApi()

const { handleSubmit, isSubmitting, resetForm, setErrors } = useForm({
  validationSchema: formSchema,
  initialValues: { name: '', contact: '', subject: '', message: '' },
})

/** API error keys → form field names (validation map is Persian). */
const FIELD_MAP: Record<string, 'name' | 'contact' | 'subject' | 'message'> = {
  full_name: 'name',
  mobile: 'contact',
  email: 'contact',
  title: 'subject',
  message: 'message',
}

const onSubmit = handleSubmit(async (values) => {
  const contactValue = normalizeContact(values.contact)

  try {
    const res = await api.post<{ id?: number }>('/shop/contact-us', {
      full_name: values.name.trim(),
      ...(isEmail(contactValue) ? { email: contactValue } : { mobile: contactValue }),
      title: values.subject,
      message: values.message.trim(),
    }, { skipAuth: true })

    // The backend returns the Persian confirmation copy in the envelope.
    toast.success(res.message || 'پیام شما با موفقیت ثبت شد.')
    resetForm()
  }
  catch (err) {
    const fieldErrors = err instanceof ApiError ? err.data?.errors : undefined
    if (fieldErrors) {
      const mapped: Partial<Record<'name' | 'contact' | 'subject' | 'message', string>> = {}
      for (const [field, messages] of Object.entries(fieldErrors)) {
        const name = FIELD_MAP[field]
        const first = messages?.[0]
        if (name && first && !mapped[name]) mapped[name] = first
      }
      setErrors(mapped)
    }

    toast.error(apiErrorMessage(err, 'ارسال پیام انجام نشد. دوباره تلاش کنید.'))
  }
})
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-background">
    <LandingSiteHeader />

    <!--
      DEBUG: `.not-from-api` paints red everything that does NOT come from
      `GET /shop/public/contact` — that endpoint only returns tel, mobile,
      email, address, socials and the popup, so all page copy, form labels and
      local assets are mock. The breadcrumb is route-driven
      (`~/utils/breadcrumbs`), so it is not marked. Remove the class from these
      nodes to restore the design.
    -->

    <!-- Desktop-only breadcrumb (top right), same gutters as the FAQ page — route-driven -->
    <UiBreadcrumb
      :trail="breadcrumb"
      class="mx-auto hidden w-full max-w-[1440px] px-4 pt-10 lg:flex lg:px-6 lg:pt-4 lg:pb-8"
    />

    <main class="flex w-full flex-col items-center px-4 pb-16 lg:px-6">
      <!-- Page hero: title + subtitle are mock copy -->
      <div class="not-from-api flex flex-col items-center pt-10 lg:pt-0">
        <div class="flex items-center gap-3">
          <svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.25">
              <rect y="4" width="5.5" height="12" rx="2.75" fill="#EE4536" />
            </g>
            <rect x="7.5" width="5.5" height="20" rx="2.75" fill="#EE4536" />
          </svg>
          <UiTypography as="h1" size="xl3xl" weight="bold" color="default" class="lg:text-[#2C2C3B]">
            {{ contactPage.title }}
          </UiTypography>
          <svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="5.5" height="20" rx="2.75" fill="#EE4536" />
            <g opacity="0.25">
              <rect x="7.5" y="4" width="5.5" height="12" rx="2.75" fill="#EE4536" />
            </g>
          </svg>
        </div>
        <UiTypography
          as="p"
          size="mdLg"
          weight="regular"
          color="muted"
          class="mt-3 max-w-[620px] text-center leading-[26px]"
        >
          {{ contactPage.subtitle }}
        </UiTypography>
      </div>

      <div class="mt-10 flex w-full max-w-[903px] flex-col gap-5 lg:mt-12 lg:gap-3">
        <!-- Online guide: copy + rows come from `~/data/pages/contact`, links are hardcoded by index -->
        <section class="not-from-api rounded-[16px] border border-T-400 bg-T-50 p-5 lg:px-[38px] lg:py-[32px]">
          <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
            <div class="flex flex-col gap-2">
              <UiTypography as="h2" size="lgXl" weight="bold" color="default">
                {{ contactPage.guideTitle }}
              </UiTypography>
              <UiTypography
                as="p"
                size="lg"
                weight="regular"
                color="muted"
                class="whitespace-pre-line leading-[26px] lg:max-w-[760px]"
              >
                {{ contactPage.guideSubtitle }}
              </UiTypography>
            </div>
            <div class="flex w-full flex-col gap-3.5 lg:w-auto">
              <NuxtLink
                v-for="(row, i) in contactPage.guideRows"
                :key="i"
                :to="i === 0 ? '/guarantee' : '/faq'"
                class="flex h-[38px] w-full items-center justify-center gap-2 rounded-[12px] bg-T-200 px-4 transition-colors hover:bg-T-300 lg:w-[143px] lg:justify-between"
              >
                <svg
                  v-if="i === 0"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-[18px] shrink-0"
                >
                  <g clip-path="url(#clip0_754_46346)">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0.1875 9C0.1875 4.13299 4.13299 0.1875 9 0.1875C13.867 0.1875 17.8125 4.13299 17.8125 9C17.8125 13.867 13.867 17.8125 9 17.8125C4.13299 17.8125 0.1875 13.867 0.1875 9ZM8.25 5.625C8.25 5.21079 8.58579 4.875 9 4.875C9.41421 4.875 9.75008 5.21079 9.75008 5.625C9.75008 6.03921 9.41421 6.375 9 6.375C8.58579 6.375 8.25 6.03921 8.25 5.625ZM7.3125 8.25C7.3125 7.93934 7.56434 7.6875 7.875 7.6875H9C9.31067 7.6875 9.5625 7.93934 9.5625 8.25L9.56251 12.75C9.56251 13.0607 9.31067 13.3125 9.00001 13.3125C8.68935 13.3125 8.43751 13.0607 8.43751 12.75L8.4375 8.8125H7.875C7.56434 8.8125 7.3125 8.56066 7.3125 8.25Z" fill="#9CA3AF" />
                  </g>
                  <defs>
                    <clipPath id="clip0_754_46346">
                      <rect width="18" height="18" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <svg
                  v-else
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="size-[18px] shrink-0"
                >
                  <g clip-path="url(#clip0_754_46350)">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M0.1875 9C0.1875 4.13299 4.13299 0.1875 9 0.1875C13.867 0.1875 17.8125 4.13299 17.8125 9C17.8125 13.867 13.867 17.8125 9 17.8125C4.13299 17.8125 0.1875 13.867 0.1875 9ZM9 5.8125C8.27513 5.8125 7.6875 6.40013 7.6875 7.125C7.6875 7.27941 7.71393 7.42643 7.76204 7.56255C7.86557 7.85545 7.71204 8.17682 7.41914 8.28035C7.12624 8.38387 6.80487 8.23035 6.70134 7.93745C6.61127 7.6826 6.5625 7.40889 6.5625 7.125C6.5625 5.77881 7.65381 4.6875 9 4.6875C10.3462 4.6875 11.4375 5.77881 11.4375 7.125C11.4375 7.80485 11.1584 8.42055 10.71 8.86203C10.5671 9.00274 10.3799 9.1114 10.2527 9.18521L10.2045 9.21314C10.0742 9.28857 9.96512 9.35172 9.86353 9.42626C9.65832 9.57682 9.5625 9.7139 9.5625 9.9375C9.5625 10.2482 9.31066 10.5 9 10.5C8.68934 10.5 8.4375 10.2482 8.4375 9.9375C8.4375 9.2236 8.83014 8.78913 9.19801 8.51922C9.35239 8.40595 9.51627 8.31137 9.64054 8.23964L9.6847 8.21411C9.83584 8.12639 9.89566 8.08505 9.92074 8.06035C10.1632 7.82164 10.3125 7.49127 10.3125 7.125C10.3125 6.40013 9.72487 5.8125 9 5.8125ZM8.25 12.375C8.25 11.9608 8.58579 11.625 9 11.625C9.41421 11.625 9.75008 11.9608 9.75008 12.375C9.75008 12.7892 9.41421 13.125 9 13.125C8.58579 13.125 8.25 12.7892 8.25 12.375Z" fill="#9CA3AF" />
                  </g>
                  <defs>
                    <clipPath id="clip0_754_46350">
                      <rect width="18" height="18" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <UiTypography as="span" size="lg" weight="medium" color="default" class="whitespace-nowrap">
                  {{ row.title }}
                </UiTypography>
              </NuxtLink>
            </div>
          </div>
        </section>

        <!-- Phone & socials -->
        <section class="flex flex-col gap-3 rounded-[16px] border border-T-400 bg-T-50 p-5 lg:flex-row lg:items-center lg:justify-between lg:px-[38px] lg:py-[32px]">
          <div class="not-from-api flex flex-col gap-3">
            <UiTypography as="h2" size="lgXl" weight="bold" color="default">
              {{ contactPage.phone.title }}
            </UiTypography>
            <p class="text-[14px] leading-[22px] text-T-700">
              <span
                v-for="(segment, si) in contactPage.phone.subtitle"
                :key="si"
                :class="segment.bold ? 'font-bold text-T-900' : ''"
              >{{ segment.text }}</span>
              <br>
              {{ contactPage.phone.note }}
            </p>
          </div>
          <div class="flex flex-col gap-3">
            <a
              :href="toTelHref(phone)"
              class="inline-flex w-full items-center justify-center gap-2 rounded-[12px] bg-T-200 px-5 py-2 transition-colors hover:bg-T-300 lg:w-[182px]"
              dir="ltr"
            >
              <IconPhone class="size-[18px] shrink-0" />
              <UiTypography as="span" size="lg" weight="medium" color="default">
                {{ toPersianDigits(phone) }}
              </UiTypography>
            </a>

            <a
              v-if="mobile"
              :href="toTelHref(mobile)"
              class="inline-flex w-full items-center justify-center gap-2 rounded-[12px] bg-T-200 px-5 py-2 transition-colors hover:bg-T-300 lg:w-[182px]"
              dir="ltr"
            >
              <IconPhone class="size-[18px] shrink-0" />
              <UiTypography as="span" size="lg" weight="medium" color="default">
                {{ toPersianDigits(mobile) }}
              </UiTypography>
            </a>

            <!-- Socials: the API returns no social URLs, so this is the designed (non-clickable) row -->
            <div class="not-from-api flex w-full items-center justify-center gap-2 rounded-[12px] p-2 text-T-900 lg:w-[182px] lg:justify-between lg:p-0">
              <component
                :is="social.href ? 'a' : 'span'"
                v-for="social in socialLinks"
                :key="social.key"
                :href="social.href || undefined"
                :target="social.href ? '_blank' : undefined"
                :rel="social.href ? 'noopener noreferrer' : undefined"
                :aria-label="social.label"
                :title="social.label"
                class="flex h-[38px] w-10 items-center justify-center rounded-[12px] bg-T-200 text-T-900 transition-colors hover:text-primary"
              >
                <component :is="social.icon" class="size-5" />
              </component>
            </div>
          </div>
        </section>

        <!-- Email -->
        <section class="flex flex-col gap-3 rounded-[16px] border border-T-400 bg-T-50 p-5 lg:flex-row lg:items-center lg:justify-between lg:px-[38px] lg:py-[32px]">
          <div class="not-from-api flex flex-col gap-3">
            <UiTypography as="h2" size="lgXl" weight="bold" color="default">{{ contactPage.email.title }}</UiTypography>
            <p class="max-w-[435px] text-[14px] leading-[22px] text-T-700">
              <span
                v-for="(segment, si) in contactPage.email.subtitle"
                :key="si"
                :class="segment.bold ? 'font-bold text-T-900' : ''"
              >{{ segment.text }}</span>
            </p>
          </div>
          <a
            :href="toMailtoHref(email)"
            class="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[12px] bg-T-200 px-5 py-2.5 transition-colors hover:bg-T-300 lg:mt-0 lg:w-fit"
            dir="ltr"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-[18px] shrink-0">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0.698346 8.24662C0.714816 8.15901 0.734976 8.07374 0.759651 7.98957C0.878856 7.58294 1.0745 7.20277 1.3361 6.86942C1.63238 6.49188 2.034 6.2052 2.62724 5.78173L8.17179 1.82128C8.64519 1.48247 9.01635 1.21684 9.43729 1.11021C9.80662 1.01665 10.1935 1.01665 10.5628 1.11021C10.9837 1.21684 11.3549 1.48247 11.8283 1.82128L17.3728 5.78173C17.9661 6.2052 18.3677 6.49188 18.664 6.86942C18.9256 7.20277 19.1212 7.58294 19.2404 7.98957C19.2651 8.07374 19.2853 8.159 19.3017 8.24659C19.3032 8.25328 19.3045 8.26 19.3057 8.26675C19.3306 8.40348 19.3465 8.54755 19.3567 8.70333C19.3753 8.98214 19.3752 9.29586 19.3751 9.67242L19.375 14.0272C19.375 14.2459 19.375 14.4518 19.374 14.6456C19.3737 14.6962 19.3734 14.746 19.373 14.795C19.3711 15.0082 19.3676 15.2062 19.3609 15.3903C19.3552 15.5466 19.3473 15.6929 19.3361 15.8299C19.3338 15.8573 19.3315 15.8843 19.329 15.911C19.3202 16.0049 19.3096 16.0966 19.2966 16.186C19.2467 16.5309 19.1618 16.844 19.0117 17.1387C18.6921 17.7659 18.1822 18.2758 17.555 18.5954C17.1625 18.7954 16.7367 18.8797 16.2464 18.9197C15.7693 18.9587 15.1793 18.9587 14.4438 18.9587H5.55642C4.82095 18.9587 4.23077 18.9587 3.75365 18.9197C3.26337 18.8797 2.83753 18.7954 2.44507 18.5954C1.81786 18.2758 1.30792 17.7659 0.988347 17.1387C0.788376 16.7462 0.704067 16.3204 0.66401 15.8301C0.625025 15.3529 0.62503 14.7629 0.625035 14.0273L0.625018 9.67243C0.624895 9.269 0.624793 8.9377 0.647619 8.64419C0.657859 8.51022 0.67273 8.38544 0.694321 8.26684C0.695555 8.26006 0.696897 8.25332 0.698346 8.24662ZM9.74424 2.32193C9.91212 2.27941 10.088 2.27941 10.2558 2.32193C10.4183 2.3631 10.586 2.47018 11.1867 2.89924L16.5721 6.74595C17.2671 7.24235 17.509 7.42246 17.6806 7.64112C17.8004 7.79382 17.8981 7.96223 17.9711 8.14135L11.2373 13.2718C10.6135 13.7472 10.4382 13.8662 10.2682 13.9116C10.0925 13.9584 9.90752 13.9584 9.73177 13.9116C9.56174 13.8662 9.38653 13.7472 8.76266 13.2718L2.02895 8.14141C2.10192 7.96226 2.19961 7.79383 2.31945 7.64112C2.49105 7.42246 2.73298 7.24235 3.42794 6.74595L8.81334 2.89924C9.41402 2.47018 9.58175 2.3631 9.74424 2.32193ZM1.8751 9.63134C1.87511 9.61934 1.87512 9.60746 1.87514 9.59569L8.09377 14.3338C8.5845 14.7084 8.96889 15.0019 9.4099 15.1194C9.79655 15.2224 10.2034 15.2224 10.5901 15.1194C11.0311 15.0019 11.4155 14.7084 11.9062 14.3338L18.1249 9.59562C18.125 9.61076 18.125 9.6261 18.125 9.64164V14.2288C18.1249 14.4183 18.1245 14.5928 18.1232 14.7543C18.1212 15.0101 18.117 15.2327 18.1084 15.4298C18.1038 15.5359 18.0978 15.6349 18.0902 15.7281C18.0565 16.1411 17.9932 16.3841 17.898 16.571C17.6982 16.963 17.3795 17.2817 16.9875 17.4815C16.8006 17.5767 16.5576 17.64 16.1446 17.6737C15.7244 17.708 15.1854 17.7085 14.4167 17.7085H5.58337C4.81465 17.7085 4.2757 17.708 3.85544 17.6737C3.44247 17.64 3.19944 17.5767 3.01256 17.4815C2.62055 17.2817 2.30184 16.963 2.10211 16.571C2.00689 16.3841 1.9436 16.1411 1.90986 15.7281C1.90557 15.6756 1.9018 15.6212 1.8985 15.5648C1.87541 15.1696 1.87504 14.6729 1.87504 14.0004C1.87504 14.0003 1.87504 14.0004 1.87504 14.0004V9.76355C1.87504 9.7631 1.87504 9.76266 1.87504 9.76221C1.87504 9.71707 1.87505 9.67347 1.8751 9.63134Z" fill="#1D1D1F" />
            </svg>
            <UiTypography as="span" size="lg" weight="regular" color="default">
              {{ email }}
            </UiTypography>
          </a>
        </section>

        <!-- Map + address: the address is API, the map art, section title and the
             "نمایش در نقشه" link (href="#") are not -->
        <section class="flex flex-col overflow-hidden rounded-[16px] border border-T-400 bg-T-50">
          <PagesMapPlaceholder class="not-from-api not-from-api--covered h-[141px] w-full rounded-none border-0" />
          <div class="flex flex-col gap-2 p-5 lg:px-[38px] lg:py-[32px]">
            <UiTypography as="h2" size="lgXl" weight="bold" color="default" class="not-from-api">
              {{ contactPage.store.title }}
            </UiTypography>
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <UiTypography as="p" size="lg" weight="regular" color="muted" class="leading-[24px]">
                {{ address }}
              </UiTypography>
              <a
                href="#"
                class="not-from-api inline-flex h-[38px] w-full items-center justify-center gap-2 rounded-[12px] bg-T-200 px-5 transition-colors hover:bg-T-300 lg:w-fit"
              >
                <UiTypography as="span" size="lg" weight="medium" color="default">
                  نمایش در نقشه
                </UiTypography>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-[18px] shrink-0">
                  <path d="M9.99937 7.0114C10.8048 7.0114 11.4577 6.35847 11.4577 5.55304C11.4577 4.74761 10.8048 4.09469 9.99937 4.09469C9.19394 4.09469 8.54102 4.74761 8.54102 5.55304C8.54102 6.35847 9.19394 7.0114 9.99937 7.0114Z" fill="#1D1D1F" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M5.48544 5.55493C5.48544 3.06234 7.50601 1.03906 9.99939 1.03906C12.4924 1.03906 14.5132 3.05998 14.5132 5.55295C14.5132 8.31684 12.3188 10.428 10.3743 11.8863C10.1521 12.053 9.84655 12.053 9.62433 11.8863C7.68001 10.428 5.48544 8.31691 5.48544 5.55493ZM9.99939 2.28906C8.19716 2.28906 6.73544 3.7519 6.73544 5.55493C6.73544 7.51414 8.21701 9.1958 9.99933 10.5983C11.7816 9.19587 13.2632 7.51407 13.2632 5.55295C13.2632 3.75031 11.802 2.28906 9.99939 2.28906Z" fill="#1D1D1F" />
                  <path d="M17.1151 5.21228C17.9478 4.76386 18.9577 5.36703 18.9577 6.31287V14.8199C18.9577 15.5096 18.579 16.1437 17.9716 16.4707L13.7212 18.7594C13.2148 19.0321 12.6035 19.0244 12.1041 18.7391L7.27439 15.9792C7.14955 15.9079 6.99674 15.9059 6.87013 15.9741L2.88364 18.1207C2.05085 18.5691 1.04102 17.9659 1.04102 17.0201V8.5131C1.04102 7.82332 1.41975 7.18924 2.02708 6.86222L3.79239 5.91167C4.0963 5.74802 4.47534 5.86173 4.63899 6.16565C4.80264 6.46957 4.68893 6.84861 4.38501 7.01226L2.6197 7.96281C2.41726 8.07182 2.29102 8.28318 2.29102 8.5131L2.29102 17.0201L6.2775 14.8735C6.33627 14.8419 6.39644 14.814 6.45768 14.7899V11.6623C6.45768 11.3172 6.7375 11.0373 7.08268 11.0373C7.42786 11.0373 7.70768 11.3172 7.70768 11.6623V14.8021C7.77137 14.8286 7.8338 14.8592 7.89457 14.8939L12.291 17.4062V11.6622C12.291 11.317 12.5708 11.0372 12.916 11.0372C13.2612 11.0372 13.541 11.317 13.541 11.6622V17.4368L17.379 15.3702C17.5814 15.2612 17.7077 15.0498 17.7077 14.8199L17.7077 6.31287L16.1886 7.13081C15.8847 7.29446 15.5057 7.18075 15.342 6.87683C15.1784 6.57291 15.2921 6.19387 15.596 6.03022L17.1151 5.21228Z" fill="#1D1D1F" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </div>

      <!-- Message form: the submit goes to `POST /shop/contact-us`, but every
           label, placeholder and option below is mock copy -->
      <section class="mt-5 w-full max-w-[903px] rounded-[16px] border border-T-400 bg-T-50 p-5 lg:mt-3 lg:p-8">
        <UiTypography as="h2" size="lg" weight="bold" color="default" class="not-from-api">{{ contactPage.form.title }}</UiTypography>
        <UiTypography as="p" size="md" weight="regular" color="muted" class="not-from-api mt-2 leading-[22px]">
          {{ contactPage.form.subtitle }}
        </UiTypography>

        <form class="mt-6 flex flex-col gap-5" novalidate @submit="onSubmit">
          <div class="grid gap-5 lg:grid-cols-3">
            <FieldGroup>
              <VeeField v-slot="{ componentField, errors }" name="name">
                <Field :data-invalid="!!errors.length" class="gap-2">
                  <FieldLabel for="contact-name">
                    <UiTypography as="span" size="lg" weight="regular" color="default" class="not-from-api">
                      {{ contactPage.form.nameLabel }}
                    </UiTypography>
                  </FieldLabel>
                  <Input
                    id="contact-name"
                    v-bind="componentField"
                    type="text"
                    placeholder="مثال: علی رضایی"
                    class="not-from-api h-[50px] rounded-[12px]"
                    :aria-invalid="!!errors.length"
                  />
                  <FieldError v-if="errors.length" :errors="errors" />
                </Field>
              </VeeField>
            </FieldGroup>

            <FieldGroup>
              <VeeField v-slot="{ componentField, errors }" name="contact">
                <Field :data-invalid="!!errors.length" class="gap-2">
                  <FieldLabel for="contact-phone">
                    <UiTypography as="span" size="lg" weight="regular" color="default" class="not-from-api">
                      {{ contactPage.form.contactLabel }}
                    </UiTypography>
                  </FieldLabel>
                  <Input
                    id="contact-phone"
                    v-bind="componentField"
                    type="text"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹ یا email@example.com"
                    class="not-from-api h-[50px] rounded-[12px]"
                    :aria-invalid="!!errors.length"
                  />
                  <FieldError v-if="errors.length" :errors="errors" />
                </Field>
              </VeeField>
            </FieldGroup>

            <FieldGroup>
              <VeeField v-slot="{ componentField, errors }" name="subject">
                <Field :data-invalid="!!errors.length" class="gap-2">
                  <FieldLabel for="contact-subject">
                    <UiTypography as="span" size="lg" weight="regular" color="default" class="not-from-api">
                      {{ contactPage.form.subjectLabel }}
                    </UiTypography>
                  </FieldLabel>
                  <select
                    id="contact-subject"
                    v-bind="componentField"
                    class="not-from-api flex h-[50px] w-full items-center rounded-[12px] border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
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
          </div>

          <FieldGroup>
            <VeeField v-slot="{ componentField, errors }" name="message">
              <Field :data-invalid="!!errors.length" class="gap-2">
                <FieldLabel for="contact-message">
                  <UiTypography as="span" size="lg" weight="regular" color="default" class="not-from-api">
                    {{ contactPage.form.messageLabel }}
                  </UiTypography>
                </FieldLabel>
                <Textarea
                  id="contact-message"
                  v-bind="componentField"
                  :placeholder="contactPage.form.messagePlaceholder"
                  class="not-from-api min-h-[140px] rounded-[12px]"
                  :aria-invalid="!!errors.length"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>
          </FieldGroup>

          <div class="flex justify-start">
            <Button type="submit" class="not-from-api--warn h-[45px] w-full rounded-[12px] lg:w-[145px]" :disabled="isSubmitting">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-[18px] shrink-0">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M18.8006 4.70082C19.5524 2.53758 17.4878 0.435219 15.3162 1.20071L2.86998 5.58813C0.481304 6.43016 0.41644 9.80202 2.76925 10.7374L2.78243 10.7425L6.91009 12.2765C7.29519 12.4315 7.59961 12.743 7.74752 13.1367L9.35103 17.1869C10.2564 19.583 13.6447 19.5378 14.486 17.1168L18.8006 4.70082ZM15.7318 2.37961C16.8946 1.96971 18.0352 3.09548 17.6199 4.29051L13.3052 16.7065C12.847 18.0252 11.0098 18.0477 10.5192 16.7418L8.91569 12.6916C8.85132 12.5213 8.7708 12.3593 8.67594 12.2073L11.6913 9.19194C11.9354 8.94786 11.9354 8.55214 11.6913 8.30806C11.4472 8.06398 11.0515 8.06398 10.8074 8.30806L7.78995 11.3255C7.656 11.2429 7.51425 11.1715 7.36589 11.1125L7.35271 11.1074L3.225 9.57344C1.95069 9.06097 1.98946 7.22391 3.28555 6.76703L15.7318 2.37961Z" fill="white" />
              </svg>
              <UiTypography as="span" size="lg" weight="bold" color="inherit">
                {{ contactPage.form.submitLabel }}
              </UiTypography>
            </Button>
          </div>
        </form>
      </section>
    </main>

    <!-- CEO block: copy comes from `~/data/landing`, not from this endpoint -->
    <LandingCeoSection class="not-from-api" />

    <!-- Floating support widget (gated by contact_popup_status) -->
    <PagesContactSupportWidget
      :entries="contact.popup"
      :enabled="contact.popupEnabled"
    />

    <LandingSiteFooter class="mt-auto" />
    <LandingMobileBottomNav />
  </div>
</template>

<style scoped>
/**
 * DEBUG marker: red = this piece does NOT come from `GET /shop/public/contact`
 * (mock copy, a hardcoded label/placeholder or a locally drawn asset).
 * Amber = hardcoded copy or a dead control sitting on the brand red surface,
 * where a red tint would be invisible.
 * `grep -n "not-from-api"` lists every marked node; delete the classes and this
 * block to restore the normal design.
 */
.not-from-api {
  background-color: rgb(239 68 68 / 0.35);
  outline: 1px solid #ef4444;
  outline-offset: 1px;
}

.not-from-api--warn {
  background-color: rgb(245 158 11 / 0.35);
  outline: 2px dashed #f59e0b;
  outline-offset: 1px;
}

/**
 * Some marks are covered by their own artwork (the map placeholder is a
 * full-bleed SVG and its parent section clips the outline), so the tint is
 * drawn as an overlay instead of a background.
 */
.not-from-api--covered {
  position: relative;
}

.not-from-api--covered::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: rgb(239 68 68 / 0.35);
  outline: 1px solid #ef4444;
  pointer-events: none;
}
</style>
