import { useNavigate } from 'react-router-dom'
import { useAtualizarListaTurma } from '../../disciplina/turma/turma-lista/turma-lista.hooks'
import type { ListaProblemasResponse } from '../lista.types'
import ListaCard from './ListaCard'

interface ListaCardWithToggleProps {
    disciplinaId: number,
    turmaId: number,
    isAtivo: boolean,
    lista: ListaProblemasResponse
    isProfessor: boolean
    onRemover?: () => void
}

export default function ListaCardWithToggle({
    disciplinaId,
    turmaId,
    isAtivo,
    lista,
    isProfessor,
    onRemover
}: ListaCardWithToggleProps) {
  const { mutateAsync } = useAtualizarListaTurma(disciplinaId, turmaId)

  const navigate = useNavigate()
  const handleAtualizarAtivo = async (ativo: boolean) => {
    await mutateAsync({ listaId: lista.id, request: { ativo } })
  }
  
  return (
    <ListaCard
        lista={lista}
        isAtivo={isAtivo}
        onAtualizarAtivo={isProfessor ? handleAtualizarAtivo : undefined}
        footerText={lista.porcentagemConclusao ? `Progresso: ${lista.porcentagemConclusao}%` : undefined}
        onClick={() => navigate(`/minhas-disciplinas/${disciplinaId}/minhas-turmas/${turmaId}/listas/${lista.id}`, )}
        onRemover={isProfessor ? onRemover : undefined}
    />
  )
}