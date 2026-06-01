import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { useListarCompeticoesAtivas, useListarCompeticoesInativas, useDeletarCompeticao, useAdicionarProblemasACompeticao, useRemoverProblemaDaCompeticao } from '../competicao.hooks'
import ListaProblemasContainer from '../../problema/containers/ListaProblemasContainer'
import CompeticaoConfigForm from '../components/CompeticaoConfigForm'
import ConfirmarDeletarModal from '../../problema/components/ConfirmarDeletarModal'
import { useQuery } from '@tanstack/react-query'
import { problemaService } from '../../problema/problema.service'
import { problemaKeys } from '../../problema/problema.hooks'
import {
  ArrowLeft,Loader2, AlertTriangle,
  Lock, Clock,
  Trash2
} from 'lucide-react'
import { getDataStatus } from '../../../shared/utils/card.utils'
import DetalhesSidebar, { type DetalheItem } from '../../../shared/components/SidebarDetalhes'

type Tab = 'PROBLEMAS' | 'CONFIG'

export default function CompeticaoPage() {
  const { id } = useParams()
  const competicaoId = Number(id)
  const navigate = useNavigate()
  const { role } = useAuth()
  const isProfessor = role === 'ROLE_PROFESSOR'

  const { data: ativas, isLoading: isLoadingAtivas } = useListarCompeticoesAtivas()
  const { data: inativas, isLoading: isLoadingInativas } = useListarCompeticoesInativas({ enabled: isProfessor })

  const { mutate: deletarCompeticao, isPending: isDeleting } = useDeletarCompeticao()
  const { mutate: adicionarProblema } = useAdicionarProblemasACompeticao(competicaoId)
  const { mutate: removerProblema } = useRemoverProblemaDaCompeticao(competicaoId)

  const { data: problemasNaCompeticao } = useQuery({
    queryKey: problemaKeys.list({ competicaoId, pagina: 0, tamanho: 1000 }),
    queryFn: () => problemaService.listarProblemas({ competicaoId, pagina: 0, tamanho: 1000 }),
  })

  const atribuidosIds = new Set(problemasNaCompeticao?.content.map(p => p.id) || [])

  const [abaAtiva, setAbaAtiva] = useState<Tab>('PROBLEMAS')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const isLoading = isLoadingAtivas || isLoadingInativas
  const competicao = ativas?.find(c => c.id === competicaoId) || inativas?.find(c => c.id === competicaoId)

  const [detalhesAbertos, setDetalhesAbertos] = useState(false)

  const tabs = [
    { key: 'PROBLEMAS', label: 'Desafios', show: true },
    { key: 'CONFIG', label: 'Configurações', show: isProfessor },
  ].filter(t => t.show)

  const temProgresso = competicao?.porcentagemConclusao !== undefined && competicao.porcentagemConclusao !== null
  const progressoGeral = (competicao?.porcentagemConclusao ?? 0) * 100

  const itensDetalhes: DetalheItem[] = [
    ...(temProgresso ? [{
      label: 'Progresso Geral',
      value: `${progressoGeral.toFixed(0)}%`,
      destaque: true,
    }] : []),
    ...(competicao?.descricao ? [{
      label: 'Descrição',
      value: competicao.descricao,
      destaque: !temProgresso,
    }] : []),
    ...(competicao?.dataInicio ? [{
      label: 'Data de Início',
      value: new Date(competicao.dataInicio).toLocaleDateString('pt-BR'),
    }] : []),
    {
      label: 'Data de Fim',
      value: competicao?.dataFim ? new Date(competicao.dataFim).toLocaleDateString('pt-BR') : 'Indeterminada',
    }
  ]

  const handleDeletarConfirmar = () => {
    deletarCompeticao(competicaoId, {
      onSuccess: () => navigate('/competicoes'),
    })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-80px)] items-center justify-center bg-spif-bg text-spif-primary animate-pulse gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="tracking-widest uppercase text-sm font-bold">Carregando competição...</span>
      </div>
    )
  }

  if (!competicao) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-80px)] items-center justify-center gap-6 bg-spif-bg text-spif-text p-8">
        <div className="glass-card p-10 flex flex-col items-center max-w-sm w-full text-center gap-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <p className="font-bold text-lg">Competição não encontrada.</p>
          <button
            onClick={() => navigate('/competicoes')}
            className="flex items-center gap-2 text-spif-primary hover:text-spif-primary-hover font-bold uppercase tracking-widest text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para Competições
          </button>
        </div>
      </div>
    )
  }

  const status = getDataStatus(competicao.dataInicio, competicao.dataFim)
  // Alunos só acessam competições em andamento
  if (!isProfessor && status !== 'EM_ANDAMENTO') {
    const isAgendada = status === 'AGENDADA'
    return (
      <div className="flex flex-col min-h-[calc(100vh-80px)] items-center justify-center gap-6 bg-spif-bg text-spif-text p-8">
        <div className="glass-card p-10 flex flex-col items-center max-w-sm w-full text-center gap-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isAgendada ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'}`}>
            {isAgendada ? <Clock className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
          </div>
          <div>
            <p className="font-black text-xl uppercase tracking-tight mb-2">
              {isAgendada ? 'Competição Agendada' : 'Competição Encerrada'}
            </p>
            <p className="text-sm text-spif-secondary">
              {isAgendada
                ? `Esta competição começa em ${new Date(competicao.dataInicio).toLocaleDateString('pt-BR', { dateStyle: 'long' })}.`
                : competicao.dataFim ? `Esta competição encerrou em ${new Date(competicao.dataFim).toLocaleDateString('pt-BR', { dateStyle: 'long' })}.`
                  : 'Esta competição não tem data de encerramento definida.'}
            </p>
          </div>
          <button
            onClick={() => navigate('/competicoes')}
            className="flex items-center gap-2 text-spif-primary hover:text-spif-primary-hover font-bold uppercase tracking-widest text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Competições
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
                      onClick={() => navigate(`/competicoes`)}
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-spif-secondary hover:text-spif-text transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> competições
                    </button>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-spif-text">
                    {competicao.nome}
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
                  competicaoId={!isProfessor ? competicaoId : undefined}
                  onAtribuir={isProfessor ? (problemaId: number) => adicionarProblema({ problemaIds: [problemaId] }) : undefined}
                  onRemover={isProfessor ? removerProblema : undefined}
                  onClickProblem={(problemaId: number) => navigate(`/competicoes/${competicaoId}/problemas/${problemaId}`)}
                />
              )}

              {isProfessor && abaAtiva === 'CONFIG' && (
                <div className="glass-card p-8">
                  <CompeticaoConfigForm competicao={competicao} onSuccess={() => setAbaAtiva('PROBLEMAS')} />
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
        isOpen={showDeleteModal}
        titulo="Confirmar Exclusão"
        textoConfirmacao="deletar"
        mensagem={`A competição "${competicao?.nome}" será removida permanentemente.`}
        onConfirmar={handleDeletarConfirmar}
        onCancelar={() => setShowDeleteModal(false)}
        isPending={isDeleting}
      />
    </div>
  )
}
