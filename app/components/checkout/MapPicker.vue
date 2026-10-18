<script setup lang="ts">
import type { LeafletMouseEvent, Map as LeafletMap, Marker } from 'leaflet'

const props = withDefaults(
  defineProps<{
    /** Allow clicking the map to move the pin (step 1). */
    interactive?: boolean
    /** Initial pin position. */
    center?: [number, number]
    /** Compact preview height (steps 2-5). */
    compact?: boolean
  }>(),
  { interactive: true, center: undefined, compact: false },
)

const emit = defineEmits<{
  pick: [position: { lat: number, lng: number }]
}>()

const container = ref<HTMLDivElement | null>(null)
const ready = ref(false)

let map: LeafletMap | null = null
let marker: Marker | null = null

const DEFAULT_CENTER: [number, number] = [36.4696, 52.3507] // Amol

onMounted(async () => {
  if (!container.value) return

  const [{ default: L }] = await Promise.all([
    import('leaflet'),
    import('leaflet/dist/leaflet.css'),
  ])

  const start = props.center ?? DEFAULT_CENTER

  map = L.map(container.value, {
    center: start,
    zoom: props.compact ? 14 : 13,
    zoomControl: props.interactive,
    attributionControl: props.interactive,
    dragging: props.interactive,
    scrollWheelZoom: props.interactive,
    doubleClickZoom: props.interactive,
  })

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map)

  const pin = L.divIcon({
    className: 'checkout-map-pin',
    html: '<img src="/icons/cart/map-pin.svg" alt="" style="width:46px;height:46px;display:block;transform:translateY(-6px)" />',
    iconSize: [46, 46],
    iconAnchor: [23, 40],
  })

  marker = L.marker(start, { icon: pin }).addTo(map)

  if (props.interactive) {
    map.on('click', (event: LeafletMouseEvent) => {
      marker?.setLatLng(event.latlng)
      emit('pick', { lat: event.latlng.lat, lng: event.latlng.lng })
    })
  }

  ready.value = true
})

function flyTo(lat: number, lng: number) {
  map?.setView([lat, lng], 16)
  marker?.setLatLng([lat, lng])
  emit('pick', { lat, lng })
}

defineExpose({ flyTo })

onUnmounted(() => {
  map?.remove()
  map = null
  marker = null
})
</script>

<template>
  <div
    class="relative w-full overflow-hidden rounded-[20px] border border-T-300 bg-T-200"
    :class="compact ? 'h-[144px]' : 'h-[240px] lg:h-[266px]'"
  >
    <div ref="container" class="absolute inset-0 z-0" />

    <div
      v-if="!ready"
      class="absolute inset-0 z-10 flex items-center justify-center text-[12.5px] text-T-600"
    >
      در حال بارگذاری نقشه…
    </div>
  </div>
</template>

<style>
.checkout-map-pin {
  background: transparent;
  border: 0;
}

.leaflet-container {
  font-family: inherit;
  background: var(--T-200);
}
</style>
