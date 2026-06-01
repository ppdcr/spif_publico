const STORAGE_KEY_ACCESS = '@spif:accessToken' as const
const STORAGE_KEY_REFRESH = '@spif:refreshToken' as const

export const authStorage = {
  getAccessToken: (): string | null =>
    localStorage.getItem(STORAGE_KEY_ACCESS),

  getRefreshToken: (): string | null =>
    localStorage.getItem(STORAGE_KEY_REFRESH),

  setTokens: (accessToken: string, refreshToken: string): void => {
    localStorage.setItem(STORAGE_KEY_ACCESS, accessToken)
    localStorage.setItem(STORAGE_KEY_REFRESH, refreshToken)
  },

  clear: (): void => {
    localStorage.removeItem(STORAGE_KEY_ACCESS)
    localStorage.removeItem(STORAGE_KEY_REFRESH)
  },
} as const