import { useState } from "react"
import { type ProblemaFiltroRequest } from "../problema.types"
import { useListarProblemas } from "../problema.hooks"
import FiltroProblemas from "../components/FiltroProblemas"
import ListaProblemas from "../components/ListaProblemas"
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'

type FiltroProps = {
  listaId?: number
  competicaoId?: number 
  nivelId?: number
  problemasAtribuidosIds?: Set<number>
  onAtribuir?: (problemaId: number) => void
  onRemover?: (problemaId: number) => void
  onClickProblem?: (problemaId: number) => void
  filtroAbertoInicial?: boolean
}

export default function ListaProblemasContainer({ listaId, competicaoId, nivelId, problemasAtribuidosIds, onAtribuir, onRemover, onClickProblem, filtroAbertoInicial }: FiltroProps) {
  const [tituloFiltro, setTituloFiltro] = useState('')
  const [dificuldadeFiltro, setDificuldadeFiltro] = useState<number | undefined>()
  const [assuntosFiltro, setAssuntosFiltro] = useState<string[]>([])
  const [filtroAberto, setFiltroAberto] = useState(filtroAbertoInicial)

  const [filtro, setFiltro] = useState<ProblemaFiltroRequest>({
    pagina: 0,
    tamanho: 20,
    listaId,
    competicaoId,
    nivelId
  })

  const problemasQuery = useListarProblemas(filtro)

  // Conta filtros ativos para exibir badge no botão
  const filtrosAtivos =
    (tituloFiltro.trim() ? 1 : 0) +
    (dificuldadeFiltro !== undefined ? 1 : 0) +
    assuntosFiltro.length

  const handleBuscar = () => {
    setFiltro({
      titulo: tituloFiltro.trim() || undefined,
      dificuldade: dificuldadeFiltro,
      assuntos: assuntosFiltro.length ? assuntosFiltro : undefined,
      pagina: 0,
      tamanho: 20,
      listaId,
      competicaoId,
      nivelId
    })
    setFiltroAberto(false)
  }

  const handleLimpar = () => {
    setTituloFiltro('')
    setDificuldadeFiltro(undefined)
    setAssuntosFiltro([])
    setFiltro({
      pagina: 0,
      tamanho: 20,
      listaId,
      competicaoId,
      nivelId
    })
  }

  const handlePageChange = (novaPagina: number) => {
    setFiltro(prev => ({ ...prev, pagina: novaPagina }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-6">

      {/* ── Barra superior: botão de filtro ── */}
      <div className="flex items-center justify-end">
        <button
          onClick={() => setFiltroAberto((a) => !a)}
          className={`
            flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl border transition-all
            ${filtroAberto
              ? 'bg-spif-primary text-spif-bg border-spif-primary shadow-md shadow-spif-primary/20'
              : filtrosAtivos > 0
                ? 'bg-spif-primary/10 border-spif-primary/30 text-spif-primary hover:bg-spif-primary/20'
                : 'bg-spif-card border-spif-card-border text-spif-secondary hover:text-spif-text hover:border-spif-primary/40'
            }
          `}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filtros
          {filtrosAtivos > 0 && (
            <span className={`
              text-[10px] font-black px-1.5 py-0.5 rounded-md min-w-[20px] text-center
              ${filtroAberto ? 'bg-spif-bg/20 text-spif-bg' : 'bg-spif-primary text-spif-bg'}
            `}>
              {filtrosAtivos}
            </span>
          )}
        </button>
      </div>

      {/* ── Painel de Filtros (colapsável) ── */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${filtroAberto ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <FiltroProblemas
          tituloFiltro={tituloFiltro}
          onTituloChange={setTituloFiltro}
          dificuldadeFiltro={dificuldadeFiltro}
          onDificuldadeChange={setDificuldadeFiltro}
          assuntosFiltro={assuntosFiltro}
          onAssuntosChange={setAssuntosFiltro}
          onBuscar={handleBuscar}
          onLimpar={handleLimpar}
        />
      </div>

      {/* ── Lista de Problemas ── */}
      <ListaProblemas
        problems={problemasQuery.data?.content ?? []}
        isLoading={problemasQuery.isLoading}
        isError={problemasQuery.isError}
        problemasAtribuidosIds={problemasAtribuidosIds}
        onAtribuir={onAtribuir}
        onRemover={onRemover}
        onClick={onClickProblem}
      />

      {/* ── Paginação ── */}
      {problemasQuery.data && problemasQuery.data.totalPages > 1 && (
        <div className="mt-12 pt-8 border-t border-spif-card-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-md bg-spif-card border border-spif-card-border text-[10px] font-black tracking-widest uppercase text-spif-primary">
              Página {problemasQuery.data.number + 1}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-spif-secondary opacity-50">
              de {problemasQuery.data.totalPages} totais
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              disabled={problemasQuery.data.first || problemasQuery.isFetching}
              onClick={() => handlePageChange(problemasQuery.data!.number - 1)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-spif-card-border text-xs font-bold uppercase tracking-widest text-spif-secondary hover:text-spif-text hover:border-spif-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>

            <button
              disabled={problemasQuery.data.last || problemasQuery.isFetching}
              onClick={() => handlePageChange(problemasQuery.data!.number + 1)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-spif-card-border text-xs font-bold uppercase tracking-widest text-spif-secondary hover:text-spif-text hover:border-spif-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Próxima <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}