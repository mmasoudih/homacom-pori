<script setup lang="ts">
import { IconArrowRight } from '@tabler/icons-vue'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

withDefaults(defineProps<{
  title?: string
  subtitle?: string
  showBack?: boolean
}>(), {
  title: '',
  subtitle: '',
  showBack: true,
})

const { t } = useI18n()
const router = useRouter()

// Auth pages use the local brand artwork — the legacy `/getLoginPageInfo`
// endpoint is not part of the current shop API.
const backgroundImage = '/figma/fill-4f5b0b1a98425788.jpg'
const backgroundAlt = computed(() => t('auth.loginTitle'))
</script>

<template>
  <div dir="rtl" class="grid min-h-dvh bg-background lg:grid-cols-12">
    <section class="flex flex-col lg:col-span-3">
      <div v-if="showBack" class="flex items-start justify-start p-6">
        <Button
          variant="ghost"
          class="cursor-pointer text-primary hover:bg-primary hover:text-white"
          :aria-label="t('common.back')"
          @click="router.back()"
        >
          <IconArrowRight data-icon="inline-start" />
          {{ t('common.back') }}
        </Button>
      </div>

      <div class="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center gap-8 px-6 pb-16 lg:px-16">
        <div class="flex flex-col items-center gap-4 text-center">
          <NuxtLink to="/" aria-label="هماکام">
            <img
              src="/homacom-logo.png"
              :alt="t('common.brand')"
              class="size-14 rounded-2xl object-contain"
            >
          </NuxtLink>

          <div class="flex flex-col gap-2">
            <h1 class="text-2xl font-bold">{{ title }}</h1>
            <slot name="subtitle">
              <p v-if="subtitle" class="text-sm text-muted-foreground">{{ subtitle }}</p>
            </slot>
          </div>
        </div>

        <slot />

        <slot name="footer" />
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
