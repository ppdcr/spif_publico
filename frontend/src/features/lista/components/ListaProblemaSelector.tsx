import ListaProblemasContainer from "../../problema/containers/ListaProblemasContainer"
import { useListarProblemas } from "../../problema/problema.hooks"
import { useAdicionarProblemaALista } from "../lista.hooks"

interface ListaProblemaSelectorProps {
  listaId: number
}

export default function ListaProblemaSelector({ listaId }: ListaProblemaSelectorProps) {
  const adicionarMutation = useAdicionarProblemaALista(listaId)

  // 1. Busca os problemas que JÁ ESTÃO nesta lista
  const { data: problemasDaLista } = useListarProblemas({ listaId, pagina: 0, tamanho: 1000 })

  // 2. Cria um Set com os IDs
  const atribuidosIds = new Set(problemasDaLista?.content.map((p: any) => p.id) || [])

  const handleAtribuir = (problemaId: number) => {
    adicionarMutation.mutate({ problemaId })
  }

  return (
    <div className="mt-8">
      <ListaProblemasContainer 
        onAtribuir={handleAtribuir} 
        problemasAtribuidosIds={atribuidosIds}
      /> 
    </div>
  )
}
