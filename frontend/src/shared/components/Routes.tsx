import { Navigate, Outlet, useLocation, useMatch } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Sidebar from './SidebarPrincipal'
import type { Role } from '../auth/auth.types'
import { WebSocketProvider } from '../../contexts/WebSockerContext'
import { useChatWebSocket, useListarConversas } from '../../features/mensagem/mensagem.hooks'
import { type ConversaResponse } from '../../features/mensagem/mensagem.types'
import Navbar from './Navbar'

// ── PrivateRoute ──────────────────────────────────────────────────────────────

export function PrivateRoute() {
  const { isAuthenticated, role, logout } = useAuth()

  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return (
    <WebSocketProvider>
      <PrivateRouteContent role={role} logout={logout} />
    </WebSocketProvider>
  )
}

function PrivateRouteContent({ role, logout }: { role: Role | null; logout: () => void }) {
  // Detecta qual chat está aberto — useMatch funciona em qualquer nível do router
  const chatMatch = useMatch('/minhas-conversas/:id')
  const activeChatId = chatMatch?.params.id ? Number(chatMatch.params.id) : null

  // ÚNICA chamada do hook em toda a aplicação
  useChatWebSocket(activeChatId)
 
  const { data: conversas } = useListarConversas()

  const totalNaoLidas =
    conversas?.reduce(
      (acc: number, conv: ConversaResponse) => acc + (conv.qtdNaoLidas || 0),
      0
    ) || 0

  const menu = [
    { label: 'Ranking', to: '/home' },
    { label: 'Problemas', to: '/problemas' },
    { label: 'Disciplinas', to: '/minhas-disciplinas' },
    { label: 'Percursos', to: '/percursos' },
    { label: 'Competições', to: '/competicoes' },
    ...(role === 'ROLE_PROFESSOR' ? [{ label: 'Minhas Listas', to: '/minhas-listas' }] : []),
    {
      label: 'Conversas',
      to: '/minhas-conversas',
      badge: totalNaoLidas,
    },
  ]

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar navLinks={menu} logout={logout} />
      {/* Antes: overflow-auto — causava scroll externo e altura indefinida */}
      {/* Depois: overflow-hidden + h-full — cada página controla seu próprio scroll */}
      <div className="flex-1 overflow-auto h-full">
        <Outlet />
      </div>
    </div>
  )
}

// ── PublicRoute ───────────────────────────────────────────────────────────────

export function PublicRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (isAuthenticated) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/home"
    return <Navigate to={from} replace />
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      <Navbar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}

// ── ProfessorRoute ────────────────────────────────────────────────────────────

export function ProfessorRoute() {
  const { role } = useAuth()

  if (role === 'ROLE_ALUNO') {
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}

// ── DisciplinaRoute ───────────────────────────────────────────────────────────
import { useParams } from 'react-router-dom'
import { useMinhasDisciplinas } from '../../features/disciplina/disciplina-usuario/disciplina-usuario.hooks'
import { Loader2 } from 'lucide-react'

export function DisciplinaRoute() {
  const { id, disciplinaId, disciplinaIdParam } = useParams()
  const currentDisciplinaId = Number(id || disciplinaId || disciplinaIdParam)
  
  const { usuario } = useAuth()
  const { data: disciplinas, isLoading } = useMinhasDisciplinas(usuario!.id)

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-spif-bg text-spif-primary animate-pulse gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="tracking-widest uppercase text-sm font-bold">Verificando acesso...</span>
      </div>
    )
  }

  // Verifica se a disciplina existe na lista de disciplinas ativas do usuário
  const isEnrolled = disciplinas?.some(d => d.id === currentDisciplinaId)

  // Se não tem acesso ou ID inválido, redireciona para as minhas disciplinas
  if (!isEnrolled || isNaN(currentDisciplinaId)) {
    return <Navigate to="/minhas-disciplinas" replace />
  }

  return <Outlet />
}

// ── TurmaRoute ───────────────────────────────────────────────────────────
import { useMinhasTurmas } from '../../features/disciplina/turma/turma-usuario/turma-usuario.hooks'

export function TurmaRoute() {
  const { disciplinaId, disciplinaIdParam, turmaId, turmaIdParam } = useParams()
  const currentDisciplinaId = Number(disciplinaId || disciplinaIdParam)
  const currentTurmaId = Number(turmaId || turmaIdParam)
  
  const { data: turmas, isLoading } = useMinhasTurmas(currentDisciplinaId)

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-spif-bg text-spif-primary animate-pulse gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="tracking-widest uppercase text-sm font-bold">Verificando acesso à turma...</span>
      </div>
    )
  }

  // Verifica se a turma existe na lista de turmas ativas do usuário
  const isEnrolled = turmas?.some((t: any) => t.id === currentTurmaId)

  // Se não tem acesso ou ID inválido, redireciona para a página da disciplina
  if (!isEnrolled || isNaN(currentTurmaId)) {
    return <Navigate to={`/minhas-disciplinas/${currentDisciplinaId}`} replace />
  }

  return <Outlet />
}