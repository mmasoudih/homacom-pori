import type { Address } from '~/data/addresses'

export interface LocateOption {
  id: number
  name: string
  slug?: string | null
}

interface ApiLocate {
  id: number
  name: string
  slug?: string | null
}

interface ApiAddress {
  id: number
  title: string
  state?: ApiLocate | null
  city?: ApiLocate | null
  zip_code?: string | null
  address: string
  lat?: string | null
  lng?: string | null
  mobile?: string | null
  tel?: string | null
  nickname?: string | null
  code_melli?: string | null
  plaque?: string | null
  floor?: string | null
  unit?: string | null
  is_default?: string | null
  status?: string | null
}

export interface AddressInput {
  title: string
  state: number
  city: number
  address: string
  lat: number | string
  lng: number | string
  mobile: string
  nickname: string
  code_melli: string
  zip_code?: number | string | null
  tel?: string | null
  plaque?: number | string | null
  floor?: number | string | null
  unit?: number | string | null
}

function mapLocate(item: ApiLocate): LocateOption {
  return { id: item.id, name: item.name, slug: item.slug ?? undefined }
}

function mapAddress(item: ApiAddress): Address {
  return {
    id: String(item.id),
    title: item.title,
    address: [item.state?.name, item.city?.name, item.address]
      .filter(Boolean)
      .join('، '),
    postalCode: item.zip_code ?? '',
    stateId: item.state?.id,
    cityId: item.city?.id,
    addressLine: item.address,
    mobile: item.mobile ?? undefined,
    nickname: item.nickname ?? undefined,
    codeMelli: item.code_melli ?? undefined,
    lat: item.lat,
    lng: item.lng,
    isDefault: item.is_default === 'yes',
  }
}

/** Provinces (states) for address forms. */
export function useStates() {
  const api = useApi()

  const { data: states, pending, error, refresh } = useAsyncData<LocateOption[]>(
    'shop-address-states',
    async () => {
      const res = await api.get<ApiLocate[]>('/address/states')
      return (res.data ?? []).map(mapLocate)
    },
    { server: false, lazy: true, default: () => [] },
  )

  return { states, pending, error, refresh }
}

/** Cities of a state (`filters[parent_id]`). */
export function useCities(parentId: Ref<number | null>) {
  const api = useApi()

  const { data: cities, pending, error, refresh } = useAsyncData<LocateOption[]>(
    () => `shop-address-cities-${parentId.value ?? 'none'}`,
    async () => {
      if (!parentId.value) return []
      const res = await api.get<ApiLocate[]>('/address/cities', {
        query: { 'filters[parent_id]': parentId.value },
      })
      return (res.data ?? []).map(mapLocate)
    },
    { watch: [parentId], server: false, lazy: true, default: () => [] },
  )

  return { cities, pending, error, refresh }
}

/** Authenticated user's address book (list, create, update, delete). */
export function useUserAddresses() {
  const api = useApi()
  const addresses = ref<Address[]>([])
  const pending = ref(false)
  const loaded = ref(false)

  async function load() {
    pending.value = true
    try {
      const res = await api.get<ApiAddress[]>('/shop/user/address')
      addresses.value = (res.data ?? []).map(mapAddress)
      loaded.value = true
    }
    finally {
      pending.value = false
    }
  }

  async function create(payload: AddressInput) {
    const res = await api.post<ApiAddress>('/shop/user/address', payload)
    if (res.data) addresses.value = [...addresses.value, mapAddress(res.data)]
    return res
  }

  async function update(id: string, payload: AddressInput) {
    const res = await api.put<ApiAddress>(`/shop/user/address/${id}`, payload)
    if (res.data)
      addresses.value = addresses.value.map(item => (item.id === id ? mapAddress(res.data!) : item))
    return res
  }

  async function remove(id: string) {
    await api.del(`/shop/user/address/${id}`)
    addresses.value = addresses.value.filter(item => item.id !== id)
  }

  return { addresses, pending, loaded, load, create, update, remove }
}
