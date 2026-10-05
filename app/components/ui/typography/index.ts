import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Typography } from "./Typography.vue"

/*
 * Typography scale.
 *
 * Each size reads as: mobile (base) first, then the desktop value after `lg:`.
 * Mobile values come straight from the Figma spec; desktop currently mirrors
 * mobile. To change a desktop size later, edit only its `lg:` class — the
 * `size` name stays stable so no call site changes.
 */
export const typographyVariants = cva("font-sans", {
  variants: {
    size: {
      "4xl": "text-[22px] lg:text-[22px]",
      "3xl": "text-[20px] lg:text-[20px]",
      "2xl": "text-[18px] lg:text-[18px]",
      "xl": "text-[16px] lg:text-[16px]",
      "lg": "text-[14px] lg:text-[14px]",
      "md": "text-[12.5px] lg:text-[12.5px]",
      "sm": "text-[11.5px] lg:text-[11.5px]",
      "xs": "text-[11.25px] lg:text-[11.25px]",
      "2xs": "text-[10.5px] lg:text-[10.5px]",
      "3xs": "text-[10px] lg:text-[10px]",
      /*
       * Responsive pairs — mobile value first, desktop (`lg`) second, named
       * `<mobile>Lg<desktop>` (e.g. `lgXl` = 14px mobile, 16px desktop).
       * Use these where the Figma spec steps the size up on desktop.
       */
      "lgXl": "text-[14px] lg:text-[16px]",
      "xl2xl": "text-[16px] lg:text-[18px]",
      "xsMd": "text-[11.25px] lg:text-[12.5px]",
      "3xsSm": "text-[10px] lg:text-[11.5px]",
    },
    weight: {
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
      black: "font-black",
    },
    tracking: {
      normal: "tracking-normal",
      wide: "tracking-[0.07em]",
    },
    leading: {
      none: "leading-none",
      tight: "leading-tight",
      normal: "leading-normal",
      relaxed: "leading-relaxed",
    },
    color: {
      default: "text-T-900",
      muted: "text-T-700",
      subtle: "text-T-600",
      primary: "text-primary",
      white: "text-white",
      destructive: "text-destructive",
      inherit: "text-inherit",
    },
  },
  defaultVariants: {
    size: "lg",
    weight: "regular",
    tracking: "normal",
    leading: "normal",
    color: "default",
  },
})

export type TypographyVariants = VariantProps<typeof typographyVariants>
