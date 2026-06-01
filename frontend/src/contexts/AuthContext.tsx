import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import api, { refreshApi } from '../shared/api.service'
import { authStorage } from '../shared/auth/auth.storage'
import { useLoginUsuario } from '../features/usuario/usuario.hooks'
import {
  jwtPayloadSchema,
  type AuthResponse,
  type Role,
  type UsuarioResponse,
} from '../features/usuario/usuario.types'

// ── Tipos ────────────────────────────────────────────────────────────────────

interface AuthContextType {
  usuario: UsuarioResponse | null
  role: Role | null
  isAuthenticated: boolean
  login: (prontuario: string, senha: string) => Promise<void>
  setUsuarioFromToken: (auth: AuthResponse) => void
  updateUsuario: (usuario: UsuarioResponse) => void
  logout: () => void
}

// ── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ── Helpers puros — fora do componente ───────────────────────────────────────

const parseToken = (accessToken: string): UsuarioResponse => {
  const rawPayload = jwtDecode(accessToken)
  const payload = jwtPayloadSchema.parse(rawPayload)
  return {
    id: Number(payload.sub),
    prontuario: payload.prontuario,
    nickname: payload.nickname,
    email: payload.email,
    role: payload.role,
    dataCriacao: new Date(payload.iat * 1000).toISOString(),
  }
}

const initFromStorage = (): UsuarioResponse | null => {
  try {
    const token = authStorage.getAccessToken()
    if (!token) return null

    const { exp } = jwtDecode(token) as { exp?: number }
    if (!exp || exp * 1000 < Date.now()) {
      authStorage.clear()
      return null
    }

    api.defaults.headers.common.Authorization = `Bearer ${token}`
    return parseToken(token)
  } catch {
    authStorage.clear()
    return null
  }
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const loginMutation = useLoginUsuario()
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [usuario, setUsuario] = useState<UsuarioResponse | null>(initFromStorage)
  const [role, setRole] = useState<Role | null>(() => initFromStorage()?.role ?? null)

  const clearTimer = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current)
  }, [])

  const forceLogout = useCallback(() => {
    clearTimer()
    authStorage.clear()
    delete api.defaults.headers.common.Authorization
    setUsuario(null)
    setRole(null)
    navigate('/login', { replace: true })
  }, [clearTimer, navigate])

  // ── Refresh proativo ──────────────────────────────────────────────────────
  // doRefresh e scheduleRefresh dependem um do outro, então usamos uma ref
  // para quebrar a dependência circular sem precisar de useEffect extra.

  const scheduleRefreshRef = useRef<(token: string) => void>(() => {})

  const doRefresh = useCallback(async () => {
    try {
      const storedRefresh = authStorage.getRefreshToken()
      if (!storedRefresh) throw new Error('Sem refresh token.')

      const { data } = await refreshApi.post<{ accessToken: string; refreshToken: string }>(
        '/usuarios/auth/refresh',
        { refreshToken: storedRefresh }
      )

      authStorage.setTokens(data.accessToken, data.refreshToken)
      api.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`

      const usuarioAtualizado = parseToken(data.accessToken)
      setUsuario(usuarioAtualizado)
      setRole(usuarioAtualizado.role)

      scheduleRefreshRef.current(data.accessToken)
    } catch {
      forceLogout()
    }
  }, [forceLogout])

  const scheduleRefresh = useCallback((accessToken: string) => {
    clearTimer()
    try {
      const { exp } = jwtDecode(accessToken) as { exp?: number }
      if (!exp) return

      const msUntilRefresh = exp * 1000 - Date.now() - 60_000 // 1 min antes

      if (msUntilRefresh <= 0) {
        doRefresh()
        return
      }

      refreshTimerRef.current = setTimeout(doRefresh, msUntilRefresh)
    } catch {
      // token malformado — ignora
    }
  }, [clearTimer, doRefresh])

  // Mantém a ref sincronizada com a versão mais recente do scheduleRefresh
  useEffect(() => {
    scheduleRefreshRef.current = scheduleRefresh
  }, [scheduleRefresh])

  // Agenda ao montar — cobre o caso de F5
  useEffect(() => {
    const token = authStorage.getAccessToken()
    if (token) scheduleRefresh(token)
    return clearTimer
  }, [scheduleRefresh, clearTimer])

  // Escuta logout forçado disparado pelo interceptor de 401 (fallback)
  useEffect(() => {
    window.addEventListener('auth:logout', forceLogout)
    return () => window.removeEventListener('auth:logout', forceLogout)
  }, [forceLogout])

  // Re-avalia o token e força refresh se necessário quando a aba volta a ficar visível (evita deslogar por timers congelados em background)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const token = authStorage.getAccessToken()
        if (token) {
          try {
            const { exp } = jwtDecode(token) as { exp?: number }
            if (exp) {
              const msUntilExpiry = exp * 1000 - Date.now()
              if (msUntilExpiry < 60_000) {
                doRefresh()
              } else {
                scheduleRefresh(token)
              }
            }
          } catch {
            // ignore
          }
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [doRefresh, scheduleRefresh])

  // ── Login / Cadastro ──────────────────────────────────────────────────────

  const setUsuarioFromToken = useCallback((auth: AuthResponse) => {
    authStorage.setTokens(auth.accessToken, auth.refreshToken)
    api.defaults.headers.common.Authorization = `Bearer ${auth.accessToken}`
    const usuarioExtraido = parseToken(auth.accessToken)
    setUsuario(usuarioExtraido)
    setRole(usuarioExtraido.role)
    scheduleRefresh(auth.accessToken)
    navigate('/home', { replace: true })
  }, [scheduleRefresh, navigate])

  const updateUsuario = useCallback((usuarioAtualizado: UsuarioResponse) => {
    setUsuario(usuarioAtualizado)
    setRole(usuarioAtualizado.role)
  }, [])

  const login = useCallback(async (prontuario: string, senha: string) => {
    const auth: AuthResponse = await loginMutation.mutateAsync({ prontuario, senha })
    setUsuarioFromToken(auth)
  }, [loginMutation, setUsuarioFromToken])

  // ── Logout manual ─────────────────────────────────────────────────────────

  const logout = useCallback(() => {
    forceLogout()
  }, [forceLogout])

  // ── Value ─────────────────────────────────────────────────────────────────

  const value = useMemo<AuthContextType>(
    () => ({ usuario, role, isAuthenticated: usuario !== null, login, setUsuarioFromToken, updateUsuario, logout }),
    [usuario, role, login, setUsuarioFromToken, updateUsuario, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser utilizado dentro de <AuthProvider>.')
  return context
}