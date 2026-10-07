<script setup lang="ts">
import { IconArrowUp, IconChevronDown } from "@tabler/icons-vue";
import type { SeoSegment } from "~/data/landing";
import { footerData } from "~/data/landing";
import { toPersianDigits } from "~/utils/format";

const openRow = ref("");

const accordionRows = [
  ...footerData.columns.map((col) => ({ title: col.title, links: col.links })),
  {
    title: footerData.contactTitle,
    links: [
      `تماس: ${footerData.phones.map(toPersianDigits).join(" | ")}`,
      `ایمیل: ${footerData.email}`,
      `آدرس: ${footerData.address}`,
    ],
  },
];

/** Column headings render the leading words dark and the last word in brand red. */
function titleParts(title: string) {
  const words = title.trim().split(" ");
  const accent = words.pop() ?? "";
  return { lead: words.join(" "), accent };
}

/** Phone numbers render the operator prefix in brand red, the rest in body grey. */
function phoneParts(phone: string) {
  const dash = phone.indexOf("-");
  if (dash === -1) return { lead: phone, rest: "" };
  return { lead: phone.slice(0, dash + 1), rest: phone.slice(dash + 1) };
}

function segmentClass(tone?: SeoSegment["tone"]) {
  if (tone === "strong") return "font-bold text-T-900";
  if (tone === "accent") return "font-bold text-primary";
  return "";
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
</script>

<template>
  <footer class="w-full lg:px-6">
    <div
      class="relative isolate mx-auto mt-2.5 w-full max-w-[1440px] overflow-hidden bg-T-200 p-4 pt-4 lg:p-10 lg:pt-10 pb-25 lg:pb-0 lg:rounded-3xl"
    >
      <!-- Watermark texture -->
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 -z-10 bg-[url(/icons/texture.svg)] bg-repeat opacity-[0.03]"
      />

      <div class="mx-auto max-w-[1440px] px-4">
        <!-- ============================= Mobile =========================== -->
        <div class="-mx-4 lg:hidden">
          <div
            v-for="row in accordionRows"
            :key="row.title"
            class="border-b border-T-400 px-4"
          >
            <button
              class="flex h-[60px] w-full items-center justify-between"
              @click="openRow = openRow === row.title ? '' : row.title"
            >
              <span class="flex items-center gap-[11px]">
                <svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g opacity="0.25">
                    <rect y="4" width="5.5" height="12" rx="2.75" fill="#EF233C" />
                  </g>
                  <rect x="7.5" width="5.5" height="20" rx="2.75" fill="#EF233C" />
                </svg>
                <span class="text-[16px] font-bold">
                  <span class="text-T-900">{{ titleParts(row.title).lead }}&nbsp;</span>
                  <span class="text-primary">{{
                    titleParts(row.title).accent
                  }}</span>
                </span>
              </span>
              <IconChevronDown
                class="size-4 text-T-600 transition-transform duration-200"
                :class="openRow === row.title ? 'rotate-180' : ''"
              />
            </button>

            <div v-if="openRow === row.title" class="flex flex-col gap-3 pb-4">
              <NuxtLink
                v-for="(link, li) in row.links"
                :key="li"
                :to="typeof link === 'string' ? '#' : link.href"
                class="flex items-center gap-2 text-[14px] text-T-700 transition-colors hover:text-primary"
              >
                <span class="size-[6px] shrink-0 rounded-full bg-primary" />
                {{ typeof link === "string" ? link : link.label }}
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- ============================ Desktop =========================== -->
        <div class="site-footer-desktop hidden lg:grid">
          <!-- Link columns -->
          <div v-for="col in footerData.columns" :key="col.title">
            <h4 class="flex items-center gap-[11px]">
              <svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.25">
                  <rect y="4" width="5.5" height="12" rx="2.75" fill="#EF233C" />
                </g>
                <rect x="7.5" width="5.5" height="20" rx="2.75" fill="#EF233C" />
              </svg>
              <UiTypography as="span" size="xl" weight="bold" class="leading-[28px]">
                <span class="text-T-900">{{ titleParts(col.title).lead }} &nbsp;</span>
                <span class="text-primary">{{
                  titleParts(col.title).accent
                }}</span>
              </UiTypography>
            </h4>

            <nav class="mt-7 flex flex-col gap-3">
              <NuxtLink
                v-for="link in col.links"
                :key="typeof link === 'string' ? link : link.label"
                :to="typeof link === 'string' ? '#' : link.href"
                class="flex h-6 items-center gap-2 text-T-700 transition-colors hover:text-primary"
              >
                <span class="size-[7px] shrink-0 rounded-full bg-primary" />
                <UiTypography as="span" size="lg" weight="regular" color="inherit">
                  {{ typeof link === "string" ? link : link.label }}
                </UiTypography>
              </NuxtLink>
            </nav>
          </div>

          <!-- Contact -->
          <div class="flex flex-col gap-7">
            <h4 class="flex items-center gap-[11px]">
              <svg width="13" height="20" viewBox="0 0 13 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.25">
                  <rect y="4" width="5.5" height="12" rx="2.75" fill="#EF233C" />
                </g>
                <rect x="7.5" width="5.5" height="20" rx="2.75" fill="#EF233C" />
              </svg>
              <UiTypography as="span" size="xl" weight="bold" class="leading-[28px]">
                <span class="text-T-900">{{
                  titleParts(footerData.contactTitle).lead
                }}&nbsp;</span>
                <span class="text-primary">{{
                  titleParts(footerData.contactTitle).accent
                }}</span>
              </UiTypography>
            </h4>

            <!-- Phones -->
            <div class="flex items-start gap-2">
              <img src="/icons/phone-call.svg" alt="" class="size-5 shrink-0" >
              <UiTypography as="span" size="lg" weight="regular" color="muted">تماس:</UiTypography>
              <UiTypography as="span" size="lg" weight="regular" color="muted" class="flex items-center gap-2.5">
                <template v-for="(phone, pi) in footerData.phones" :key="phone">
                  <span v-if="pi > 0" class="h-[14px] w-px bg-primary" />
                  <span
                    ><span class="text-primary">{{
                      toPersianDigits(phoneParts(phone).lead)
                    }}</span
                    >{{ toPersianDigits(phoneParts(phone).rest) }}</span
                  >
                </template>
              </UiTypography>
            </div>

            <!-- Email -->
            <div class="flex items-start gap-2">
              <img src="/icons/envelope-open-empty.svg" alt="" class="size-5 shrink-0" >
              <UiTypography as="span" size="lg" weight="regular" color="muted">ایمیل:</UiTypography>
              <UiTypography as="span" size="lg" weight="regular" color="muted" dir="ltr">{{
                footerData.email
              }}</UiTypography>
            </div>

            <!-- Address -->
            <div class="flex items-start gap-2">
              <img src="/icons/location-pin-line.svg" alt="" class="size-5 shrink-0" >
              <UiTypography as="span" size="lg" weight="regular" color="muted">آدرس:</UiTypography>
              <UiTypography
                as="span"
                size="lg"
                weight="regular"
                color="muted"
                class="min-w-0 flex-1 text-right leading-[24px]"
                >{{ footerData.address }}</UiTypography
              >
            </div>
          </div>

          <!-- Trust badges -->
          <div
            class="ms-[92px] flex w-[87px] h-[195px] shrink-0 flex-col items-center justify-evenly gap-[7px] rounded-[16px] bg-T-300 py-1.5"
          >
            <div v-for="(badge, i) in footerData.badges" :key="i">
              <div class="bg-white rounded-[16px] p-1">
                <img
                  :src="badge.image"
                  :alt="badge.alt"
                  class="size-[57px] object-contain"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- ============================== About ============================ -->
        <div
          class="mt-6 flex flex-col gap-6 rounded-2xl bg-T-50 p-6 lg:mt-[34px] lg:flex-row lg:items-start lg:gap-[46px] lg:p-[36px]"
        >
          <a href="#" class="shrink-0">
            <img
              src="/homacom-logo.png"
              alt="هماکام"
              class="h-[54px] w-[60px] object-contain lg:h-[86px] lg:w-[91px]"
            >
          </a>
          <UiTypography
            as="p"
            size="md"
            weight="regular"
            class="flex-1 text-right leading-[26px] text-T-700"
          >
            <UiTypography
              v-for="(segment, i) in footerData.about"
              :key="i"
              as="span"
              size="md"
              :weight="segment.tone ? 'bold' : 'regular'"
              :color="segment.tone ? 'default' : 'muted'"
              :class="segmentClass(segment.tone)"
            >{{ segment.text }}</UiTypography>
          </UiTypography>
        </div>

        <!-- ======================== Divider + to top ====================== -->
        <div class="relative mt-8 flex items-center justify-center lg:mt-[38px]">
          <span
            aria-hidden="true"
            class="absolute inset-x-0 top-1/2 h-px bg-T-400"
          />
          <button
            type="button"
            class="relative flex items-center justify-center gap-3 whitespace-nowrap rounded-full bg-primary py-2 ps-2 pe-4 transition-opacity hover:opacity-90 lg:h-[46px] lg:min-w-[140px] lg:gap-[17px] lg:rounded-[20px] lg:py-[9px] lg:ps-[9px] lg:pe-[17px]"
            @click="scrollTop"
          >
            <UiTypography as="span" size="lg" weight="semibold" color="white">بازگشت به بالا</UiTypography>
            <span
              class="flex size-[30px] items-center justify-center rounded-[10px] bg-T-50"
            >
              <IconArrowUp class="size-[18px] text-primary" />
            </span>
          </button>
        </div>

        <!-- =========================== Copyright ========================== -->
        <UiTypography
          as="p"
          size="lg"
          weight="regular"
          class="mt-5 pb-10 text-right text-T-700"
        >
          <UiTypography
            v-for="(segment, i) in footerData.copyright"
            :key="i"
            as="span"
            size="lg"
            :weight="segment.tone ? 'bold' : 'regular'"
            :color="segment.tone ? 'default' : 'muted'"
            :class="segmentClass(segment.tone)"
          >{{ segment.text }}</UiTypography>
        </UiTypography>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/*
 * The footer's 5-column desktop grid has a fixed minimum width (3 × 290px link
 * columns + contact + trust badges). Below the 1440px design width those fixed
 * columns used to force the whole document wider than the viewport and cause a
 * horizontal scrollbar on every page. Keep the exact design at ≥1440px and let
 * the columns shrink fluidly in the 1024–1439px range instead.
 *
 * NOTE: this is a container/design-width constraint, not one of the app's two
 * responsive tiers (mobile base + `lg` desktop) — it is intentionally left as a
 * raw media query.
 */
.site-footer-desktop {
  grid-template-columns: repeat(3, minmax(0, 1fr)) minmax(0, 1.6fr) auto;
}

@media (min-width: 1440px) {
  .site-footer-desktop {
    grid-template-columns: 290px 290px 290px 1fr auto;
  }
}
</style>
