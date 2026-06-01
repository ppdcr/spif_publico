import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import ListaTurmasContainer from '../turma/containers/ListaTurmasContainer';
import ConfirmarDeletarModal from '../../problema/components/ConfirmarDeletarModal';
import { useBuscarDisciplina, useDeletarDisciplina } from '../disciplina.hooks';
import UsuariosDisciplinaPage from './UsuariosDisciplinaPage';
import { useDesmatricular } from '../disciplina-usuario/disciplina-usuario.hooks';
import { ArrowLeft, Trash2, LogOut, Loader2, AlertTriangle } from 'lucide-react';
import DisciplinaConfigForm from '../components/DisciplinaConfigForm';

type Tab = 'TURMAS' | 'USUARIOS' | 'CONFIG'

export default function DisciplinaPage() {
  const { id } = useParams();
  const disciplinaId = Number(id);

  const { role, usuario } = useAuth();

  const { data: disciplina, isLoading, isError } = useBuscarDisciplina(disciplinaId);
  const { mutate: deletarDisciplina, isPending: isPendingDeletar } = useDeletarDisciplina(usuario!.id);
  const { mutate: desmatricular, isPending: isPendingSair } = useDesmatricular(usuario!.id)

  const navigate = useNavigate();
  const isProfessor = role === 'ROLE_PROFESSOR';

  const [abaAtiva, setAbaAtiva] = useState<Tab>('TURMAS');
  const [mostrarModalDeletar, setMostrarModalDeletar] = useState(false)
  const [mostrarModalSair, setMostrarModalSair] = useState(false)

  const tabs = [
    { key: 'TURMAS', label: 'Turmas', show: true },
    { key: 'USUARIOS', label: 'Usuários', show: true },
    { key: 'CONFIG', label: 'Configurações', show: isProfessor },
  ].filter(t => t.show);

  const handleDeletarConfirmar = () => {
    deletarDisciplina(disciplinaId, {
      onSuccess: () => navigate('/minhas-disciplinas'),
    })
  }

  const handleSairConfirmar = () => {
    desmatricular(disciplinaId, {
      onSuccess: () => navigate('/minhas-disciplinas'),
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-80px)] items-center justify-center bg-spif-bg text-spif-primary animate-pulse gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="tracking-widest uppercase text-sm font-bold">Sincronizando disciplina...</span>
      </div>
    )
  }

  if (isError || !disciplina) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-80px)] items-center justify-center gap-6 bg-spif-bg text-spif-text p-8">
        <div className="glass-card p-10 flex flex-col items-center max-w-sm w-full text-center gap-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <p className="font-bold text-lg">Disciplina não encontrada.</p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-spif-primary hover:text-spif-primary-hover font-bold uppercase tracking-widest text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Retornar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-spif-bg text-spif-text flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-10">
          <header className="mb-6 space-y-2 border-b border-spif-card-border pb-6">
            {/* Breadcrumb e Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate('/minhas-disciplinas')}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-spif-secondary hover:text-spif-text transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> disciplinas
                  </button>
                </div>

                <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-spif-text">
                  {disciplina.nome}
                </h1>
              </div>

              {/* Ações Secundárias no Topo Direito */}
              <div className="flex flex-wrap gap-3">
                {isProfessor && (
                  <button
                    onClick={() => setMostrarModalDeletar(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95 bg-red-500/5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Deletar
                  </button>
                )}
                <button
                  onClick={() => setMostrarModalSair(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95 bg-red-500/5"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sair
                </button>
              </div>
            </div>

            {/* Barra de Navegação por Abas (Largura Completa e Alinhada) */}
            <div className="flex flex-col items-end gap-6 mt-0 w-full">
              <nav className="flex flex-wrap items-center gap-2 bg-spif-card p-1.5 rounded-xl border border-spif-card-border shadow-inner">
                {tabs.map((item) => {
                  const isActive = abaAtiva === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setAbaAtiva(item.key as any)}
                      className={`
                        relative flex items-center justify-center gap-2 px-5 py-3 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all duration-300 flex-1 md:flex-initial text-center
                        ${isActive
                          ? 'bg-spif-primary text-spif-bg shadow-md shadow-spif-primary/20'
                          : 'text-spif-secondary hover:text-spif-text hover:bg-spif-bg/50'
                        }
                      `}
                    >
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </header>

          <main className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {abaAtiva === 'TURMAS' && <ListaTurmasContainer disciplinaId={disciplinaId} isProfessor={isProfessor} />}
            {abaAtiva === 'USUARIOS' && <UsuariosDisciplinaPage disciplinaId={disciplinaId} />}
            {isProfessor && abaAtiva === 'CONFIG' && (
              <div className="glass-card p-8">
                <DisciplinaConfigForm disciplina={disciplina} />
              </div>
            )}
          </main>
        </div>

        <ConfirmarDeletarModal
          isOpen={mostrarModalDeletar}
          titulo="Confirmar Exclusão"
          textoConfirmacao="deletar"
          mensagem={`A disciplina "${disciplina?.nome}" será removida permanentemente de todos os registros.`}
          onConfirmar={handleDeletarConfirmar}
          onCancelar={() => setMostrarModalDeletar(false)}
          isPending={isPendingDeletar}
        />
        <ConfirmarDeletarModal
          isOpen={mostrarModalSair}
          titulo="Deseja sair da disciplina?"
          textoConfirmacao="sair"
          mensagem={`Sua matrícula em "${disciplina?.nome}" será revogada. Você não terá mais acesso às turmas vinculadas.`}
          onConfirmar={handleSairConfirmar}
          onCancelar={() => setMostrarModalSair(false)}
          isPending={isPendingSair}
        />
      </div>
    </div>
  );
}