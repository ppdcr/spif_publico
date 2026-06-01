import { useQuery } from '@tanstack/react-query'
import { problemaService } from '../../problema/problema.service'
import { problemaKeys } from '../../problema/problema.hooks'
import { useAdicionarProblemasACompeticao, useRemoverProblemaDaCompeticao } from '../competicao.hooks'
import ListaProblemasContainer from '../../problema/containers/ListaProblemasContainer'

interface CompeticaoProblemaSelectorProps {
  competicaoId: number
}

export default function CompeticaoProblemaSelector({ competicaoId }: CompeticaoProblemaSelectorProps) {
  // 1. Buscamos os problemas que já estão na competição para marcar como "já adicionados"
  const { data: problemasNaCompeticao } = useQuery({
    queryKey: problemaKeys.list({ competicaoId, pagina: 0, tamanho: 1000 }),
    queryFn: () => problemaService.listarProblemas({ competicaoId, pagina: 0, tamanho: 1000 }),
  })

  const { mutate: adicionarProblema } = useAdicionarProblemasACompeticao(competicaoId)
  const { mutate: removerProblema } = useRemoverProblemaDaCompeticao(competicaoId)

  const atribuidosIds = new Set(problemasNaCompeticao?.content.map(p => p.id) || [])

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
