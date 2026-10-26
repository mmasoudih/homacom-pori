import type { AccountProfile, LegalInfo } from '~/data/account'
import { resolveMediaUrl } from '~/utils/media'
import { toEnglishDigits, toPersianDigits } from '~/utils/format'
import { isoToJalali, jalaliToIso } from '~/utils/jalali'

interface ApiLocate {
  id: number
  name: string
  slug?: string | null
}

interface ApiProfile {
  id: number
  fname?: string | null
  lname?: string | null
  email?: string | null
  mobile?: string | null
  nickname?: string | null
  username?: string | null
  credit?: number | string | null
  currency?: string | null
  code_melli?: string | null
  birthday?: string | null
  type?: string | null
  avatar?: string | null
  bank_card_number?: string | null
  bank_shaba_number?: string | null
  has_password?: boolean | null
  company_name?: string | null
  company_register_id?: string | null
  company_national_code?: string | null
  company_economic_code?: string | null
  company_ceo?: string | null
  company_tel?: string | null
}

interface ApiLegalInfo {
  company_establishment_date?: string | null
  company_name?: string | null
  company_register_id?: string | null
  company_national_code?: string | null
  company_economic_code?: string | null
  company_ceo?: string | null
  company_tel?: string | null
  company_state?: ApiLocate | null
  company_city?: ApiLocate | null
  company_address?: string | null
}

interface ProfilePayload {
  profile: ApiProfile
  legal: ApiLegalInfo | null
}

function emptyProfile(): AccountProfile {
  return {
    firstName: '',
    lastName: '',
    avatar: undefined,
    mobile: '',
    nickname: '',
    username: '',
    credit: 0,
    currency: 'IRT',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    birthDate: '',
    nationalId: '',
    email: '',
    cardNumber: '',
    shebaNumber: '',
    legal: null,
    hasPassword: false,
  }
}

function persianPart(value: number, pad = false): string {
  return toPersianDigits(pad ? String(value).padStart(2, '0') : String(value))
}

function hasLegalData(legal: ApiLegalInfo | null | undefined): boolean {
  return !!legal && Object.entries(legal).some(([key, value]) =>
    key !== 'company_state' && key !== 'company_city' && value != null && value !== '',
  )
}

function mapLegal(profile: ApiProfile, legal: ApiLegalInfo | null): LegalInfo | null {
  if (!hasLegalData(legal)) {
    if (!profile.company_name) return null
    return {
      organizationName: profile.company_name,
      nationalId: profile.company_national_code ?? '',
      registrationId: profile.company_register_id ?? '',
      phone: profile.company_tel ?? '',
      city: '',
      province: '',
      postalAddress: '',
      economicCode: profile.company_economic_code ?? '',
      ceo: profile.company_ceo ?? '',
    }
  }

  return {
    organizationName: legal?.company_name ?? '',
    nationalId: legal?.company_national_code ?? '',
    registrationId: legal?.company_register_id ?? '',
    phone: legal?.company_tel ?? '',
    city: legal?.company_city?.name ?? '',
    province: legal?.company_state?.name ?? '',
    postalAddress: legal?.company_address ?? '',
    stateId: legal?.company_state?.id,
    cityId: legal?.company_city?.id,
    establishmentDate: legal?.company_establishment_date?.slice(0, 10) ?? undefined,
    economicCode: legal?.company_economic_code ?? '',
    ceo: legal?.company_ceo ?? '',
  }
}

function mapProfile(payload: ProfilePayload, apiBase: string): AccountProfile {
  const data = payload.profile
  const jalali = isoToJalali(data.birthday)

  return {
    firstName: data.fname ?? '',
    lastName: data.lname ?? '',
    avatar: data.avatar ? resolveMediaUrl(data.avatar, apiBase) : undefined,
    mobile: data.mobile ?? '',
    nickname: data.nickname ?? '',
    username: data.username ?? '',
    credit: Number(data.credit) || 0,
    currency: data.currency ?? 'IRT',
    birthYear: jalali ? persianPart(jalali.jy) : '',
    birthMonth: jalali ? persianPart(jalali.jm, true) : '',
    birthDay: jalali ? persianPart(jalali.jd, true) : '',
    birthDate: jalali
      ? `${persianPart(jalali.jy)}/${persianPart(jalali.jm, true)}/${persianPart(jalali.jd, true)}`
      : '',
    nationalId: data.code_melli ?? '',
    email: data.email ?? '',
    cardNumber: toPersianDigits(data.bank_card_number ?? ''),
    shebaNumber: toPersianDigits(data.bank_shaba_number ?? ''),
    legal: mapLegal(data, payload.legal),
    hasPassword: !!data.has_password,
  }
}

/**
 * Read + update the authenticated user's profile.
 *
 * One keyed async-data request is shared by the account page and dashboard
 * shell, so SSR renders the real profile (no mock flash) and edits propagate
 * to every consumer.
 */
export function useUserProfile() {
  const api = useApi()
  const config = useRuntimeConfig()
  const apiBase = String(config.public.apiBase || '')

  const { data, pending, refresh } = useAsyncData<ProfilePayload | null>(
    'user-profile',
    async () => {
      try {
        const [profileRes, legalRes] = await Promise.allSettled([
          api.get<ApiProfile>('/shop/user/profile/me'),
          api.get<ApiLegalInfo>('/shop/user/profile/legal-information'),
        ])

        if (profileRes.status !== 'fulfilled' || !profileRes.value.data) return null

        return {
          profile: profileRes.value.data,
          legal: legalRes.status === 'fulfilled' ? legalRes.value.data ?? null : null,
        }
      }
      catch {
        return null
      }
    },
    { default: () => null },
  )

  const profile = ref<AccountProfile>(emptyProfile())
  watch(data, (value) => {
    if (value) profile.value = mapProfile(value, apiBase)
  }, { immediate: true })

  const loaded = computed(() => !pending.value)

  async function load() {
    if (!data.value) await refresh()
  }

  function updateData(patch: Partial<ApiProfile>) {
    if (data.value) data.value = { ...data.value, profile: { ...data.value.profile, ...patch } }
  }

  async function saveName(payload: { firstName: string, lastName: string }) {
    await api.put('/shop/user/profile/base-information', {
      fname: payload.firstName,
      lname: payload.lastName,
    })
    updateData({ fname: payload.firstName, lname: payload.lastName })
    profile.value.firstName = payload.firstName
    profile.value.lastName = payload.lastName
  }

  async function saveEmail(payload: { email: string }) {
    await api.put('/shop/user/profile/email', { email: payload.email })
    updateData({ email: payload.email })
    profile.value.email = payload.email
  }

  async function saveNationalId(payload: { nationalId: string }) {
    await api.put('/shop/user/profile/national-code', { code_melli: payload.nationalId })
    updateData({ code_melli: payload.nationalId })
    profile.value.nationalId = payload.nationalId
  }

  async function saveBirthdate(payload: { year: string, month: string, day: string, birthDate: string }) {
    const year = Number(toEnglishDigits(payload.year))
    const month = Number(toEnglishDigits(payload.month))
    const day = Number(toEnglishDigits(payload.day))

    if (year && month && day) {
      const birthday = jalaliToIso(year, month, day)
      await api.put('/shop/user/profile/birthday', { birthday })
      updateData({ birthday })
      profile.value.birthYear = payload.year
      profile.value.birthMonth = payload.month
      profile.value.birthDay = payload.day
      profile.value.birthDate = payload.birthDate
    }
  }

  async function saveCompany(payload: LegalInfo) {
    const res = await api.put<ApiLegalInfo>('/shop/user/profile/legal-information', {
      company_establishment_date: payload.establishmentDate || null,
      company_name: payload.organizationName,
      company_register_id: payload.registrationId,
      company_national_code: payload.nationalId,
      company_economic_code: payload.economicCode ?? '',
      company_ceo: payload.ceo ?? `${profile.value.firstName} ${profile.value.lastName}`.trim(),
      company_tel: payload.phone,
      company_state_id: payload.stateId ?? null,
      company_city_id: payload.cityId ?? null,
      company_address: payload.postalAddress,
    })

    const legal = res.data ?? null
    if (data.value) data.value = { ...data.value, legal }
    profile.value.legal = mapLegal({ ...(data.value?.profile ?? { id: 0 }), company_name: payload.organizationName }, legal)
  }

  async function saveBank(payload: { cardNumber: string, shebaNumber: string }) {
    const card = toEnglishDigits(payload.cardNumber).replace(/\D/g, '')
    const sheba = toEnglishDigits(payload.shebaNumber).replace(/\D/g, '')

    const res = await api.put<{
      bank_card_number?: string | null
      bank_shaba_number?: string | null
      avatar?: string | null
    }>('/shop/user/profile/bank-information', {
      bank_card_number: card || null,
      bank_shaba_number: sheba || null,
    })

    updateData({
      bank_card_number: res.data?.bank_card_number ?? (card || null),
      bank_shaba_number: res.data?.bank_shaba_number ?? (sheba || null),
    })
    profile.value.cardNumber = toPersianDigits(res.data?.bank_card_number ?? card)
    profile.value.shebaNumber = toPersianDigits(res.data?.bank_shaba_number ?? sheba)
  }

  async function uploadAvatar(file: File) {
    const form = new FormData()
    form.append('avatar', file)

    const res = await api.post<{ avatar?: string | null }>('/shop/user/profile/avatar', form)
    const avatar = res.data?.avatar ?? null
    updateData({ avatar })
    profile.value.avatar = avatar ? resolveMediaUrl(avatar, apiBase) : undefined
    return profile.value.avatar
  }

  async function requestPasswordCode() {
    await api.post('/shop/user/profile/reset-password/send-code')
  }

  async function savePassword(payload: { code: string, password: string }) {
    await api.post('/shop/user/profile/reset-password', {
      active_code: toEnglishDigits(payload.code),
      password: payload.password,
      password_confirmation: payload.password,
    })
    updateData({ has_password: true })
    profile.value.hasPassword = true
  }

  return {
    profile,
    pending,
    loaded,
    load,
    saveName,
    saveEmail,
    saveNationalId,
    saveBirthdate,
    saveCompany,
    saveBank,
    uploadAvatar,
    requestPasswordCode,
    savePassword,
  }
}
