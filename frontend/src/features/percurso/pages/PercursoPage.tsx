import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useListarPercursos, useDeletarPercurso } from '../percurso.hooks'
import { useAuth } from '../../../contexts/AuthContext'
import ConfirmarDeletarModal from '../../problema/components/ConfirmarDeletarModal'
import {
  ArrowLeft, Trash2, Loader2, AlertTriangle,
} from 'lucide-react'
import PercursoConfigForm from '../components/PercursoConfigForm'
import DetalhesSidebar, { type DetalheItem  } from '../../../shared/components/SidebarDetalhes'
import ListaNiveisContainer from '../nivel/containers/ListaNiveisContainer'

type Tab = 'NIVEIS' | 'CONFIG'

export default function PercursoPage() {
  const { id } = useParams()
  const percursoId = Number(id)
  const navigate = useNavigate()
  const { role } = useAuth()
  const isProfessor = role === 'ROLE_PROFESSOR'

  const { data: percursos } = useListarPercursos()
  const percurso = percursos?.find(p => p.id === percursoId)

  const { mutate: deletarPercurso, isPending: isDeleting } = useDeletarPercurso()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [abaAtiva, setAbaAtiva] = useState<Tab>('NIVEIS')
  const [detalhesAbertos, setDetalhesAbertos] = useState(false)

  const tabs = [
    { key: 'NIVEIS', label: 'Níveis' },
    { key: 'CONFIG', label: 'Configurações' },
  ]

  const handleDeletar = () => {
    deletarPercurso(percursoId, {
      onSuccess: () => navigate('/percursos')
    })
  }

  // ── Dados para a sidebar de detalhes ────────────────────────────────────────
  const progressoGeral = (percurso?.porcentagemConclusao ?? 0) * 100

  const itensDetalhes: DetalheItem[] = [
    ...(percurso?.porcentagemConclusao !== undefined && percurso.porcentagemConclusao !== null ? [{
      label: 'Progresso Geral',
      value: `${progressoGeral.toFixed(0)}%`,
      destaque: true,
    }] : []),
    ...(percurso?.descricao ? [{
      label: 'Descrição',
      value: percurso.descricao,
      destaque: percurso?.porcentagemConclusao !== undefined && percurso.porcentagemConclusao !== null ? false : true,
    }] : [])
  ]

  // ── Estados de carregamento e erro ──────────────────────────────────────────

  if (!percurso) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-spif-bg text-spif-primary animate-pulse gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="tracking-widest uppercase text-sm font-bold">Carregando trilha...</span>
      </div>
    )
  }

  if (!percurso) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center gap-6 bg-spif-bg text-spif-text p-8">
        <div className="glass-card p-10 flex flex-col items-center max-w-sm w-full text-center gap-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <p className="font-bold text-lg text-spif-text">Percurso não encontrado.</p>
          <button
            onClick={() => navigate('/percursos')}
            className="flex items-center gap-2 text-spif-primary hover:text-spif-primary-hover font-bold uppercase tracking-widest text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Explorar Percursos
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
                      onClick={() => navigate(`/percursos`)}
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-spif-secondary hover:text-spif-text transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> percursos
                    </button>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-spif-text">
                    {percurso.nome}
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

            {/* ── Conteúdo das Abas ── */}
            <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {abaAtiva === 'NIVEIS' && (
                <ListaNiveisContainer percursoId={percursoId} isProfessor={isProfessor} />
              )}

              {isProfessor && abaAtiva === 'CONFIG' && (
                <div className="glass-card p-8">
                  {percurso && <PercursoConfigForm percurso={percurso} onSuccess={() => setAbaAtiva('NIVEIS')} />}
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
        titulo="Excluir Percurso"
        mensagem={`Tem certeza que deseja excluir "${percurso?.nome}"? Todos os níveis e progresso dos alunos serão removidos.`}
        onConfirmar={handleDeletar}
        onCancelar={() => setShowDeleteModal(false)}
        isPending={isDeleting}
        textoConfirmacao="deletar"
      />
    </div>
  )
}