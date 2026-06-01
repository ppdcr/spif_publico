import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { problemaService } from '../../../problema/problema.service'
import { problemaKeys } from '../../../problema/problema.hooks'
import { Loader2, Target } from 'lucide-react'
import { useRemoverProblemaDoNivel } from '../nivel.hooks'
import ProblemaCard from '../../../problema/components/ProblemaCard'

interface NivelProblemasListProps {
  percursoId: number
  nivelId: number
  isProfessor: boolean
}

export default function NivelProblemasList({ percursoId, nivelId, isProfessor }: NivelProblemasListProps) {
  const navigate = useNavigate()
  const { data: paginaProblemas, isLoading, isError } = useQuery({
    queryKey: problemaKeys.list({ nivelId, pagina: 0, tamanho: 100 }),
    queryFn: () => problemaService.listarProblemas({ nivelId, pagina: 0, tamanho: 100 }),
  })

  const { mutate: removerProblema } = useRemoverProblemaDoNivel(percursoId, nivelId)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-spif-primary animate-pulse gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm font-bold tracking-widest uppercase">Carregando desafios...</span>
      </div>
    )
  }

  if (isError || !paginaProblemas) {
    return (
      <div className="glass-card flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
          <Target className="w-6 h-6" />
        </div>
        <p className="font-bold text-spif-text">Erro ao carregar problemas do nível.</p>
      </div>
    )
  }

  const problemas = paginaProblemas.content

  if (problemas.length === 0) {
    return (
      <div className="glass-card border-dashed flex flex-col items-center justify-center py-24 text-center gap-6">
        <div className="w-16 h-16 rounded-full bg-spif-card flex items-center justify-center text-spif-secondary/30">
          <Target className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-black text-spif-text uppercase tracking-tight">Nenhum desafio vinculado</p>
          <p className="text-sm text-spif-secondary">
            {isProfessor
              ? 'Vá na aba "Adicionar" para vincular problemas a este nível.'
              : 'Este nível ainda não possui problemas cadastrados.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 animate-in fade-in duration-700">
      {problemas.map((p) => (
        <ProblemaCard
          key={p.id}
          problema={p}
          onRemover={isProfessor ? () => removerProblema(p.id) : undefined}
          onClick={() => navigate(`/percursos/${percursoId}/niveis/${nivelId}/problemas/${p.id}`)}
        />
      ))}
    </div>
  )
}
