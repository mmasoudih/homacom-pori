import type { Component } from 'vue'
import { h } from 'vue'

/**
 * Contextual toast icons from the Figma toast frames (34807 toast1 message,
 * 34811 toast2 bell, 34815 toast3 bag) — the design pairs each notification
 * with the object it is about instead of a status glyph.
 */
function toastIcon(file: string): Component {
  return () => h('img', { src: `/icons/toast/${file}.svg`, alt: '', class: 'size-5' })
}

export const toastIcons = {
  bag: toastIcon('bag'),
  bell: toastIcon('bell'),
  message: toastIcon('message'),
  wallet: toastIcon('wallet'),
}
