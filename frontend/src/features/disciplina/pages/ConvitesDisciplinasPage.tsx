import { useMeusConvites, useAceitarConvite } from '../disciplina-usuario/disciplina-usuario.hooks'
import DisciplinaCard from '../components/DisciplinaCard'
import { useAuth } from '../../../contexts/AuthContext'
import { Loader2, Search, Mail, CheckCircle2 } from 'lucide-react'

export default function ConvitesDisciplinasPage({ onSuccess }: { onSuccess?: () => void }) {
  const { usuario } = useAuth()
  
  const aceitarMutation = useAceitarConvite(usuario!.id)

  const { data: convites, isLoading, isError } = useMeusConvites(usuario!.id)

  const handleAceitar = (disciplinaId: number) => {
    aceitarMutation.mutate(disciplinaId, {
      onSuccess: () => {
        onSuccess?.()
      }
    })
  }

  if (isLoading || !convites) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-spif-primary animate-pulse gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm font-bold tracking-widest uppercase">Buscando convites pendentes...</span>
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
          <p className="font-bold text-lg text-spif-text">Erro ao carregar convites</p>
          <p className="text-sm text-spif-secondary">Não foi possível sincronizar com o servidor.</p>
        </div>
      </div>
    )
  }

  if (convites.length === 0) {
    return (
      <div className="glass-card border-dashed flex flex-col items-center justify-center py-20 text-center gap-4">
        <p className="text-lg font-bold text-spif-text">Nenhum convite pendente</p>
        <p className="text-sm text-spif-secondary">Você não recebeu convites para novas disciplinas.</p>
      </div>
    )
  }
  
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 animate-in fade-in duration-700">
      {convites.map((d) => (
        <DisciplinaCard
          key={d.id}
          disciplina={d}
          action={
            <button
              onClick={() => handleAceitar(d.id)}
              disabled={aceitarMutation.isPending}
              className="flex items-center gap-2 px-6 py-2.5 bg-spif-primary text-spif-bg text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-spif-primary-hover disabled:opacity-50 transition-all shadow-lg shadow-spif-primary/20 active:scale-95"
            >
              {aceitarMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><CheckCircle2 className="w-3.5 h-3.5" /> Aceitar</>}
            </button>
          }
        />
      ))}
    </div>
  )
}