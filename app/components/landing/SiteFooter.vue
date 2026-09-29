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
  <footer
    class="relative isolate mx-auto w-full max-w-[1440px] overflow-hidden rounded-3xl bg-T-200 p-10 pt-10"
  >
    <!-- Watermark texture -->
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 -z-10 bg-[url(/icons/texture.svg)] bg-repeat opacity-[0.03]"
    />

    <div class="mx-auto max-w-[1440px] px-4">
      <!-- ============================= Mobile =========================== -->
      <div class="-mx-4 xl:hidden">
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
              <span class="h-[18px] w-[5px] rounded-[2px] bg-primary" />
              <span class="h-[11px] w-[5px] rounded-[2px] bg-primary/25" />
              <span class="text-[16px] font-bold">
                <span class="text-T-900">{{ titleParts(row.title).lead }}</span>
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

        <!-- Trust badges -->
        <div class="flex items-center justify-center gap-6 px-4 py-6">
          <img
            v-for="(badge, i) in footerData.badges"
            :key="i"
            :src="badge.image"
            :alt="badge.alt"
            class="size-[66px] object-contain"
          >
        </div>
      </div>

      <!-- ============================ Desktop =========================== -->
      <div class="site-footer-desktop hidden xl:grid">
        <!-- Link columns -->
        <div v-for="col in footerData.columns" :key="col.title">
          <h4 class="flex items-center gap-[11px]">
            <span class="h-[22px] w-[6px] rounded-[2px] bg-primary" />
            <span class="h-[14px] w-[6px] rounded-[2px] bg-primary/25" />
            <span class="text-[18px] font-bold leading-[28px]">
              <span class="text-T-900">{{ titleParts(col.title).lead }} &nbsp;</span>
              <span class="text-primary">{{
                titleParts(col.title).accent
              }}</span>
            </span>
          </h4>

          <nav class="mt-7 flex flex-col gap-3">
            <NuxtLink
              v-for="link in col.links"
              :key="typeof link === 'string' ? link : link.label"
              :to="typeof link === 'string' ? '#' : link.href"
              class="flex h-6 items-center gap-2 text-[15px] text-T-700 transition-colors hover:text-primary"
            >
              <span class="size-[7px] shrink-0 rounded-full bg-primary" />
              {{ typeof link === "string" ? link : link.label }}
            </NuxtLink>
          </nav>
        </div>

        <!-- Contact -->
        <div class="flex flex-col gap-7">
          <h4 class="flex items-center gap-[11px]">
            <span class="h-[22px] w-[6px] rounded-[2px] bg-primary" />
            <span class="h-[14px] w-[6px] rounded-[2px] bg-primary/25" />
            <span class="text-[18px] font-bold leading-[28px]">
              <span class="text-T-900">{{
                titleParts(footerData.contactTitle).lead
              }}</span>
              <span class="text-primary">{{
                titleParts(footerData.contactTitle).accent
              }}</span>
            </span>
          </h4>

          <!-- Phones -->
          <div class="flex items-start gap-2">
            <img src="/icons/phone-call.svg" alt="" class="size-5 shrink-0" >
            <span class="text-[15px] font-medium text-T-700">تماس:</span>
            <span class="flex items-center gap-2.5 text-[15px] text-T-700">
              <template v-for="(phone, pi) in footerData.phones" :key="phone">
                <span v-if="pi > 0" class="h-[14px] w-px bg-primary" />
                <span
                  ><span class="text-primary">{{
                    toPersianDigits(phoneParts(phone).lead)
                  }}</span
                  >{{ toPersianDigits(phoneParts(phone).rest) }}</span
                >
              </template>
            </span>
          </div>

          <!-- Email -->
          <div class="flex items-start gap-2">
            <img src="/icons/mail.svg" alt="" class="size-5 shrink-0" >
            <span class="text-[15px] font-medium text-T-700">ایمیل:</span>
            <span dir="ltr" class="text-[15px] text-T-700">{{
              footerData.email
            }}</span>
          </div>

          <!-- Address -->
          <div class="flex items-start gap-2">
            <img src="/assets/map-pin.svg" alt="" class="size-5 shrink-0" >
            <span class="text-[15px] font-medium text-T-700">آدرس:</span>
            <span
              class="min-w-0 flex-1 text-right text-[15px] leading-[24px] text-T-700"
              >{{ footerData.address }}</span
            >
          </div>
        </div>

        <!-- Trust badges -->
        <div
          class="ms-[92px] flex w-[96px] shrink-0 flex-col items-center justify-evenly gap-[7px] rounded-2xl bg-T-300 py-1.5"
        >
          <div v-for="(badge, i) in footerData.badges" :key="i">
            <div class="bg-white rounded-lg p-1">
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
        class="mt-6 flex items-center gap-6 rounded-2xl bg-T-50 p-6 lg:mt-[34px] lg:gap-[46px] lg:p-[36px]"
      >
        <a href="#" class="shrink-0">
          <img
            src="/homacom-logo.png"
            alt="هماکام"
            class="h-[54px] w-[60px] object-contain lg:h-[67px] lg:w-[74px]"
          >
        </a>
        <p
          class="flex-1 text-right text-[13px] leading-[26px] text-T-700 lg:text-[14px] lg:leading-[28px]"
        >
          <span
            v-for="(segment, i) in footerData.about"
            :key="i"
            :class="segmentClass(segment.tone)"
            >{{ segment.text }}</span
          >
        </p>
      </div>

      <!-- ======================== Divider + to top ====================== -->
      <div class="relative mt-8 flex items-center justify-center lg:mt-[38px]">
        <span
          aria-hidden="true"
          class="absolute inset-x-0 top-1/2 h-px bg-T-400"
        />
        <button
          type="button"
          class="relative flex items-center gap-3 rounded-full bg-primary py-2 ps-2 pe-4 text-[15px] font-bold text-T-50 transition-opacity hover:opacity-90 lg:gap-[17px] lg:py-[9px] lg:ps-[9px] lg:pe-[17px]"
          @click="scrollTop"
        >
          بازگشت به بالا
          <span
            class="flex size-[30px] items-center justify-center rounded-[10px] bg-T-50 lg:size-[33px]"
          >
            <IconArrowUp class="size-[18px] text-primary" />
          </span>
        </button>
      </div>

      <!-- =========================== Copyright ========================== -->
      <p class="mt-5 pb-10 text-right text-[13px] text-T-700 lg:text-[15px]">
        <span
          v-for="(segment, i) in footerData.copyright"
          :key="i"
          :class="segmentClass(segment.tone)"
          >{{ segment.text }}</span
        >
      </p>
    </div>
  </footer>
</template>

<style scoped>
/*
 * The footer's 5-column desktop grid has a fixed minimum width (3 × 290px link
 * columns + contact + trust badges). Below the 1440px design width those fixed
 * columns used to force the whole document wider than the viewport and cause a
 * horizontal scrollbar on every page. Keep the exact design at ≥1440px and let
 * the columns shrink fluidly in the 1280–1439px range instead.
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
