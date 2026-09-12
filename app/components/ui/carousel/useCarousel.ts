import type { UnwrapRefCarouselApi as CarouselApi, CarouselEmits, CarouselProps } from "./interface"
import { createInjectionState } from "@vueuse/core"
import emblaCarouselVue from "embla-carousel-vue"
import { onMounted, ref } from "vue"

const [useProvideCarousel, useInjectCarousel] = createInjectionState(
  ({
    opts,
    orientation,
    plugins,
  }: CarouselProps, emits: CarouselEmits) => {
    const [emblaNode, emblaApi] = emblaCarouselVue({
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    }, plugins)

    function scrollPrev() {
      emblaApi.value?.scrollPrev()
    }
    function scrollNext() {
      emblaApi.value?.scrollNext()
    }

    const canScrollNext = ref(false)
    const canScrollPrev = ref(false)

    function onSelect(api: CarouselApi) {
      canScrollNext.value = api?.canScrollNext() || false
      canScrollPrev.value = api?.canScrollPrev() || false
    }

    // Embla has no native "free drag with snap": `dragFree` disables snapping.
    // Restore it by snapping to the nearest slide once a free scroll settles.
    function attachFreeSnap(api: CarouselApi) {
      let snapping = false

      api.on("settle", () => {
        if (snapping) {
          snapping = false
          return
        }

        const snaps = api.scrollSnapList()
        const target = api.selectedScrollSnap()
        const targetProgress = snaps[target] ?? 0

        const maxPx = Math.max(
          api.containerNode().scrollWidth - api.rootNode().clientWidth,
          0,
        )
        const distancePx = Math.abs(api.scrollProgress() - targetProgress) * maxPx

        if (distancePx < 1)
          return

        snapping = true
        api.scrollTo(target)
      })
    }

    onMounted(() => {
      if (!emblaApi.value)
        return

      emblaApi.value?.on("init", onSelect)
      emblaApi.value?.on("reInit", onSelect)
      emblaApi.value?.on("select", onSelect)

      if (opts?.dragFree)
        attachFreeSnap(emblaApi.value)

      emits("init-api", emblaApi.value)
    })

    return { carouselRef: emblaNode, carouselApi: emblaApi, canScrollPrev, canScrollNext, scrollPrev, scrollNext, orientation }
  },
)

function useCarousel() {
  const carouselState = useInjectCarousel()

  if (!carouselState)
    throw new Error("useCarousel must be used within a <Carousel />")

  return carouselState
}

export { useCarousel, useProvideCarousel }
