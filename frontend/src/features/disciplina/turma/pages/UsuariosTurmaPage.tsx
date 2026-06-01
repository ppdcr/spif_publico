import { useMemo } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import ListaUsuariosContainer, { type UsuarioStatus } from '../../../usuario/containers/ListaUsuariosContainer';
import { useUsuariosAtivosDisciplina } from '../../disciplina-usuario/disciplina-usuario.hooks';
import { useUsuariosMatriculadosTurma, useConvidadosTurma, useConvidarUsuarioTurma } from '../turma-usuario/turma-usuario.hooks';
import { Loader2, AlertCircle } from 'lucide-react';

export default function UsuariosTurmaPage({ disciplinaId, turmaId }: { disciplinaId: number, turmaId: number }) {
  const { role } = useAuth();
  const isProfessor = role === 'ROLE_PROFESSOR';

  const { data: matriculados, isLoading: isLoadingMatriculados, isError } = useUsuariosMatriculadosTurma(disciplinaId, turmaId);
  const { data: convidados, isLoading: isLoadingConvidados } = useConvidadosTurma(disciplinaId, turmaId);
  const { data: matriculadosDisciplina, isLoading: isLoadingMatriculadosDisciplina } = useUsuariosAtivosDisciplina(disciplinaId);
  const convidarMutation = useConvidarUsuarioTurma(disciplinaId, turmaId);

  const isLoading = isProfessor
    ? isLoadingMatriculados || isLoadingConvidados || isLoadingMatriculadosDisciplina
    : isLoadingMatriculados;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-spif-primary animate-pulse gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm font-bold tracking-widest uppercase">Sincronizando membros...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="glass-card flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold text-lg text-spif-text">Erro ao carregar membros</p>
          <p className="text-sm text-spif-secondary">Não foi possível acessar a lista de usuários.</p>
        </div>
      </div>
    );
  }

  const handleConvidar = (usuarioId: number) => {
    convidarMutation.mutate({ usuarioId });
  };

  const statusMap = useMemo(() => {
    const map: Record<number, UsuarioStatus> = {};

    matriculadosDisciplina?.forEach((usuario) => {
      map[usuario.id] = usuario.role === 'ROLE_PROFESSOR' ? 'PROFESSOR' : 'DISPONIVEL';
    });

    convidados?.forEach((usuario) => {
      map[usuario.id] = 'CONVIDADO';
    });

    matriculados?.forEach((usuario) => {
      map[usuario.id] = 'MATRICULADO';
    });

    return map;
  }, [matriculadosDisciplina, convidados, matriculados]);

  return (
    <ListaUsuariosContainer
      usuarios={matriculadosDisciplina ?? []}
      statusMap={statusMap}
      onInvite={handleConvidar}
      isProfessor={isProfessor}
      modoAdicionar="TURMA"
      candidatos={matriculadosDisciplina ?? []}
    />
  );
}
