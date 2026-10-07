<script setup lang="ts">
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
import { toPersianDigits } from '~/utils/format'

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
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-background">
    <LandingSiteHeader />

    <!-- Desktop-only breadcrumb (top right), same gutters as the FAQ page -->
    <UiBreadcrumb
      :trail="['همکام', 'تماس با ما']"
      class="mx-auto hidden w-full max-w-[1440px] px-4 pt-10 lg:flex lg:px-6 lg:pt-4 lg:pb-8"
    />

    <main class="flex w-full flex-col items-center px-4 pb-16 lg:px-6">
      <!-- Page hero -->
      <div class="flex flex-col items-center pt-10 lg:pt-0">
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
        <!-- Online guide -->
        <section class="rounded-[16px] border border-T-400 bg-T-50 p-5 lg:px-[38px] lg:py-[32px]">
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
          <div class="flex flex-col gap-3">
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
              href="tel:01213250789"
              class="inline-flex w-full items-center justify-center gap-2 rounded-[12px] bg-T-200 px-5 py-2 transition-colors hover:bg-T-300 lg:w-[182px]"
              dir="ltr"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-[18px] shrink-0">
                <path d="M10.8334 1.04199C10.4882 1.04199 10.2084 1.32181 10.2084 1.66699C10.2084 2.01217 10.4882 2.29199 10.8334 2.29199C12.6567 2.29199 14.4054 3.01632 15.6947 4.30563C16.984 5.59495 17.7084 7.34363 17.7084 9.16699C17.7084 9.51217 17.9882 9.79199 18.3334 9.79199C18.6786 9.79199 18.9584 9.51217 18.9584 9.16699C18.9584 7.01211 18.1023 4.94548 16.5786 3.42175C15.0549 1.89802 12.9883 1.04199 10.8334 1.04199Z" fill="#1D1D1F" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.76885 1.20488C4.28271 0.943393 4.90239 1.00921 5.34987 1.37279C5.49362 1.48959 5.61433 1.65226 5.73069 1.80907L5.76179 1.85092L8.5424 5.58327C8.59447 5.65314 8.65214 5.73051 8.6975 5.80208C8.74966 5.8844 8.81005 5.9957 8.84157 6.13762C8.88419 6.32949 8.87165 6.5295 8.80541 6.71454C8.75641 6.85142 8.6826 6.9543 8.62057 7.02947C8.56663 7.09483 8.49974 7.1644 8.43934 7.22723L7.03224 8.69152C7.56831 9.70809 8.11171 10.4804 8.77118 11.1399C9.43036 11.7991 10.2262 12.3662 11.2909 12.9499L12.6281 11.5133C12.6909 11.4458 12.7599 11.3716 12.8252 11.3115C12.8999 11.2429 13.0037 11.1598 13.1452 11.1031C13.3354 11.0267 13.5439 11.0082 13.7447 11.0498C13.8939 11.0808 14.0108 11.1442 14.0964 11.1986C14.1712 11.2462 14.2523 11.3071 14.326 11.3624L18.1567 14.2386L18.1985 14.2699C18.355 14.3869 18.5174 14.5084 18.6338 14.6529C18.994 15.1 19.0583 15.7168 18.7982 16.2286C18.7141 16.394 18.5803 16.5463 18.4513 16.6932L18.4169 16.7324L17.9376 17.28C17.8993 17.3238 17.8757 17.3508 17.8531 17.3759C16.6586 18.7025 14.8256 19.2552 13.0969 18.8099C13.064 18.8014 13.0213 18.7897 12.9501 18.7703L12.9068 18.7585C11.4651 18.3644 10.0961 17.7413 8.85208 16.913L8.81272 16.8868C6.55679 15.3804 4.62017 13.4438 3.11377 11.1878L3.08753 11.1485C2.25926 9.90441 1.63616 8.53541 1.24203 7.09375L1.23019 7.05035C1.2108 6.97925 1.19915 6.93652 1.19068 6.90365C0.745369 5.1749 1.298 3.34194 2.62466 2.14743C2.64987 2.12473 2.67689 2.10108 2.72097 2.06251L3.26569 1.58582L3.30488 1.55144C3.45158 1.42257 3.60377 1.28888 3.76885 1.20488ZM4.33786 2.31788C4.33449 2.32003 4.32093 2.32902 4.29191 2.35231C4.24603 2.38915 4.187 2.44063 4.08888 2.5265L3.54813 2.99971C3.49886 3.04282 3.47889 3.06032 3.46106 3.07637C2.48049 3.95927 2.07202 5.31407 2.40117 6.59184C2.40712 6.61493 2.4162 6.64831 2.4381 6.72861L2.44779 6.76412C2.80662 8.07667 3.37392 9.32308 4.12802 10.4557L4.15332 10.4937C5.56842 12.6129 7.38766 14.4321 9.50687 15.8472L9.54482 15.8725C10.6775 16.6266 11.9239 17.1939 13.2364 17.5528L13.2719 17.5624C13.3522 17.5843 13.3856 17.5934 13.4087 17.5994C14.6865 17.9285 16.0413 17.5201 16.9242 16.5395C16.9402 16.5217 16.9577 16.5017 17.0008 16.4524L17.4762 15.9092C17.5621 15.811 17.6136 15.7519 17.6505 15.706C17.6738 15.677 17.6828 15.6634 17.6849 15.6601C17.7205 15.5881 17.7115 15.502 17.6618 15.4389C17.6591 15.4361 17.6475 15.4246 17.6187 15.401C17.5731 15.3637 17.5105 15.3166 17.4062 15.2382L13.558 12.3489L11.8785 14.1533C11.6871 14.3589 11.3821 14.4116 11.1329 14.2821C9.78673 13.5828 8.75115 12.8876 7.88729 12.0238C7.02198 11.1584 6.3552 10.1502 5.71326 8.85754C5.59592 8.62125 5.63959 8.33673 5.82238 8.1465L7.55215 6.3464L4.75939 2.59771C4.68149 2.49315 4.63459 2.43042 4.59747 2.38476C4.57399 2.35589 4.56262 2.34426 4.55978 2.34145C4.49661 2.2913 4.41015 2.28211 4.33786 2.31788Z" fill="#1D1D1F" />
                <path d="M10.5904 4.93583C10.5904 4.59065 10.8702 4.31083 11.2154 4.31083C12.3757 4.31083 13.4885 4.77177 14.3089 5.59224C15.1294 6.41271 15.5904 7.52551 15.5904 8.68583C15.5904 9.03101 15.3105 9.31083 14.9654 9.31083C14.6202 9.31083 14.3404 9.03101 14.3404 8.68583C14.3404 7.85703 14.0111 7.06217 13.4251 6.47612C12.839 5.89007 12.0442 5.56083 11.2154 5.56083C10.8702 5.56083 10.5904 5.28101 10.5904 4.93583Z" fill="#1D1D1F" />
              </svg>
              <UiTypography as="span" size="lg" weight="medium" color="default">
                {{ toPersianDigits(contactPage.phone.number) }}
              </UiTypography>
            </a>
            <div class="flex w-full items-center justify-center gap-2 rounded-[12px] p-2 text-T-900 lg:w-[182px] lg:justify-between lg:p-0">
              <!-- Instagram -->
              <span class="flex h-[38px] w-10 items-center justify-center rounded-[12px] bg-T-200 text-T-900 transition-colors hover:text-primary">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.375 5C14.375 4.65483 14.6548 4.375 15 4.375H15.0083C15.3535 4.375 15.6333 4.65483 15.6333 5C15.6333 5.34517 15.3535 5.625 15.0083 5.625H15C14.6548 5.625 14.375 5.34517 14.375 5Z" fill="#1D1D1F" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M9.99935 6.04199C7.81322 6.04199 6.04102 7.8142 6.04102 10.0003C6.04102 12.1865 7.81322 13.9587 9.99935 13.9587C12.1855 13.9587 13.9577 12.1865 13.9577 10.0003C13.9577 7.8142 12.1855 6.04199 9.99935 6.04199ZM7.29102 10.0003C7.29102 8.50458 8.5036 7.29199 9.99935 7.29199C11.4951 7.29199 12.7077 8.50458 12.7077 10.0003C12.7077 11.4961 11.4951 12.7087 9.99935 12.7087C8.5036 12.7087 7.29102 11.4961 7.29102 10.0003Z" fill="#1D1D1F" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M1.04102 5.41699C1.04102 3.00075 2.99977 1.04199 5.41602 1.04199H14.5827C16.9989 1.04199 18.9577 3.00075 18.9577 5.41699V14.5837C18.9577 16.9999 16.9989 18.9587 14.5827 18.9587H5.41602C2.99977 18.9587 1.04102 16.9999 1.04102 14.5837V5.41699ZM5.41602 2.29199C3.69012 2.29199 2.29102 3.6911 2.29102 5.41699V14.5837C2.29102 16.3096 3.69012 17.7087 5.41602 17.7087H14.5827C16.3086 17.7087 17.7077 16.3096 17.7077 14.5837V5.41699C17.7077 3.6911 16.3086 2.29199 14.5827 2.29199H5.41602Z" fill="#1D1D1F" />
                </svg>
              </span>
              <!-- YouTube -->
              <span class="flex h-[38px] w-10 items-center justify-center rounded-[12px] bg-T-200 text-T-900 transition-colors hover:text-primary">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_754_46368)">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M9.06177 7.19432C8.3631 6.84499 7.54102 7.35304 7.54102 8.13419V11.8659C7.54102 12.6471 8.3631 13.1551 9.06177 12.8058L12.7935 10.9399C13.568 10.5527 13.568 9.44743 12.7935 9.06018L9.06177 7.19432ZM11.8781 10.0001L8.79102 11.5436V8.45651L11.8781 10.0001Z" fill="#1D1D1F" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.8102 3.01401C11.2749 2.80913 8.72723 2.80913 6.19196 3.01401L4.42595 3.15672L3.20081 3.35472C2.00975 3.54722 1.07693 4.48273 0.887873 5.67433C0.433209 8.54011 0.433209 11.4597 0.887873 14.3254C1.07693 15.5171 2.00975 16.4526 3.20081 16.6451L4.42595 16.8431L6.19196 16.9858C8.72723 17.1907 11.2749 17.1907 13.8102 16.9858L15.5762 16.8431L16.8014 16.6451C17.9924 16.4526 18.9252 15.5171 19.1143 14.3254C19.569 11.4597 19.569 8.54011 19.1143 5.67433C18.9252 4.48273 17.9924 3.54722 16.8014 3.35472L15.5762 3.15672L13.8102 3.01401ZM6.29265 4.25995C8.7609 4.06049 11.2412 4.06049 13.7096 4.25995L15.426 4.39865L16.602 4.58871C17.26 4.69505 17.7753 5.21189 17.8797 5.87021C18.3138 8.60619 18.3138 11.3936 17.8797 14.1296C17.7753 14.7879 17.26 15.3048 16.602 15.4111L15.426 15.6012L13.7096 15.7399C11.2412 15.9394 8.7609 15.9394 6.29265 15.7399L4.57624 15.6012L3.40024 15.4111C2.74223 15.3048 2.22688 14.7879 2.12244 14.1296C1.68836 11.3936 1.68836 8.60619 2.12244 5.87021C2.22688 5.21189 2.74223 4.69505 3.40024 4.58871L4.57624 4.39865L6.29265 4.25995Z" fill="#1D1D1F" />
                  </g>
                  <defs>
                    <clipPath id="clip0_754_46368">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
              <!-- X -->
              <span class="flex h-[38px] w-10 items-center justify-center rounded-[12px] bg-T-200 text-T-900 transition-colors hover:text-primary">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M16.2122 2.90466C16.4487 2.6533 16.8443 2.64131 17.0957 2.87788C17.3471 3.11446 17.359 3.51001 17.1225 3.76137L11.8652 9.34718L17.5875 17.1294C17.7272 17.3193 17.7481 17.5715 17.6417 17.7818C17.5353 17.9921 17.3197 18.1247 17.084 18.1247H13.7507C13.5518 18.1247 13.3649 18.0301 13.2472 17.8699L9.1229 12.2609L3.78911 17.928C3.55254 18.1794 3.15699 18.1913 2.90564 17.9548C2.65428 17.7183 2.64229 17.3227 2.87886 17.0713L8.36999 11.237L2.83046 3.70325C2.69085 3.51339 2.66992 3.26114 2.77631 3.05085C2.88269 2.84057 3.09833 2.70801 3.33399 2.70801H6.66733C6.86614 2.70801 7.05309 2.80259 7.17086 2.96277L11.1124 8.32323L16.2122 2.90466ZM14.0669 16.8747L4.56932 3.95801H6.35112L15.8487 16.8747H14.0669Z" fill="#1D1D1F" />
                </svg>
              </span>
              <!-- Telegram -->
              <span class="flex h-[38px] w-10 items-center justify-center rounded-[12px] bg-T-200 text-T-900 transition-colors hover:text-primary">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M16.947 4.22072C17.0237 3.73502 16.5353 3.35507 16.0834 3.54877L2.59894 9.32787C2.4254 9.4022 2.43237 9.65062 2.60981 9.71512L5.21418 10.6621C5.53858 10.7801 5.70592 11.1387 5.58797 11.4631C5.47 11.7875 5.1114 11.9549 4.78701 11.8369L2.18263 10.8899C0.94054 10.4382 0.89174 8.69953 2.10654 8.1789L15.591 2.39984C16.9468 1.81876 18.4117 2.95858 18.1817 4.41567L16.3649 15.9216C16.1423 17.3316 14.4885 17.9856 13.3617 17.1092L8.65124 13.4455C7.76101 12.7531 7.67908 11.4371 8.47657 10.6397L11.2253 7.89092C11.4694 7.64683 11.8652 7.64683 12.1092 7.89092C12.3532 8.13499 12.3532 8.5307 12.1092 8.77478L9.36049 11.5235C9.09466 11.7894 9.12191 12.228 9.41866 12.4589L14.1292 16.1225C14.5047 16.4147 15.056 16.1967 15.1302 15.7267L16.947 4.22072Z" fill="#1D1D1F" />
                </svg>
              </span>
            </div>
          </div>
        </section>

        <!-- Email -->
        <section class="flex flex-col gap-3 rounded-[16px] border border-T-400 bg-T-50 p-5 lg:flex-row lg:items-center lg:justify-between lg:px-[38px] lg:py-[32px]">
          <div class="flex flex-col gap-3">
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
            href="mailto:Homacom@info.mail"
            class="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[12px] bg-T-200 px-5 py-2.5 transition-colors hover:bg-T-300 lg:mt-0 lg:w-fit"
            dir="ltr"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="size-[18px] shrink-0">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0.698346 8.24662C0.714816 8.15901 0.734976 8.07374 0.759651 7.98957C0.878856 7.58294 1.0745 7.20277 1.3361 6.86942C1.63238 6.49188 2.034 6.2052 2.62724 5.78173L8.17179 1.82128C8.64519 1.48247 9.01635 1.21684 9.43729 1.11021C9.80662 1.01665 10.1935 1.01665 10.5628 1.11021C10.9837 1.21684 11.3549 1.48247 11.8283 1.82128L17.3728 5.78173C17.9661 6.2052 18.3677 6.49188 18.664 6.86942C18.9256 7.20277 19.1212 7.58294 19.2404 7.98957C19.2651 8.07374 19.2853 8.159 19.3017 8.24659C19.3032 8.25328 19.3045 8.26 19.3057 8.26675C19.3306 8.40348 19.3465 8.54755 19.3567 8.70333C19.3753 8.98214 19.3752 9.29586 19.3751 9.67242L19.375 14.0272C19.375 14.2459 19.375 14.4518 19.374 14.6456C19.3737 14.6962 19.3734 14.746 19.373 14.795C19.3711 15.0082 19.3676 15.2062 19.3609 15.3903C19.3552 15.5466 19.3473 15.6929 19.3361 15.8299C19.3338 15.8573 19.3315 15.8843 19.329 15.911C19.3202 16.0049 19.3096 16.0966 19.2966 16.186C19.2467 16.5309 19.1618 16.844 19.0117 17.1387C18.6921 17.7659 18.1822 18.2758 17.555 18.5954C17.1625 18.7954 16.7367 18.8797 16.2464 18.9197C15.7693 18.9587 15.1793 18.9587 14.4438 18.9587H5.55642C4.82095 18.9587 4.23077 18.9587 3.75365 18.9197C3.26337 18.8797 2.83753 18.7954 2.44507 18.5954C1.81786 18.2758 1.30792 17.7659 0.988347 17.1387C0.788376 16.7462 0.704067 16.3204 0.66401 15.8301C0.625025 15.3529 0.62503 14.7629 0.625035 14.0273L0.625018 9.67243C0.624895 9.269 0.624793 8.9377 0.647619 8.64419C0.657859 8.51022 0.67273 8.38544 0.694321 8.26684C0.695555 8.26006 0.696897 8.25332 0.698346 8.24662ZM9.74424 2.32193C9.91212 2.27941 10.088 2.27941 10.2558 2.32193C10.4183 2.3631 10.586 2.47018 11.1867 2.89924L16.5721 6.74595C17.2671 7.24235 17.509 7.42246 17.6806 7.64112C17.8004 7.79382 17.8981 7.96223 17.9711 8.14135L11.2373 13.2718C10.6135 13.7472 10.4382 13.8662 10.2682 13.9116C10.0925 13.9584 9.90752 13.9584 9.73177 13.9116C9.56174 13.8662 9.38653 13.7472 8.76266 13.2718L2.02895 8.14141C2.10192 7.96226 2.19961 7.79383 2.31945 7.64112C2.49105 7.42246 2.73298 7.24235 3.42794 6.74595L8.81334 2.89924C9.41402 2.47018 9.58175 2.3631 9.74424 2.32193ZM1.8751 9.63134C1.87511 9.61934 1.87512 9.60746 1.87514 9.59569L8.09377 14.3338C8.5845 14.7084 8.96889 15.0019 9.4099 15.1194C9.79655 15.2224 10.2034 15.2224 10.5901 15.1194C11.0311 15.0019 11.4155 14.7084 11.9062 14.3338L18.1249 9.59562C18.125 9.61076 18.125 9.6261 18.125 9.64164V14.2288C18.1249 14.4183 18.1245 14.5928 18.1232 14.7543C18.1212 15.0101 18.117 15.2327 18.1084 15.4298C18.1038 15.5359 18.0978 15.6349 18.0902 15.7281C18.0565 16.1411 17.9932 16.3841 17.898 16.571C17.6982 16.963 17.3795 17.2817 16.9875 17.4815C16.8006 17.5767 16.5576 17.64 16.1446 17.6737C15.7244 17.708 15.1854 17.7085 14.4167 17.7085H5.58337C4.81465 17.7085 4.2757 17.708 3.85544 17.6737C3.44247 17.64 3.19944 17.5767 3.01256 17.4815C2.62055 17.2817 2.30184 16.963 2.10211 16.571C2.00689 16.3841 1.9436 16.1411 1.90986 15.7281C1.90557 15.6756 1.9018 15.6212 1.8985 15.5648C1.87541 15.1696 1.87504 14.6729 1.87504 14.0004C1.87504 14.0003 1.87504 14.0004 1.87504 14.0004V9.76355C1.87504 9.7631 1.87504 9.76266 1.87504 9.76221C1.87504 9.71707 1.87505 9.67347 1.8751 9.63134Z" fill="#1D1D1F" />
            </svg>
            <UiTypography as="span" size="lg" weight="regular" color="default">
              {{ contactPage.email.address }}
            </UiTypography>
          </a>
        </section>

        <!-- Map + address -->
        <section class="flex flex-col overflow-hidden rounded-[16px] border border-T-400 bg-T-50">
          <PagesMapPlaceholder class="h-[141px] w-full rounded-none border-0" />
          <div class="flex flex-col gap-2 p-5 lg:px-[38px] lg:py-[32px]">
            <UiTypography as="h2" size="lgXl" weight="bold" color="default">
              {{ contactPage.store.title }}
            </UiTypography>
            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <UiTypography as="p" size="lg" weight="regular" color="muted" class="leading-[24px]">
                {{ contactPage.store.address }}
              </UiTypography>
              <a
                href="#"
                class="inline-flex h-[38px] w-full items-center justify-center gap-2 rounded-[12px] bg-T-200 px-5 transition-colors hover:bg-T-300 lg:w-fit"
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

      <!-- Message form -->
      <section class="mt-5 w-full max-w-[903px] rounded-[16px] border border-T-400 bg-T-50 p-5 lg:mt-3 lg:p-8">
        <UiTypography as="h2" size="lg" weight="bold" color="default">{{ contactPage.form.title }}</UiTypography>
        <UiTypography as="p" size="md" weight="regular" color="muted" class="mt-2 leading-[22px]">
          {{ contactPage.form.subtitle }}
        </UiTypography>

        <form class="mt-6 flex flex-col gap-5" novalidate @submit="onSubmit">
          <div class="grid gap-5 lg:grid-cols-3">
            <FieldGroup>
              <VeeField v-slot="{ componentField, errors }" name="name">
                <Field :data-invalid="!!errors.length" class="gap-2">
                  <FieldLabel for="contact-name">
                    <UiTypography as="span" size="lg" weight="regular" color="default">
                      {{ contactPage.form.nameLabel }}
                    </UiTypography>
                  </FieldLabel>
                  <Input
                    id="contact-name"
                    v-bind="componentField"
                    type="text"
                    placeholder="مثال: علی رضایی"
                    class="h-[50px] rounded-[12px]"
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
                    <UiTypography as="span" size="lg" weight="regular" color="default">
                      {{ contactPage.form.contactLabel }}
                    </UiTypography>
                  </FieldLabel>
                  <Input
                    id="contact-phone"
                    v-bind="componentField"
                    type="text"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹ یا email@example.com"
                    class="h-[50px] rounded-[12px]"
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
                    <UiTypography as="span" size="lg" weight="regular" color="default">
                      {{ contactPage.form.subjectLabel }}
                    </UiTypography>
                  </FieldLabel>
                  <select
                    id="contact-subject"
                    v-bind="componentField"
                    class="flex h-[50px] w-full items-center rounded-[12px] border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
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
                  <UiTypography as="span" size="lg" weight="regular" color="default">
                    {{ contactPage.form.messageLabel }}
                  </UiTypography>
                </FieldLabel>
                <Textarea
                  id="contact-message"
                  v-bind="componentField"
                  :placeholder="contactPage.form.messagePlaceholder"
                  class="min-h-[140px] rounded-[12px]"
                  :aria-invalid="!!errors.length"
                />
                <FieldError v-if="errors.length" :errors="errors" />
              </Field>
            </VeeField>
          </FieldGroup>

          <div class="flex justify-start">
            <Button type="submit" class="h-[45px] w-full rounded-[12px] lg:w-[145px]" :disabled="isSubmitting">
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

    <LandingCeoSection />

    <LandingSiteFooter class="mt-auto" />
    <LandingMobileBottomNav />
  </div>
</template>
