import type { AccountProfile, LegalInfo } from '~/data/account'
import { accountProfile } from '~/data/account'
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
        postalAddress: data.company_economic_code ?? '',
      }
    : null

  return {
    ...accountProfile,
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

/** Read + update the authenticated user's profile. */
export function useUserProfile() {
  const api = useApi()
  const profile = ref<AccountProfile>({
    ...accountProfile,
    legal: accountProfile.legal ? { ...accountProfile.legal } : null,
  })
  const pending = ref(false)
  const loaded = ref(false)

  async function load() {
    pending.value = true
    try {
      const res = await api.get<ApiProfile>('/shop/user/profile/me')
      if (res.data) profile.value = mapProfile(res.data)
      loaded.value = true
    }
    catch {
      // Keep the designed fallback profile when the API is unavailable.
    }
    finally {
      pending.value = false
    }
  }

  async function saveName(payload: { firstName: string, lastName: string }) {
    await api.put('/shop/user/profile/base-information', {
      fname: payload.firstName,
      lname: payload.lastName,
    })
    profile.value.firstName = payload.firstName
    profile.value.lastName = payload.lastName
  }

  async function saveEmail(payload: { email: string }) {
    await api.put('/shop/user/profile/email', { email: payload.email })
    profile.value.email = payload.email
  }

  async function saveNationalId(payload: { nationalId: string }) {
    await api.put('/shop/user/profile/national-code', { code_melli: payload.nationalId })
    profile.value.nationalId = payload.nationalId
  }

  async function saveBirthdate(payload: { year: string, month: string, day: string, birthDate: string }) {
    const year = Number(toEnglishDigits(payload.year))
    const month = Number(toEnglishDigits(payload.month))
    const day = Number(toEnglishDigits(payload.day))

    if (year && month && day)
      await api.put('/shop/user/profile/birthday', { birthday: jalaliToIso(year, month, day) })

    profile.value.birthYear = payload.year
    profile.value.birthMonth = payload.month
    profile.value.birthDay = payload.day
    profile.value.birthDate = payload.birthDate
  }

  return { profile, pending, loaded, load, saveName, saveEmail, saveNationalId, saveBirthdate }
}
