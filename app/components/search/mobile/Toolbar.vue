<script setup lang="ts">
import { toPersianDigits } from '~/utils/format'

const props = defineProps<{
  /** Human label for the active sort key (e.g. «مرتبط‌ترین»). */
  sortLabel: string
  /** Number of active filter chips — shown as «۰ فیلتر» / «۲ فیلتر». */
  activeCount: number
}>()

const emit = defineEmits<{
  sort: []
  filter: []
}>()

const filterLabel = computed(() => `${toPersianDigits(props.activeCount)} فیلتر`)
</script>

<template>
  <!-- One pill, two segments (sort · filters) split by a divider. -->
  <div class="flex h-11 w-full items-center rounded-full border border-T-400 px-1">
    <button
      type="button"
      class="flex h-full min-w-0 flex-1 items-center gap-1.5 rounded-full px-3"
      @click="emit('sort')"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="size-5 shrink-0 text-T-900"
        aria-hidden="true"
      >
        <path d="M19.75 4C19.75 4.41421 19.4142 4.75 19 4.75H2C1.58579 4.75 1.25 4.41421 1.25 4C1.25 3.58579 1.58579 3.25 2 3.25H19C19.4142 3.25 19.75 3.58579 19.75 4Z" fill="currentColor" />
        <path d="M12.75 11C12.75 11.4142 12.4142 11.75 12 11.75H2C1.58579 11.75 1.25 11.4142 1.25 11C1.25 10.5858 1.58579 10.25 2 10.25H12C12.4142 10.25 12.75 10.5858 12.75 11Z" fill="currentColor" />
        <path d="M5 18.75C5.41421 18.75 5.75 18.4142 5.75 18C5.75 17.5858 5.41421 17.25 5 17.25H2C1.58579 17.25 1.25 17.5858 1.25 18C1.25 18.4142 1.58579 18.75 2 18.75H5Z" fill="currentColor" />
        <path d="M13.4697 15.4697C13.1768 15.7626 13.1768 16.2374 13.4697 16.5303L17.4697 20.5303C17.6103 20.671 17.8011 20.75 18 20.75C18.1989 20.75 18.3897 20.671 18.5303 20.5303L22.5303 16.5303C22.8232 16.2374 22.8232 15.7626 22.5303 15.4697C22.2374 15.1768 21.7626 15.1768 21.4697 15.4697L18.75 18.1893L18.75 10C18.75 9.58579 18.4142 9.25 18 9.25C17.5858 9.25 17.25 9.58579 17.25 10L17.25 18.1893L14.5303 15.4697C14.2374 15.1768 13.7626 15.1768 13.4697 15.4697Z" fill="currentColor" />
      </svg>
      <UiTypography as="span" size="md" weight="medium" color="default" class="shrink-0">
        مرتب سازی:
      </UiTypography>
      <UiTypography as="span" size="xs" weight="regular" color="muted" class="truncate">
        {{ sortLabel }}
      </UiTypography>
    </button>

    <span class="h-6 w-px shrink-0 bg-T-300" aria-hidden="true" />

    <button
      type="button"
      class="flex h-full min-w-0 flex-1 items-center gap-1.5 rounded-full px-3"
      @click="emit('filter')"
    >
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="shrink-0"
        aria-hidden="true"
      >
        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.35425 7.0415C1.35425 4.79785 3.17309 2.979 5.41675 2.979C7.6604 2.979 9.47925 4.79785 9.47925 7.0415C9.47925 9.28516 7.6604 11.104 5.41675 11.104C3.17309 11.104 1.35425 9.28516 1.35425 7.0415ZM5.41675 4.604C4.07055 4.604 2.97925 5.69531 2.97925 7.0415C2.97925 8.3877 4.07055 9.479 5.41675 9.479C6.76294 9.479 7.85425 8.3877 7.85425 7.0415C7.85425 5.69531 6.76294 4.604 5.41675 4.604Z" fill="#1D1D1F" />
        <path d="M14.0834 7.854C13.6347 7.854 13.2709 7.49024 13.2709 7.0415C13.2709 6.59277 13.6347 6.229 14.0834 6.229H23.8334C24.2821 6.229 24.6459 6.59277 24.6459 7.0415C24.6459 7.49024 24.2821 7.854 23.8334 7.854H14.0834Z" fill="#1D1D1F" />
        <path d="M11.9167 19.7707C12.3655 19.7707 12.7292 19.4069 12.7292 18.9582C12.7292 18.5094 12.3655 18.1457 11.9167 18.1457H2.16675C1.71802 18.1457 1.35425 18.5094 1.35425 18.9582C1.35425 19.4069 1.71802 19.7707 2.16675 19.7707H11.9167Z" fill="#1D1D1F" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M20.5834 14.8957C18.3398 14.8957 16.5209 16.7145 16.5209 18.9582C16.5209 21.2018 18.3398 23.0207 20.5834 23.0207C22.8271 23.0207 24.6459 21.2018 24.6459 18.9582C24.6459 16.7145 22.8271 14.8957 20.5834 14.8957ZM18.1459 18.9582C18.1459 17.612 19.2372 16.5207 20.5834 16.5207C21.9296 16.5207 23.0209 17.612 23.0209 18.9582C23.0209 20.3044 21.9296 21.3957 20.5834 21.3957C19.2372 21.3957 18.1459 20.3044 18.1459 18.9582Z" fill="#1D1D1F" />
      </svg>
      <UiTypography as="span" size="md" weight="medium" color="default" class="shrink-0">
        فیلترها:
      </UiTypography>
      <UiTypography as="span" size="xs" weight="regular" color="muted" class="truncate">
        {{ filterLabel }}
      </UiTypography>
    </button>
  </div>
</template>
