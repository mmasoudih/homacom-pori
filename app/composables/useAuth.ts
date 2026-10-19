interface ApiEnvelope<T = unknown> {
  success?: boolean
  message?: string
  data?: T
}

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

interface ApiErrorPayload {
  message?: string
  errors?: Record<string, string[]>
  error?: Record<string, string[]>
  msg?: string
}

/** Pull a human-readable message out of a Laravel validation error payload. */
export function authErrorMessage(err: unknown, fallback: string): string {
  const payload = (err as { data?: ApiErrorPayload })?.data
  const fieldErrors = payload?.errors ?? payload?.error
  const firstFieldError = fieldErrors
    ? Object.values(fieldErrors).flat().at(0)
    : undefined

  return firstFieldError || payload?.message || payload?.msg || fallback
}

function useApiBase() {
  return useRuntimeConfig().public.apiBase
}

export function useAuth() {
  const sendOtp = async (mobile: string) => {
    const res = await $fetch<ApiEnvelope>(`${useApiBase()}/auth/login`, {
      method: 'POST',
      body: { mobile },
    })

    if (res?.success === false)
      throw new Error(res.message || 'ارسال کد تأیید با خطا مواجه شد. لطفاً دوباره تلاش کنید.')

    return res
  }

  const verifyCode = async (mobile: string, code: string) => {
    try {
      const res = await $fetch<ApiEnvelope<AuthSessionData>>(`${useApiBase()}/auth/verify`, {
        method: 'POST',
        body: { mobile, active_code: code },
      })

      if (res?.success === false || !res.data?.token)
        throw new Error(res?.message || 'کد تأیید صحیح نیست.')

      return res
    }
    catch (err: unknown) {
      throw new Error(authErrorMessage(err, 'کد تأیید صحیح نیست.'), { cause: err })
    }
  }

  /** Login with the mobile number + password pair from the CRM API. */
  const loginWithPassword = async (mobile: string, password: string) => {
    try {
      const res = await $fetch<ApiEnvelope<AuthSessionData>>(`${useApiBase()}/auth/login-with-password`, {
        method: 'POST',
        body: { mobile, password },
      })

      const token = res.data?.token
      if (res?.success === false || !token)
        throw new Error(res?.message || 'ورود با رمز عبور انجام نشد.')

      return { ...res, token, user: res.data?.user }
    }
    catch (err: unknown) {
      throw new Error(authErrorMessage(err, 'ورود با رمز عبور انجام نشد.'), { cause: err })
    }
  }

  /** Ask the backend to send a password-reset code to the mobile number. */
  const requestPasswordReset = async (mobile: string) => {
    try {
      const res = await $fetch<ApiEnvelope>(`${useApiBase()}/auth/forgot-password`, {
        method: 'POST',
        body: { mobile },
      })

      if (res?.success === false)
        throw new Error(res.message || 'ارسال کد بازیابی با خطا مواجه شد.')

      return res
    }
    catch (err: unknown) {
      throw new Error(authErrorMessage(err, 'ارسال کد بازیابی با خطا مواجه شد.'), { cause: err })
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
      const res = await $fetch<ApiEnvelope>(`${useApiBase()}/auth/reset-password`, {
        method: 'POST',
        body: {
          mobile: payload.mobile,
          active_code: payload.code,
          password: payload.password,
          password_confirmation: payload.passwordConfirmation,
        },
      })

      if (res?.success === false)
        throw new Error(res.message || 'تغییر رمز عبور با خطا مواجه شد.')

      return res
    }
    catch (err: unknown) {
      throw new Error(authErrorMessage(err, 'تغییر رمز عبور با خطا مواجه شد.'), { cause: err })
    }
  }

  return { sendOtp, verifyCode, loginWithPassword, requestPasswordReset, resetPassword }
}
