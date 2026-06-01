import TurmaCard from '../components/TurmaCard';
import { useMeusConvitesTurma, useAceitarConviteTurma } from '../turma-usuario/turma-usuario.hooks';
import { Loader2, AlertCircle, Inbox, Check } from 'lucide-react';

export default function ConvitesTurmasPage({ disciplinaId, onSuccess }: { disciplinaId: number, onSuccess?: () => void }) {
  const { data: convites, isLoading, isError } = useMeusConvitesTurma(disciplinaId);
  const aceitarMutation = useAceitarConviteTurma(disciplinaId);

  const handleAceitar = (turmaId: number) => {
    aceitarMutation.mutate(turmaId, {
      onSuccess: () => {
        onSuccess?.()
      }
    })
  }

  if (isLoading || !convites) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-spif-primary animate-pulse gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm font-bold tracking-widest uppercase">Carregando convites...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="glass-card flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold text-lg text-spif-text">Erro ao carregar convites</p>
          <p className="text-sm text-spif-secondary">Tente novamente mais tarde.</p>
        </div>
      </div>
    )
  }

  if (convites.length === 0) {
    return (
      <div className="glass-card border-dashed flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-spif-card flex items-center justify-center text-spif-secondary">
          <Inbox className="w-8 h-8" />
        </div>
        <div>
          <p className="text-lg font-bold text-spif-text">Nenhum convite encontrado</p>
          <p className="text-sm text-spif-secondary">Você ainda não recebeu nenhum convite para turmas.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <header className="flex items-center gap-2 border-b border-spif-card-border pb-4">
          <Inbox className="w-4 h-4 text-spif-primary" />
          <h2 className="text-xs font-black uppercase tracking-widest text-spif-text opacity-80">Convites Pendentes</h2>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {convites.map((t) => (
          <TurmaCard
              key={t.id}
              turma={t}
          />
        ))}
      </div>
    </div>
  );
}