<script setup lang="ts">
import { brands } from '~/data/landing'
import SectionTitle from './SectionTitle.vue'
</script>

<template>
  <section class="mx-auto w-full max-w-[1400px] px-5">
    <div class="rounded-3xl border border-border bg-card p-6">
      <SectionTitle title="محبوب‌ترین برندها" />
      <div class="relative mt-8 overflow-hidden">
        <div class="flex w-max animate-marquee gap-4" dir="ltr">
          <template v-for="n in 2" :key="n">
            <div v-for="brand in brands" :key="brand + n" class="ml-4">
              <a
                href="#"
                class="flex h-20 w-40 items-center justify-center whitespace-nowrap rounded-2xl border border-border px-6 text-lg font-bold text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {{ brand }}
              </a>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
