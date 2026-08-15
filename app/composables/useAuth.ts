interface SendOtpResponse {
  result: number
  msg?: string
}

interface VerifyCodeResponse {
  result: number
  msg?: string
  data?: {
    token: string
    user_id: number
    mobile: string
  }
}

interface ApiError {
  error?: Record<string, string[]>
  msg?: string
}

function useApiBase() {
  return useRuntimeConfig().public.apiBase
}

export function useAuth() {
  const sendOtp = async (mobile: string) => {
    const res = await $fetch<SendOtpResponse>(`${useApiBase()}/login-with-mobile`, {
      method: 'POST',
      body: { mobile },
    })

    if (res.result !== 1)
      throw new Error('ارسال کد تأیید با خطا مواجه شد. لطفاً دوباره تلاش کنید.')

    return res
  }

  const verifyCode = async (mobile: string, code: string) => {
    try {
      const res = await $fetch<VerifyCodeResponse>(`${useApiBase()}/mobile-verify-code`, {
        method: 'POST',
        body: { mobile, code },
      })

      if (res.result !== 1)
        throw new Error('کد تأیید صحیح نیست.')

      return res
    }
    catch (err: any) {
      const message = err?.data?.error?.code?.at(0) || err?.data?.msg || 'کد تأیید صحیح نیست.'
      throw new Error(message)
    }
  }

  return { sendOtp, verifyCode }
}