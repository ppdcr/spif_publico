import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import ConfirmarDeletarModal from '../../problema/components/ConfirmarDeletarModal';
import { useBuscarLista, useDeletarLista, useDeletarProblemaDaLista, useAdicionarProblemaALista } from '../lista.hooks';
import ListaProblemasContainer from '../../problema/containers/ListaProblemasContainer';
import DetalhesListaPage from './DetalhesListaPage';
import { useListarProblemas } from '../../problema/problema.hooks';
import { ArrowLeft, Trash2, Loader2, AlertCircle } from 'lucide-react';
import ListaConfigForm from '../components/ListaConfigForm';
import DetalhesSidebar, { type DetalheItem } from '../../../shared/components/SidebarDetalhes';
import { useUsuarioPorId } from '../../usuario/usuario.hooks';

type Tab = 'PROBLEMAS' | 'DETALHES' | 'CONFIG'

export default function ListaPage() {
  const { id, turmaId, disciplinaId } = useParams<{
    id: string
    turmaId?: string
    disciplinaId?: string
  }>()
  
  const listaId = Number(id)
  const turmaIdNumber = turmaId ? Number(turmaId) : undefined
  const { role } = useAuth();

  const { data: lista, isLoading, isError } = useBuscarLista(listaId, turmaIdNumber)
  const { mutate: deletarLista, isPending: isPendingDeletar } = useDeletarLista()
  const removerMutation = useDeletarProblemaDaLista(listaId)
  const { data: problemasDaLista } = useListarProblemas({ listaId, pagina: 0, tamanho: 1000 })
  const { mutate: adicionarMutation } = useAdicionarProblemaALista(listaId)

  const navigate = useNavigate();
  const isProfessor = role === 'ROLE_PROFESSOR';
  
  const [abaAtiva, setAbaAtiva] = useState<Tab>('PROBLEMAS');
  const [mostrarModalDeletar, setMostrarModalDeletar] = useState(false)
  
  const atribuidosIds = new Set(problemasDaLista?.content.map((p: any) => p.id) || [])
  const [detalhesAbertos, setDetalhesAbertos] = useState(false)

  const { data: professorDono } = useUsuarioPorId(lista?.professorId!)

  const tabs = [
    { key: 'PROBLEMAS', label: 'Problemas', show: true },
    { key: 'CONFIG', label: 'Configurações', show: isProfessor && !turmaIdNumber }
  ].filter(t => t.show);

  const temProgresso = lista?.porcentagemConclusao !== undefined && lista.porcentagemConclusao !== null
  const progressoGeral = (lista?.porcentagemConclusao ?? 0) * 100

  const itensDetalhes: DetalheItem[] = [
    ...(temProgresso ? [{
      label: 'Progresso Geral',
      value: `${progressoGeral.toFixed(0)}%`,
      destaque: true,
    }] : []),
    {
      label: 'Descrição',
      value: lista?.descricao,
      destaque: !temProgresso,
    },
    ...(professorDono ? [{
      label: 'Professor Responsável',
      value: professorDono.nickname,
    }] : []),
    ...(lista?.dataInicio ? [{
      label: 'Data de Início',
      value: new Date(lista.dataInicio).toLocaleDateString('pt-BR'),
    }] : []),
    ...(lista?.dataFim ? [{
      label: 'Data de Fim',
     value: lista.dataFim ? new Date(lista.dataFim).toLocaleDateString('pt-BR') : 'Indeterminada',
    }] : []),
  ]

  const handleDeletarConfirmar = () => {
    deletarLista(listaId, {
      onSuccess: () => navigate('/minhas-listas'),
    })
  }

  const handleRemover = (problemaId: number) => {
    removerMutation.mutate(problemaId)
  }

  const handleAtribuir = (problemaId: number) => {
    adicionarMutation({ problemaId })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-80px)] items-center justify-center bg-spif-bg text-spif-primary animate-pulse gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm font-bold tracking-widest uppercase">Sincronizando lista...</span>
      </div>
    )
  }

  if (isError || !lista) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-80px)] items-center justify-center gap-6 bg-spif-bg text-spif-text p-8">
        <div className="glass-card p-10 flex flex-col items-center max-w-sm w-full text-center gap-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
            <AlertCircle className="w-8 h-8" />
          </div>
          <p className="font-bold text-lg">Lista não encontrada.</p>
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
    <div className="min-h-screen bg-spif-bg text-spif-text flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-10">
            <header className="mb-6 space-y-2 border-b border-spif-card-border pb-6">
              {/* Breadcrumb e Info */}
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => navigate(-1)}
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-spif-secondary hover:text-spif-text transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Listas
                    </button>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-spif-text">
                    {lista.titulo}
                  </h1>
                </div>

                {/* Ações Secundárias no Topo Direito */}
                {isProfessor && !turmaIdNumber && (
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setMostrarModalDeletar(true)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95 bg-red-500/5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Deletar
                    </button>
                  </div>
                )}
              </div>

              {/* Barra de Navegação por Abas (Largura Completa e Alinhada) */}
              {!turmaIdNumber &&
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
              }
            </header>

            <main className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              {abaAtiva === 'PROBLEMAS' && (
                <ListaProblemasContainer
                  problemasAtribuidosIds={!turmaIdNumber ? atribuidosIds : undefined}
                  onAtribuir={!turmaIdNumber && isProfessor ? handleAtribuir : undefined}
                  listaId={!isProfessor ? listaId : undefined}
                  onRemover={!turmaIdNumber ? handleRemover : undefined}
                  onClickProblem={(problemaId) => {
                    if (turmaIdNumber && disciplinaId) {
                      navigate(`/minhas-disciplinas/${disciplinaId}/minhas-turmas/${turmaIdNumber}/listas/${listaId}/problemas/${problemaId}`)
                    } else {
                      navigate(`/minhas-listas/${listaId}/problemas/${problemaId}`)
                    }
                  }}
                />
              )}
              {abaAtiva === 'DETALHES' && <DetalhesListaPage lista={lista} />}
              {isProfessor && !turmaIdNumber && abaAtiva === 'CONFIG' && (
                <div className="glass-card p-8">
                  <ListaConfigForm lista={lista} onSucess={() => setAbaAtiva('PROBLEMAS')} />
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

      <ConfirmarDeletarModal
        isOpen={mostrarModalDeletar}
        titulo="Confirmar Exclusão"
        textoConfirmacao="deletar"
        mensagem={`A Lista "${lista.titulo}" será removida permanentemente do repositório.`}
        onConfirmar={handleDeletarConfirmar}
        onCancelar={() => setMostrarModalDeletar(false)}
        isPending={isPendingDeletar}
      />
    </div>
  );
}