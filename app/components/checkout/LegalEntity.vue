<script setup lang="ts">
defineProps<{
  modelValue: boolean
  notice: string
  description: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <!-- Legal-entity (حقوقی) invoice switch with its completion notice. -->
  <div class="flex items-start gap-3 rounded-[12px] border border-T-400 p-3.5 lg:items-center lg:p-5">

    <div class="flex min-w-0 flex-1 flex-col gap-2">
      <div class="flex flex-wrap items-center gap-2.5">
        <UiTypography as="span" size="lg" weight="medium">ثبت سفارش به صورت حقوقی</UiTypography>

        <span
          v-if="notice"
          class="flex h-[26px] items-center gap-1.5 rounded-full border border-[#F2DDB4] bg-[#FFF6E9] px-3"
        >
          <span class="flex size-4 items-center justify-center rounded-full border border-[#CF982C] text-[10px] font-bold text-[#CF982C]">!</span>
          <span class="text-[12.5px] font-medium text-[#CF982C]">{{ notice }}</span>
        </span>
      </div>

      <UiTypography
        as="p"
        size="md"
        color="muted"
        class="leading-[18px]"
        :class="modelValue ? '' : 'hidden lg:block'"
      >
        {{ description }}
      </UiTypography>
    </div>
    <button
      type="button"
      role="switch"
      :aria-checked="modelValue"
      class="relative h-[17px] w-[30px] shrink-0 rounded-full transition-colors"
      :class="modelValue ? 'bg-R-300' : 'bg-T-500'"
      aria-label="ثبت سفارش به صورت حقوقی"
      @click="emit('update:modelValue', !modelValue)"
    >
      <span
        class="absolute top-[2px] size-[13px] rounded-full bg-white transition-all"
        :class="modelValue ? 'start-[15px]' : 'start-[2px]'"
      />
    </button>
  </div>
</template>
