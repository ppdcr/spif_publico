import { type ProblemaResumoResponse } from '../problema.types'
import ProblemaCard from './ProblemaCard'
import { AlertTriangle, Loader2 } from 'lucide-react'

interface ListaProblemasProps {
  problems: ProblemaResumoResponse[]
  isLoading: boolean
  isError: boolean
  problemasAtribuidosIds?: Set<number>
  onAtribuir?: (problemaId: number) => void
  onRemover?: (problemaId: number) => void
  onClick?: (problemaId: number) => void
}

export default function ListaProblemas({
  problems,
  isLoading,
  isError,
  problemasAtribuidosIds,
  onAtribuir,
  onRemover,
  onClick
}: ListaProblemasProps) {

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-spif-primary animate-pulse gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm font-bold tracking-widest uppercase">Carregando desafios...</span>
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
          <p className="font-bold text-lg text-spif-text">
            Erro ao carregar problemas
          </p>
          <p className="text-sm text-spif-secondary">
            Tente novamente mais tarde.
          </p>
        </div>
      </div>
    )
  }

  if (problems.length === 0) {
    return (
      <div className="glass-card border-dashed flex flex-col items-center justify-center py-20 text-center gap-4">
        <p className="text-lg font-bold text-spif-text">
          Nenhum problema encontrado
        </p>
        <p className="text-sm text-spif-secondary">
          Tente ajustar seus filtros.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {problems.map((problem) => (
          <ProblemaCard
            key={problem.id}
            problema={problem}
            isAtribuido={problemasAtribuidosIds?.has(problem.id)}
            onAtribuir={onAtribuir}
            onRemover={onRemover}
            onClick={onClick ? () => onClick(problem.id) : undefined}
          />
        ))}
      </div>
    </div>
  )
}
