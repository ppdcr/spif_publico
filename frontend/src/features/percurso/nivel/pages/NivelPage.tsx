import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import { useListarNiveis, useDeletarNivel, useAdicionarProblemasAoNivel, useRemoverProblemaDoNivel } from '../nivel.hooks';
import { useQuery } from '@tanstack/react-query';
import { problemaService } from '../../../problema/problema.service';
import { problemaKeys } from '../../../problema/problema.hooks';
import ListaProblemasContainer from '../../../problema/containers/ListaProblemasContainer';
import NivelConfigForm from '../components/NivelConfigForm';
import ConfirmarDeletarModal from '../../../problema/components/ConfirmarDeletarModal';
import {
  ArrowLeft, Trash2, Loader2, AlertTriangle,
} from 'lucide-react';
import DetalhesSidebar, { type DetalheItem } from '../../../../shared/components/SidebarDetalhes';

type Tab = 'PROBLEMAS' | 'CONFIG';

export default function NivelPage() {
  const { id: percursoIdParam, nivelId: nivelIdParam } = useParams()
  const percursoId = Number(percursoIdParam)
  const nivelId = Number(nivelIdParam)
  const navigate = useNavigate()
  const { role } = useAuth()
  const isProfessor = role === 'ROLE_PROFESSOR'

  const { data: niveis, isLoading, isError } = useListarNiveis(percursoId)
  const nivel = niveis?.find(n => n.id === nivelId)

  const { mutate: deletarNivel, isPending: isDeleting } = useDeletarNivel(percursoId)
  const { mutate: adicionarProblema } = useAdicionarProblemasAoNivel(percursoId, nivelId)
  const { mutate: removerProblema } = useRemoverProblemaDoNivel(percursoId, nivelId)

  const { data: problemasNoNivel } = useQuery({
    queryKey: problemaKeys.list({ nivelId, pagina: 0, tamanho: 1000 }),
    queryFn: () => problemaService.listarProblemas({ nivelId, pagina: 0, tamanho: 1000 }),
  });

  const atribuidosIds = new Set(problemasNoNivel?.content.map(p => p.id) || [])

  const [detalhesAbertos, setDetalhesAbertos] = useState(false)

  const [abaAtiva, setAbaAtiva] = useState<Tab>('PROBLEMAS')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const tabs = [
    { key: 'PROBLEMAS', label: 'Problemas'},
    { key: 'CONFIG', label: 'Configurações'},
  ]

  const progressoGeral = (nivel?.porcentagemConclusao ?? 0) * 100

  const itensDetalhes: DetalheItem[] = [
    ...(nivel?.porcentagemConclusao !== undefined && nivel.porcentagemConclusao !== null ? [{
      label: 'Progresso Geral',
      value: `${progressoGeral.toFixed(0)}%`,
      destaque: true,
    }] : []),
    ...(nivel?.ordem ? [{
      label: 'Ordem',
      value: nivel.ordem,
      destaque: nivel?.porcentagemConclusao !== undefined && nivel.porcentagemConclusao !== null ? false : true,
    }] : []),
    ...(nivel?.descricao ? [{
      label: 'Descrição',
      value: nivel.descricao,
    }] : []),
  ]

  const handleDeletarConfirmar = () => {
    deletarNivel(nivelId, {
      onSuccess: () => navigate(`/percursos/${percursoId}`),
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-80px)] items-center justify-center bg-spif-bg text-spif-primary animate-pulse gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="tracking-widest uppercase text-sm font-bold">Sincronizando nível...</span>
      </div>
    )
  }

  if (isError || !nivel) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-80px)] items-center justify-center gap-6 bg-spif-bg text-spif-text p-8">
        <div className="glass-card p-10 flex flex-col items-center max-w-sm w-full text-center gap-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <p className="font-bold text-lg">Etapa não encontrada.</p>
          <button
            onClick={() => navigate(`/percursos/${percursoId}`)}
            className="flex items-center gap-2 text-spif-primary hover:text-spif-primary-hover font-bold uppercase tracking-widest text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Percurso
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-spif-bg text-spif-text flex flex-col">
      <div className="flex flex-1 overflow-hidden">

        {/* ── Conteúdo Principal ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto px-6 md:px-10 py-10">

            <header className="mb-6 space-y-2 border-b border-spif-card-border pb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => navigate(`/percursos/${percursoId}`)}
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-spif-secondary hover:text-spif-text transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> voltar
                    </button>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-spif-text">
                    {nivel.nome}
                  </h1>
                </div>

                {isProfessor && (
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95 bg-red-500/5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Deletar
                    </button>
                  </div>
                )}
              </div>

              {isProfessor && (
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
              )}
            </header>


            <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {abaAtiva === 'PROBLEMAS' && (
                <ListaProblemasContainer
                  problemasAtribuidosIds={atribuidosIds}
                  nivelId={!isProfessor ? nivelId : undefined}
                  onAtribuir={isProfessor ? (problemaId: number) => adicionarProblema({ problemaIds: [problemaId] }) : undefined}
                  onRemover={isProfessor ? removerProblema : undefined}
                  onClickProblem={(problemaId: number) => navigate(`/percursos/${percursoId}/niveis/${nivelId}/problemas/${problemaId}`)}
                />
              )}

              {isProfessor && abaAtiva === 'CONFIG' && (
                <div className="glass-card p-8">
                  <NivelConfigForm nivel={nivel} percursoId={percursoId} onSuccess={() => setAbaAtiva('PROBLEMAS')} />
                </div>
              )}
            </main>
          </div>
        </div>
              
        {/* ── Sidebar de Detalhes ── */}
        <DetalhesSidebar
          isOpen={detalhesAbertos}
          onToggle={() => setDetalhesAbertos(a => !a)}
          titulo="Detalhes"
          itens={itensDetalhes}
        />
      </div>

      <ConfirmarDeletarModal
        isOpen={showDeleteModal}
        titulo="Confirmar Exclusão"
        textoConfirmacao="deletar"
        mensagem={`O nível "${nivel?.nome}" será removido permanentemente deste percurso.`}
        onConfirmar={handleDeletarConfirmar}
        onCancelar={() => setShowDeleteModal(false)}
        isPending={isDeleting}
      />
    </div>
  )
}
