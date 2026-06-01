import axios from 'axios'
import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { authStorage } from './auth/auth.storage'

const BASE_URL = import.meta.env.VITE_BACKEND_URL

const AUTH_ROUTES = ['/usuarios/auth/login', '/usuarios/auth/refresh']

// ── Instância principal ──────────────────────────────────────────────────────

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ── Instância isolada para o refresh — sem interceptors ──────────────────────
// Usar api.post no refresh causaria loop: 401 → refresh → interceptor → 401...

export const refreshApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ── Interceptor de REQUEST: injeta Access Token ──────────────────────────────

api.interceptors.request.use((config) => {
  const token = authStorage.getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Fila de requisições aguardando o refresh ─────────────────────────────────

type QueueItem = {
  resolve: (token: string) => void
  reject: (err: unknown) => void
}

let isRefreshing = false
let requestQueue: QueueItem[] = []

const processQueue = (error: unknown, newToken: string | null = null): void => {
  for (const { resolve, reject } of requestQueue) {
    if (error) reject(error)
    else if (newToken) resolve(newToken)
  }
  requestQueue = []
}

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean }

// ── Interceptor de RESPONSE: fallback de 401 ────────────────────────────────
// O refresh proativo no AuthContext cobre 99% dos casos.
// Este interceptor é o fallback para edge cases (aba em segundo plano, etc).

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined

    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error)
    }

    const requestUrl = originalRequest?.url ?? ''
    if (AUTH_ROUTES.some((route) => requestUrl.includes(route))) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        requestQueue.push({ resolve, reject })
      }).then((token) => {
        originalRequest!.headers.Authorization = `Bearer ${token}`
        return api(originalRequest!)
      })
    }

    originalRequest!._retry = true
    isRefreshing = true

    try {
      const storedRefresh = authStorage.getRefreshToken()
      if (!storedRefresh) throw new Error('Refresh token não encontrado.')

      const { data } = await refreshApi.post<{ accessToken: string; refreshToken: string }>(
        '/usuarios/auth/refresh',
        { refreshToken: storedRefresh }
      )

      authStorage.setTokens(data.accessToken, data.refreshToken)
      api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`

      processQueue(null, data.accessToken)

      originalRequest!.headers.Authorization = `Bearer ${data.accessToken}`
      return api(originalRequest!)
    } catch (refreshError) {
      processQueue(refreshError)
      authStorage.clear()
      delete api.defaults.headers.common.Authorization
      // Dispara evento para o AuthContext limpar o estado do React
      window.dispatchEvent(new Event('auth:logout'))
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default api