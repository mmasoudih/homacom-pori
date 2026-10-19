import type { AccountProfile, LegalInfo } from '~/data/account'
import { toEnglishDigits, toPersianDigits } from '~/utils/format'
import { isoToJalali, jalaliToIso } from '~/utils/jalali'

interface ApiProfile {
  id: number
  fname?: string | null
  lname?: string | null
  email?: string | null
  code_melli?: string | null
  birthday?: string | null
  type?: string | null
  company_name?: string | null
  company_register_id?: string | null
  company_national_code?: string | null
  company_economic_code?: string | null
  company_ceo?: string | null
  company_tel?: string | null
}

function emptyProfile(): AccountProfile {
  return {
    firstName: '',
    lastName: '',
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

function mapProfile(data: ApiProfile): AccountProfile {
  const jalali = isoToJalali(data.birthday)
  const legal: LegalInfo | null = data.company_name
    ? {
        organizationName: data.company_name,
        nationalId: data.company_national_code ?? '',
        registrationId: data.company_register_id ?? '',
        phone: data.company_tel ?? '',
        city: '',
        province: '',
        postalAddress: '',
        economicCode: data.company_economic_code ?? '',
        ceo: data.company_ceo ?? '',
      }
    : null

  return {
    firstName: data.fname ?? '',
    lastName: data.lname ?? '',
    birthYear: jalali ? persianPart(jalali.jy) : '',
    birthMonth: jalali ? persianPart(jalali.jm, true) : '',
    birthDay: jalali ? persianPart(jalali.jd, true) : '',
    birthDate: jalali
      ? `${persianPart(jalali.jy)}/${persianPart(jalali.jm, true)}/${persianPart(jalali.jd, true)}`
      : '',
    nationalId: data.code_melli ?? '',
    email: data.email ?? '',
    cardNumber: '',
    shebaNumber: '',
    legal,
    hasPassword: false,
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

  const { data, pending, refresh } = useAsyncData<ApiProfile | null>(
    'user-profile',
    async () => {
      try {
        const res = await api.get<ApiProfile>('/shop/user/profile/me')
        return res.data ?? null
      }
      catch {
        return null
      }
    },
    { default: () => null },
  )

  const profile = ref<AccountProfile>(emptyProfile())
  watch(data, (value) => {
    if (value) profile.value = mapProfile(value)
  }, { immediate: true })

  const loaded = computed(() => !pending.value)

  async function load() {
    if (!data.value) await refresh()
  }

  async function saveName(payload: { firstName: string, lastName: string }) {
    await api.put('/shop/user/profile/base-information', {
      fname: payload.firstName,
      lname: payload.lastName,
    })
    if (data.value) data.value = { ...data.value, fname: payload.firstName, lname: payload.lastName }
  }

  async function saveEmail(payload: { email: string }) {
    await api.put('/shop/user/profile/email', { email: payload.email })
    if (data.value) data.value = { ...data.value, email: payload.email }
  }

  async function saveNationalId(payload: { nationalId: string }) {
    await api.put('/shop/user/profile/national-code', { code_melli: payload.nationalId })
    if (data.value) data.value = { ...data.value, code_melli: payload.nationalId }
  }

  async function saveBirthdate(payload: { year: string, month: string, day: string, birthDate: string }) {
    const year = Number(toEnglishDigits(payload.year))
    const month = Number(toEnglishDigits(payload.month))
    const day = Number(toEnglishDigits(payload.day))

    if (year && month && day) {
      const birthday = jalaliToIso(year, month, day)
      await api.put('/shop/user/profile/birthday', { birthday })
      if (data.value) data.value = { ...data.value, birthday }
    }
  }

  async function saveCompany(payload: LegalInfo) {
    await api.put('/shop/user/profile/company-information', {
      company_name: payload.organizationName,
      company_register_id: payload.registrationId,
      company_national_code: payload.nationalId,
      company_economic_code: payload.economicCode ?? '',
      company_ceo: payload.ceo ?? `${profile.value.firstName} ${profile.value.lastName}`.trim(),
      company_tel: payload.phone,
    })
    if (data.value) {
      data.value = {
        ...data.value,
        company_name: payload.organizationName,
        company_register_id: payload.registrationId,
        company_national_code: payload.nationalId,
        company_economic_code: payload.economicCode ?? '',
        company_ceo: payload.ceo ?? '',
        company_tel: payload.phone,
      }
    }
  }

  return { profile, pending, loaded, load, saveName, saveEmail, saveNationalId, saveBirthdate, saveCompany }
}
