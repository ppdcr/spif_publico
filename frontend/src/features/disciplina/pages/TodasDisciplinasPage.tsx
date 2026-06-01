import { useState } from 'react'
import { useListarDisciplinas } from '../disciplina.hooks'
import { useMinistrarDisciplina } from '../disciplina-usuario/disciplina-usuario.hooks'
import DisciplinaCard from '../components/DisciplinaCard'
import ConfirmActionModal from '../components/ConfirmActionModal'
import type { DisciplinaResponse } from '../disciplina.types'
import { useAuth } from '../../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Loader2, Search } from 'lucide-react'

export default function TodasDisciplinasPage({ onSuccess }: { onSuccess?: () => void }) {
  const { data: disciplinas, isLoading, isError } = useListarDisciplinas()
  const { role, usuario } = useAuth()
  const navigate = useNavigate()
  
  if (role === 'ROLE_ALUNO') {
    navigate('/minhas-disciplinas')
  }

  const ministrarMutation = useMinistrarDisciplina(usuario!.id)
  const [selectedDisciplina, setSelectedDisciplina] = useState<DisciplinaResponse | null>(null)

  const handleConfirmarMinistrar = () => {
    if (!selectedDisciplina) return

    ministrarMutation.mutate(selectedDisciplina.id, {
      onSuccess: () => {
        setSelectedDisciplina(null);
        onSuccess?.();
      },
    });
  }

  if (isLoading || !disciplinas) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-spif-primary animate-pulse gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm font-bold tracking-widest uppercase">Escaneando banco de dados...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="glass-card flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
          <Search className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold text-lg text-spif-text">Erro ao carregar disciplinas</p>
          <p className="text-sm text-spif-secondary">Não foi possível sincronizar com o servidor.</p>
        </div>
      </div>
    )
  }

  if (disciplinas.length === 0) {
    return (
      <div className="glass-card border-dashed flex flex-col items-center justify-center py-20 text-center gap-4">
          <p className="text-lg font-bold text-spif-text">Nenhuma disciplina cadastrada</p>
          <p className="text-sm text-spif-secondary">Crie uma nova disciplina para começar.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 animate-in fade-in duration-700">
        {disciplinas?.map((d) => (
          <DisciplinaCard
            key={d.id}
            disciplina={d}
            onClick={!d.ministra ? () => setSelectedDisciplina(d) : undefined}
          />
        ))}
      </div>

      <ConfirmActionModal
        isOpen={!!selectedDisciplina}
        titulo={`Ministrar ${selectedDisciplina?.nome}?`}
        mensagem="Ao confirmar, você será registrado como professor responsável por esta disciplina."
        keyword="ministrar"
        confirmLabel="confirmar vínculo"
        isPending={ministrarMutation.isPending}
        onConfirmar={handleConfirmarMinistrar}
        onCancelar={() => setSelectedDisciplina(null)}
      />
    </>
  )
}