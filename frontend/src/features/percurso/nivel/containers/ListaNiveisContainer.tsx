import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Loader2 } from 'lucide-react'
import CriarNivelForm from '../components/CriarNivelForm'
import { useListarNiveis } from '../nivel.hooks'
import NivelCard from '../components/NivelCard'

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Aba = 'NIVEIS' | 'CRIAR'

interface ListaNiveisContainerProps {
  percursoId: number
  isProfessor?: boolean
}

// ─── Aba: Niveis ───────────────────────────────────────────────────────

function AbaNiveis({ percursoId, isProfessor }: ListaNiveisContainerProps) {
  const navigate = useNavigate()

  const { data: niveis, isLoading, isError } = useListarNiveis(percursoId)

  if (isLoading || !niveis) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-spif-primary animate-pulse gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm font-bold tracking-widest uppercase">Sincronizando níveis...</span>
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
          <p className="font-bold text-lg text-spif-text">Falha ao carregar níveis</p>
          <p className="text-sm text-spif-secondary">Tente novamente mais tarde.</p>
        </div>
      </div>
    )
  }

  if (niveis.length === 0) {
    return (
      <div className="glass-card border-dashed flex flex-col items-center justify-center py-20 text-center gap-4">
        <p className="text-lg font-bold text-spif-text">Nenhum nível encontrado</p>
        <p className="text-sm text-spif-secondary">
          Esse percurso ainda não possui níveis.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
        {(() => {
            const sortedNiveis = [...(niveis || [])].sort((a, b) => a.ordem - b.ordem)
            let previousCompleted = true

            return sortedNiveis.map((nivel) => {
                const isLocked = !isProfessor && !previousCompleted
                if (nivel.porcentagemConclusao !== null && nivel.porcentagemConclusao < 1) {
                previousCompleted = false
                }
                return (
                <NivelCard
                    key={nivel.id}
                    nivel={nivel}
                    isLocked={isLocked}
                    onClick={() => navigate(`/percursos/${percursoId}/niveis/${nivel.id}`)}
                />
                )
            })
            })()}
    </div>
  )
}


// ─── Aba: Criar Nivel ─────────────────────────────────────────────────────────

function AbaCriarNivel({ 
  percursoId, 
  onSuccess 
}: { 
  percursoId: number
  onSuccess: () => void 
}) {

  return (
    <div className="glass-card p-8">
        <CriarNivelForm 
          percursoId={percursoId}
          onSuccess={onSuccess}
        />
    </div>
  )
}

export default function ListaNiveisContainer({ 
  percursoId, 
  isProfessor = false 
}: ListaNiveisContainerProps) {
  const [abaAtiva, setAbaAtiva] = useState<Aba>('NIVEIS')

  // Determinar quais abas mostrar
  const temAbaCriar = isProfessor
  const ABAS = [
    { key: 'NIVEIS' as const, label: 'Níveis'},
    { key: 'CRIAR' as const, label: 'Novo Nível'},
  ]

  return (
    <div className="space-y-6">
      {/* ── Abas ── */}
      {isProfessor && 
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
      }

      {/* ── Conteúdo ── */}
      {abaAtiva === 'NIVEIS' && (
        <AbaNiveis percursoId={percursoId} isProfessor={isProfessor} />
      )}
      {abaAtiva === 'CRIAR' && temAbaCriar && (
        <AbaCriarNivel percursoId={percursoId} onSuccess={() => setAbaAtiva('NIVEIS')} />
      )}
    </div>
  )
}
