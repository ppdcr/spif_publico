import { useQuery } from '@tanstack/react-query'
import { problemaService } from '../../../problema/problema.service'
import { useAdicionarProblemasAoNivel, useRemoverProblemaDoNivel } from '../nivel.hooks'
import ListaProblemasContainer from '../../../problema/containers/ListaProblemasContainer'
import { problemaKeys } from '../../../problema/problema.hooks'

interface NivelProblemaSelectorProps {
  percursoId: number
  nivelId: number
}

export default function NivelProblemaSelector({ percursoId, nivelId }: NivelProblemaSelectorProps) {
  // 1. Buscamos os problemas que já estão no nível para marcar como "já adicionados"
  const { data: problemasNoNivel } = useQuery({
    queryKey: problemaKeys.list({ nivelId, pagina: 0, tamanho: 1000 }),
    queryFn: () => problemaService.listarProblemas({ nivelId, pagina: 0, tamanho: 1000 }),
  })

  const { mutate: adicionarProblema } = useAdicionarProblemasAoNivel(percursoId, nivelId)
  const { mutate: removerProblema } = useRemoverProblemaDoNivel(percursoId, nivelId)

  const atribuidosIds = new Set(problemasNoNivel?.content.map(p => p.id) || [])

  const handleAtribuir = (problemaId: number) => {
    adicionarProblema({ problemaIds: [problemaId] })
  }

  const handleRemover = (problemaId: number) => {
    removerProblema(problemaId)
  }

  return (
    <div className="mt-4">
      <ListaProblemasContainer 
        onAtribuir={handleAtribuir}
        onRemover={handleRemover}
        problemasAtribuidosIds={atribuidosIds}
      />
    </div>
  )
}
