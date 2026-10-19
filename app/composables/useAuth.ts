import { apiErrorMessage, useApi } from '~/composables/useApi'

export { apiErrorMessage as authErrorMessage } from '~/composables/useApi'

interface AuthUser {
  id?: number
  mobile?: string
  nickname?: string | null
  username?: string | null
  avatar?: string | null
}

interface AuthSessionData {
  token: string
  token_expire?: string
  user?: AuthUser
}

export function useAuth() {
  const api = useApi()
  const token = useCookie<string | null>('auth_token')
  const authUser = useCookie<Pick<AuthUser, 'id' | 'mobile' | 'nickname'> | null>('auth_user')

  const sendOtp = async (mobile: string) => {
    const res = await api.post('/auth/login', { mobile })

    if (res?.success === false)
      throw new Error(res.message || 'ارسال کد تأیید با خطا مواجه شد. لطفاً دوباره تلاش کنید.')

    return res
  }

  const verifyCode = async (mobile: string, code: string) => {
    try {
      const res = await api.post<AuthSessionData>('/auth/verify', {
        mobile,
        active_code: code,
      })

      if (res?.success === false || !res.data?.token)
        throw new Error(res?.message || 'کد تأیید صحیح نیست.')

      return res
    }
    catch (err: unknown) {
      throw new Error(apiErrorMessage(err, 'کد تأیید صحیح نیست.'), { cause: err })
    }
  }

  /** Login with the mobile number + password pair from the CRM API. */
  const loginWithPassword = async (mobile: string, password: string) => {
    try {
      const res = await api.post<AuthSessionData>('/auth/login-with-password', {
        mobile,
        password,
      })

      const sessionToken = res.data?.token
      if (res?.success === false || !sessionToken)
        throw new Error(res?.message || 'ورود با رمز عبور انجام نشد.')

      return { ...res, token: sessionToken, user: res.data?.user }
    }
    catch (err: unknown) {
      throw new Error(apiErrorMessage(err, 'ورود با رمز عبور انجام نشد.'), { cause: err })
    }
  }

  /** Ask the backend to send a password-reset code to the mobile number. */
  const requestPasswordReset = async (mobile: string) => {
    try {
      const res = await api.post('/auth/forgot-password', { mobile })

      if (res?.success === false)
        throw new Error(res.message || 'ارسال کد بازیابی با خطا مواجه شد.')

      return res
    }
    catch (err: unknown) {
      throw new Error(apiErrorMessage(err, 'ارسال کد بازیابی با خطا مواجه شد.'), { cause: err })
    }
  }

  /** Complete the reset flow with the 5-digit code received by SMS. */
  const resetPassword = async (payload: {
    mobile: string
    code: string
    password: string
    passwordConfirmation: string
  }) => {
    try {
      const res = await api.post('/auth/reset-password', {
        mobile: payload.mobile,
        active_code: payload.code,
        password: payload.password,
        password_confirmation: payload.passwordConfirmation,
      })

      if (res?.success === false)
        throw new Error(res.message || 'تغییر رمز عبور با خطا مواجه شد.')

      return res
    }
    catch (err: unknown) {
      throw new Error(apiErrorMessage(err, 'تغییر رمز عبور با خطا مواجه شد.'), { cause: err })
    }
  }

  /**
   * Revoke the token on the server, then always clear the local session so a
   * network failure cannot trap the user in a logged-in state.
   */
  const logout = async () => {
    try {
      if (token.value) await api.post('/auth/logout')
    }
    catch {
      // Ignore network/server failures — local sign-out is what matters.
    }
    finally {
      token.value = null
      authUser.value = null
    }
  }

  return { sendOtp, verifyCode, loginWithPassword, requestPasswordReset, resetPassword, logout }
}

export type { AuthSessionData, AuthUser }
