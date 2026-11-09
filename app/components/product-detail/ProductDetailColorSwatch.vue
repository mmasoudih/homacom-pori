<script setup lang="ts">
/**
 * Colour swatch taken from the design frame «Frame 3294» / «frame-product-price»
 * (icon «Huge-icon/device/bulk/dark mode», exported as `color-swatch-20.svg`).
 *
 * The exported asset is used as a CSS mask so its half-tone circle geometry is
 * preserved while the fill stays the design red.
 */
const swatchStyle = {
  backgroundColor: '#EF233C',
  maskImage: 'url(/icons/product-detail/color-swatch-20.svg)',
  WebkitMaskImage: 'url(/icons/product-detail/color-swatch-20.svg)',
  maskSize: '100% 100%',
  WebkitMaskSize: '100% 100%',
  maskRepeat: 'no-repeat',
  WebkitMaskRepeat: 'no-repeat',
}
</script>

<template>
  <span class="size-5 shrink-0" aria-hidden="true" :style="swatchStyle" />
</template>
