import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { useMinhasTurmas, useMeusConvitesTurma, useAceitarConviteTurma } from '../turma-usuario/turma-usuario.hooks'
import TurmaCard from '../components/TurmaCard'
import CriarTurmaForm from '../components/CriarTurmaForm'

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Aba = 'MINHAS_TURMAS' | 'CONVITES' | 'CRIAR'

interface ListaTurmasContainerProps {
  disciplinaId: number
  isProfessor?: boolean
}

// ─── Aba: Minhas Turmas ───────────────────────────────────────────────────────

function AbaMinhasTurmas({ disciplinaId }: { disciplinaId: number }) {
  const navigate = useNavigate()
  const { data: turmas, isLoading, isError } = useMinhasTurmas(disciplinaId)

  if (isLoading || !turmas) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-spif-primary animate-pulse gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm font-bold tracking-widest uppercase">Sincronizando turmas...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="glass-card flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold text-lg text-spif-text">Falha ao carregar turmas</p>
          <p className="text-sm text-spif-secondary">Tente novamente mais tarde.</p>
        </div>
      </div>
    )
  }

  if (turmas.length === 0) {
    return (
      <div className="glass-card border-dashed flex flex-col items-center justify-center py-20 text-center gap-4">
        <p className="text-lg font-bold text-spif-text">Nenhuma turma encontrada</p>
        <p className="text-sm text-spif-secondary">
          Você ainda não está vinculado a nenhuma turma desta disciplina.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {turmas.map((turma) => (
        <TurmaCard 
          key={turma.id} 
          turma={turma}
          onClick={() => navigate(`/minhas-disciplinas/${disciplinaId}/minhas-turmas/${turma.id}`)}
        />
      ))}
    </div>
  )
}

// ─── Aba: Convites ────────────────────────────────────────────────────────────

function AbaConvites({ disciplinaId, onSuccess }: { disciplinaId: number; onSuccess?: () => void }) {
  const { data: convites, isLoading, isError } = useMeusConvitesTurma(disciplinaId)
  const aceitarMutation = useAceitarConviteTurma(disciplinaId)

  const handleAceitar = (turmaId: number) => {
    aceitarMutation.mutate(turmaId, {
      onSuccess: () => {
        onSuccess?.()
      },
    })
  }

  if (isLoading || !convites) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-spif-primary animate-pulse gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm font-bold tracking-widest uppercase">Carregando convites...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="glass-card flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold text-lg text-spif-text">Erro ao carregar convites</p>
          <p className="text-sm text-spif-secondary">Tente novamente mais tarde.</p>
        </div>
      </div>
    )
  }

  if (convites.length === 0) {
    return (
      <div className="glass-card border-dashed flex flex-col items-center justify-center py-20 text-center gap-4">
        <p className="text-lg font-bold text-spif-text">Nenhum convite encontrado</p>
        <p className="text-sm text-spif-secondary">Você ainda não recebeu nenhum convite para turmas.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {convites.map((turma) => (
        <TurmaCard 
          key={turma.id} 
          turma={turma} 
          isConvite={true}
          onAceitar={handleAceitar}
        />
      ))}
    </div>
  )
}

// ─── Aba: Criar Turma ─────────────────────────────────────────────────────────

function AbaCriarTurma({ 
  disciplinaId, 
  onSuccess 
}: { 
  disciplinaId: number
  onSuccess: () => void 
}) {

  return (
    <div className="glass-card p-8">
        <CriarTurmaForm 
          disciplinaId={disciplinaId}
          onSuccess={onSuccess}
        />
    </div>
  )
}

// ─── Aba: Convites QR Code ────────────────────────────────────────────────────


export default function ListaTurmasContainer({ 
  disciplinaId, 
  isProfessor = false 
}: ListaTurmasContainerProps) {
  const [abaAtiva, setAbaAtiva] = useState<Aba>('MINHAS_TURMAS')

  // Determinar quais abas mostrar
  const temAbaCriar = isProfessor
  const ABAS = [
    { key: 'MINHAS_TURMAS' as const, label: 'Minhas Turmas', show: true },
    { key: 'CONVITES' as const, label: 'Convites', show: true },
    { key: 'CRIAR' as const, label: 'Nova Turma', show: temAbaCriar },
  ].filter((t) => t.show)

  const handleRefresh = () => {
    // Força refresh das queries ao criar/aceitar turma
    setAbaAtiva('MINHAS_TURMAS')
  }

  return (
    <div className="space-y-6">
      {/* ── Abas ── */}
      <nav className="flex items-center gap-1.5 bg-spif-card p-1.5 rounded-xl border border-spif-card-border shadow-inner w-fit">
        {ABAS.map((aba) => {
          const isActive = abaAtiva === aba.key
          return (
            <button
              key={aba.key}
              onClick={() => setAbaAtiva(aba.key as Aba)}
              className={`
                flex items-center gap-2 px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all duration-200
                ${isActive
                  ? 'bg-spif-primary text-spif-bg shadow-md shadow-spif-primary/20'
                  : 'text-spif-secondary hover:text-spif-text hover:bg-spif-bg/50'
                }
              `}
            >
              {aba.label}
            </button>
          )
        })}
      </nav>

      {/* ── Conteúdo ── */}
      {abaAtiva === 'MINHAS_TURMAS' && (
        <AbaMinhasTurmas disciplinaId={disciplinaId} />
      )}
      {abaAtiva === 'CONVITES' && (
        <AbaConvites disciplinaId={disciplinaId} onSuccess={handleRefresh} />
      )}
      {abaAtiva === 'CRIAR' && temAbaCriar && (
        <AbaCriarTurma disciplinaId={disciplinaId} onSuccess={handleRefresh} />
      )}
    </div>
  )
}
