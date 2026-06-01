import { useState } from 'react'
import { AlertTriangle, CheckCircle2, Loader2, Plus } from 'lucide-react'
import { useAdicionarListaTurma, useDeletarListaTurma, useListasAtivasTurma, useListasInativasTurma } from '../turma-lista.hooks'
import AdicionarListaNaTurmaForm from '../components/AdicionarListaNaTurmaForm'
import ListaCard from '../../../../lista/components/ListaCard'
import ListaCardWithToggle from '../../../../lista/components/ListaCardWithToggle'
import type { AdicionarListaATurmaRequest } from '../turma-lista.types'
import { useListarMinhasListas } from '../../../../lista/lista.hooks'

// ─── Tipos ────────────────────────────────────────────────────────────────────

type Aba = 'LISTAS' | 'ADICIONAR'

interface ListaListasTurmaContainerProps {
  disciplinaId: number
  turmaId: number
  isProfessor: boolean
}

// ─── Grid reutilizável ────────────────────────────────────────────────────────

const GRID = 'grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'

// ─── Aba: Listas ──────────────────────────────────────────────────────────────

function AbaListas({ disciplinaId, turmaId, isProfessor }: ListaListasTurmaContainerProps) {
  const { data: listasAtivas, isLoading: loadingAtivas, isError: errorAtivas } = useListasAtivasTurma(disciplinaId, turmaId)
  const { data: listasInativas, isLoading: loadingInativas, isError: errorInativas } = useListasInativasTurma(disciplinaId, turmaId, { enabled: Boolean(isProfessor) })
  const { mutateAsync: removerListaTurma } = useDeletarListaTurma(disciplinaId, turmaId)

  const listas = isProfessor ? [...(listasAtivas ?? []), ...(listasInativas ?? [])] : (listasAtivas ?? [])
  const isLoading = loadingAtivas || loadingInativas
  const isError = errorAtivas || errorInativas

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-spif-primary animate-pulse gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm font-bold tracking-widest uppercase">Sincronizando listas...</span>
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
          <p className="font-bold text-lg text-spif-text">Falha ao carregar listas</p>
          <p className="text-sm text-spif-secondary">Tente novamente mais tarde.</p>
        </div>
      </div>
    )
  }

  if (listas.length === 0) {
    return (
      <div className="glass-card border-dashed flex flex-col items-center justify-center py-20 text-center gap-4">
        <p className="text-lg font-bold text-spif-text">Nenhuma lista encontrada</p>
        <p className="text-sm text-spif-secondary">Ainda não existem listas vinculadas a esta turma.</p>
      </div>
    )
  }

  return (
    <div className={`${GRID} animate-in fade-in duration-300`}>
      {listas.map((lista) => (
        <ListaCardWithToggle
          key={lista.id}
          lista={lista}
          disciplinaId={disciplinaId}
          turmaId={turmaId}
          isAtivo={Boolean(listasAtivas?.some((item) => item.id === lista.id))}
          isProfessor={isProfessor}
          onRemover={() => removerListaTurma(lista.id)}
        />
      ))}
    </div>
  )
}

// ─── Aba: Atribuir Lista ──────────────────────────────────────────────────────

function AbaAtribuirLista({
  disciplinaId,
  turmaId,
  onSuccess,
}: {
  disciplinaId: number
  turmaId: number
  onSuccess: () => void
}) {
  const [selectedListaId, setSelectedListaId] = useState<number | null>(null)

  const { data: listasRepositorio } = useListarMinhasListas()
  const { data: listasAtivas } = useListasAtivasTurma(disciplinaId, turmaId)
  const { data: listasInativas } = useListasInativasTurma(disciplinaId, turmaId)
  const { mutate: adicionarLista, isPending: isPendingAdicionar } = useAdicionarListaTurma(disciplinaId, turmaId)

  const handleAdicionar = (dados: AdicionarListaATurmaRequest) => {
    adicionarLista(dados, {
      onSuccess: () => setSelectedListaId(null),
    })
    onSuccess()
  }

  const idsVinculados = new Set([
    ...(listasAtivas?.map((l) => l.id) ?? []),
    ...(listasInativas?.map((l) => l.id) ?? []),
  ])

  if (!listasRepositorio || listasRepositorio.length === 0) {
    return (
      <div className="glass-card border-dashed flex flex-col items-center justify-center py-20 text-center gap-4">
        <p className="text-lg font-bold text-spif-text">Nenhuma lista no repositório</p>
        <p className="text-sm text-spif-secondary">Crie listas no seu repositório para vinculá-las aqui.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className={GRID}>
        {listasRepositorio.map((lista) => {
          const jaVinculada = idsVinculados.has(lista.id)
          return (
            <ListaCard
              key={lista.id}
              lista={lista}
              // Botão no mesmo estilo dos demais (lado direito do rodapé)
              action={
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!jaVinculada) setSelectedListaId(lista.id)
                  }}
                  disabled={jaVinculada}
                  className={`
                    flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all
                    ${jaVinculada
                      ? 'opacity-50 cursor-not-allowed bg-spif-primary/10 text-spif-primary border-spif-primary/30'
                      : 'text-spif-secondary border-spif-card-border hover:bg-spif-primary/10 hover:text-spif-primary hover:border-spif-primary/30'
                    }
                  `}
                >
                  {jaVinculada
                    ? <><CheckCircle2 className="w-3.5 h-3.5" /> Vinculada</>
                    : <><Plus className="w-3.5 h-3.5" /> Vincular</>
                  }
                </button>
              }
            />
          )
        })}
      </div>

      {/* Modal de configuração de vínculo */}
      {selectedListaId && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedListaId(null)} />
          <div className="relative w-full max-w-2xl bg-spif-bg border border-spif-card-border rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 md:p-10">
              <AdicionarListaNaTurmaForm
                listaId={selectedListaId}
                onSubmit={handleAdicionar}
                onCancel={() => setSelectedListaId(null)}
                isSubmitting={isPendingAdicionar}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Container Principal ──────────────────────────────────────────────────────

export default function ListaListasTurmaContainer({
  disciplinaId,
  turmaId,
  isProfessor = false,
}: ListaListasTurmaContainerProps) {
  const [abaAtiva, setAbaAtiva] = useState<Aba>('LISTAS')

  const ABAS = [
    { key: 'LISTAS' as const, label: 'Listas' },
    { key: 'ADICIONAR' as const, label: 'Atribuir Lista' },
  ]

  return (
    <div className="space-y-6">
      {isProfessor && (
        <nav className="flex items-center gap-1.5 bg-spif-card p-1.5 rounded-xl border border-spif-card-border shadow-inner w-fit">
          {ABAS.map((aba) => {
            const isActive = abaAtiva === aba.key
            return (
              <button
                key={aba.key}
                onClick={() => setAbaAtiva(aba.key)}
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
      )}

      {abaAtiva === 'LISTAS' && (
        <AbaListas disciplinaId={disciplinaId} turmaId={turmaId} isProfessor={isProfessor} />
      )}
      {abaAtiva === 'ADICIONAR' && isProfessor && (
        <AbaAtribuirLista
          disciplinaId={disciplinaId}
          turmaId={turmaId}
          onSuccess={() => setAbaAtiva('LISTAS')}
        />
      )}
    </div>
  )
}