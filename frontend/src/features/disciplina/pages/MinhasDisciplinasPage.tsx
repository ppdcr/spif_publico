import { useMinhasDisciplinas } from '../disciplina-usuario/disciplina-usuario.hooks'
import DisciplinaCard from '../components/DisciplinaCard'
import { useAuth } from '../../../contexts/AuthContext'
import { useNavigate } from 'react-router'
import { Loader2, AlertTriangle, } from 'lucide-react'

export default function MinhasDisciplinasPage() {
  const { usuario } = useAuth()
  const navigate = useNavigate()

  const { data: disciplinas, isLoading, isError } = useMinhasDisciplinas(usuario!.id)

  const handleNavigate = (id: number) => {
    navigate(`/minhas-disciplinas/${id}`)
  }

  if (isLoading || !disciplinas) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-spif-primary animate-pulse gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm font-bold tracking-widest uppercase">Buscando matrículas...</span>
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
            Falha ao carregar matrículas
          </p>
          <p className="text-sm text-spif-secondary">
            Tente novamente mais tarde.
          </p>
        </div>
      </div>
    )
  }

  if (disciplinas.length === 0) {
    return (
      <div className="glass-card border-dashed flex flex-col items-center justify-center py-20 text-center gap-4">
        <p className="text-lg font-bold text-spif-text">
          Nenhuma disciplina encontrada
        </p>
        <p className="text-sm text-spif-secondary">
          Você ainda não está vinculado a nenhuma disciplina.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {disciplinas?.map((d) => (
        <DisciplinaCard
          key={d.id}
          disciplina={d}
          onClick={() => handleNavigate(d.id)}
        />
      ))}
    </div>
  )
}