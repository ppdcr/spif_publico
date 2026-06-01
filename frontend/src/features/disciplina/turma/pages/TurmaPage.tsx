import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import ConfirmarDeletarModal from '../../../problema/components/ConfirmarDeletarModal';
import { useBuscarTurma, useDeletarTurma } from '../turma.hooks';
import { useDesmatricularTurma } from '../turma-usuario/turma-usuario.hooks';
import UsuariosTurmaPage from './UsuariosTurmaPage';
import { ArrowLeft, Trash2, LogOut, Loader2, AlertTriangle } from 'lucide-react';
import TurmaConfigForm from '../components/TurmaConfigForm';

import QrCodeTurma from '../components/QrCodeTurma';
import ListaListasTurmaContainer from '../turma-lista/containers/ListaListasTurmaContainer';
import DetalhesSidebar, { type DetalheItem } from '../../../../shared/components/SidebarDetalhes';

type Tab = 'LISTAS' | 'USUARIOS' | 'CONFIG' | 'QRCODE';

export default function TurmaPage() {
  const { turmaIdParam, disciplinaIdParam } = useParams();
  const turmaId = Number(turmaIdParam);
  const disciplinaId = Number(disciplinaIdParam);

  const { role } = useAuth();

  const { data: turma, isLoading, isError } = useBuscarTurma(disciplinaId, turmaId);
  const { mutate: deletarTurma, isPending: isPendingDeletar } = useDeletarTurma(disciplinaId);
  const { mutate: desmatricular, isPending: isPendingSair } = useDesmatricularTurma(disciplinaId);

  const navigate = useNavigate();
  const isProfessor = role === 'ROLE_PROFESSOR';

  const [abaAtiva, setAbaAtiva] = useState<Tab>('LISTAS');
  const [mostrarModalDeletar, setMostrarModalDeletar] = useState(false);
  const [mostrarModalSair, setMostrarModalSair] = useState(false);

  const tabs = [
    { key: 'LISTAS', label: 'Listas', show: true },
    { key: 'QRCODE', label: 'QR Code', show: isProfessor },
    { key: 'USUARIOS', label: 'Usuários', show: true },
    { key: 'CONFIG', label: 'Configurações', show: isProfessor }
  ].filter(t => t.show);

  const [detalhesAbertos, setDetalhesAbertos] = useState(false)

  const temProgresso = turma?.porcentagemConclusao !== undefined && turma.porcentagemConclusao !== null
  const progressoGeral = (turma?.porcentagemConclusao ?? 0) * 100

  const itensDetalhes: DetalheItem[] = [
    ...(temProgresso ? [{
      label: 'Progresso Geral',
      value: `${progressoGeral.toFixed(0)}%`,
      destaque: true,
    }] : []),
  ]

  const handleDeletarConfirmar = () => {
    deletarTurma(turmaId, {
      onSuccess: () => navigate(`/minhas-disciplinas/${disciplinaId}`, { replace: true }),
    });
  };

  const handleSairConfirmar = () => {
    desmatricular(turmaId, {
      onSuccess: () => navigate(`/minhas-disciplinas/${disciplinaId}`),
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-80px)] items-center justify-center bg-spif-bg text-spif-primary animate-pulse gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="tracking-widest uppercase text-sm font-bold">Sincronizando turma...</span>
      </div>
    );
  }

  if (isError || !turma) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-80px)] items-center justify-center gap-6 bg-spif-bg text-spif-text p-8">
        <div className="glass-card p-10 flex flex-col items-center max-w-sm w-full text-center gap-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <p className="font-bold text-lg">Turma não encontrada.</p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-spif-primary hover:text-spif-primary-hover font-bold uppercase tracking-widest text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            Retornar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-spif-bg text-spif-text flex flex-col">
      <div className="flex flex-1 overflow-y-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-10">
            <header className="mb-6 space-y-2 border-b border-spif-card-border pb-6">
              {/* Breadcrumb e Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => navigate(`/minhas-disciplinas/${disciplinaId}`)}
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-spif-secondary hover:text-spif-text transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Voltar
                    </button>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-spif-text">
                    {turma.nome}
                  </h1>
                </div>

                {/* Ações Secundárias no Topo Direito */}
                <div className="flex flex-wrap gap-3">
                  {isProfessor && (
                    <button
                      onClick={() => setMostrarModalDeletar(true)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all bg-red-500/5 active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Deletar
                    </button>
                  )}
                  <button
                    onClick={() => setMostrarModalSair(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all bg-red-500/5 active:scale-95"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Sair
                  </button>
                </div>
              </div>

              {/* Barra de Navegação por Abas */}
              <div className="flex flex-col items-end gap-6 mt-0 w-full">
                <nav className="flex flex-wrap items-center gap-2 bg-spif-card p-1.5 rounded-xl border border-spif-card-border shadow-inner">
                  {tabs.map((item) => {
                    const isActive = abaAtiva === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => setAbaAtiva(item.key as Tab)}
                        className={`
                          relative flex items-center justify-center gap-2 px-5 py-3 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all duration-300 flex-1 md:flex-initial text-center
                          ${isActive
                            ? 'bg-spif-primary text-spif-bg shadow-md shadow-spif-primary/20'
                            : 'text-spif-secondary hover:text-spif-text hover:bg-spif-bg/50'
                          }
                        `}
                      >
                        <span className="relative z-10">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </header>

            <main className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              {abaAtiva === 'LISTAS' && <ListaListasTurmaContainer disciplinaId={disciplinaId} turmaId={turmaId} isProfessor={isProfessor} />}
              {abaAtiva === 'USUARIOS' && <UsuariosTurmaPage disciplinaId={disciplinaId} turmaId={turmaId} />}
              {isProfessor && abaAtiva === 'QRCODE' && <QrCodeTurma disciplinaId={disciplinaId} turma={turma} />}
              {isProfessor && abaAtiva === 'CONFIG' && (
                <div className="glass-card p-8">
                  <TurmaConfigForm disciplinaId={disciplinaId} turma={turma} />
                </div>
              )}
            </main>
          </div>
        </div>

        <DetalhesSidebar
          isOpen={detalhesAbertos}
          onToggle={() => setDetalhesAbertos(a => !a)}
          titulo="Detalhes"
          itens={itensDetalhes}
        />
      </div>

      {/* Modais de Confirmação */}
        <ConfirmarDeletarModal
          isOpen={mostrarModalDeletar}
          titulo="Confirmar Exclusão"
          textoConfirmacao="deletar"
          mensagem={`A turma "${turma?.nome}" será removida permanentemente.`}
          onConfirmar={handleDeletarConfirmar}
          onCancelar={() => setMostrarModalDeletar(false)}
          isPending={isPendingDeletar}
        />
        <ConfirmarDeletarModal
          isOpen={mostrarModalSair}
          titulo="Deseja sair da turma?"
          textoConfirmacao="sair"
          mensagem={`Você sairá de "${turma?.nome}" permanentemente.`}
          onConfirmar={handleSairConfirmar}
          onCancelar={() => setMostrarModalSair(false)}
          isPending={isPendingSair}
        />
    </div>
  );
}