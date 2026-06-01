import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { useBuscarProblema, useDeletarProblema } from '../problema.hooks'
import { useUsuarioPorId } from '../../usuario/usuario.hooks'
import ConfirmarDeletarModal from '../components/ConfirmarDeletarModal'
import DetalhesSidebar, { type DetalheItem } from '../../../shared/components/SidebarDetalhes'
import { ArrowLeft, Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { EditorProvider } from '../../../contexts/CodeEditorContext'
import SubmissaoModal from '../../submissao/components/SubmissaoModal'
import MinhasSubmissoesDrawer from '../../submissao/components/MinhasSubmissoesDrawer'
import ChatIaDrawer from '../components/ChatIaDrawer'
import { useProgressoWebSocket } from '../../submissao/progresso/progresso.hooks'
import ConquistaModal from '../../submissao/progresso/components/ConquistaModal'
import ListaCasosContainer from '../casoTeste/containers/ListaCasosContainer'
import EditarProblemaForm from '../components/EditarProblemaForm'

type Aba = 'PROBLEMA' | 'CASOS' | 'CONFIG'

export default function ProblemaPage() {
  const {
    id, disciplinaId, turmaId, listaId, nivelId, percursoId, competicaoId
  } = useParams<{
    id: string
    disciplinaId?: string
    turmaId?: string
    listaId?: string
    nivelId?: string
    percursoId?: string
    competicaoId?: string
  }>()
  const navigate = useNavigate()
  const { usuario, role } = useAuth()

  const [abaAtiva, setAbaAtiva] = useState<Aba>('PROBLEMA')
  const [mostrarModalDeletar, setMostrarModalDeletar] = useState(false)
  const [detalhesAbertos, setDetalhesAbertos] = useState(false)
  const [submissaoAberta, setSubmissaoAberta] = useState(false)
  const [historicoAberto, setHistoricoAberto] = useState(false)
  const [chatAberto, setChatAberto] = useState(false)

  const problemaId = id ? parseInt(id) : 0
  const { data: problema, isLoading: isLoadingProblema, isError: isErrorProblema } = useBuscarProblema(problemaId)
  const { data: professor } = useUsuarioPorId(problema?.professorId ?? 0)
  const { mutate: deletarProblema, isPending: isPendingDeletar } = useDeletarProblema()

  const isOwner = role === 'ROLE_PROFESSOR' && problema?.professorId === usuario?.id
  const isAluno = role !== 'ROLE_PROFESSOR'

  const alunoId = usuario?.id ?? 0
  const { atual: conquistaAtual, dispensar: dispensarConquista } = useProgressoWebSocket(alunoId)

  const getBackPath = () => {
    if (listaId && turmaId && disciplinaId) return `/minhas-disciplinas/${disciplinaId}/minhas-turmas/${turmaId}/listas/${listaId}`
    if (listaId) return `/minhas-listas/${listaId}`
    if (nivelId && percursoId) return `/percursos/${percursoId}/niveis/${nivelId}`
    if (competicaoId) return `/competicoes/${competicaoId}`
    return '/problemas'
  }

  const handleDeletarConfirmar = () => {
    deletarProblema(problemaId, {
      onSuccess: () => navigate(getBackPath()),
    })
  }

  if (isLoadingProblema) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-spif-bg text-spif-primary animate-pulse gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="tracking-widest uppercase text-sm font-bold">Sincronizando problema...</span>
      </div>
    )
  }

  if (isErrorProblema || !problema) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center gap-6 bg-spif-bg text-spif-text p-8">
        <div className="glass-card p-10 flex flex-col items-center max-w-sm w-full text-center gap-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <p className="font-bold text-lg">Problema não encontrado no repositório.</p>
          <button
            onClick={() => navigate(getBackPath())}
            className="flex items-center gap-2 text-spif-primary hover:text-spif-primary-hover font-bold uppercase tracking-widest text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
        </div>
      </div>
    )
  }

  // ── Itens sidebar de detalhes ─────────────────────────────────────────────

  const itensDetalhes: DetalheItem[] = [
    ...(professor ? [{ label: 'Autor', value: professor.nickname, destaque: true }] : []),
    {
      label: 'Tempo Limite',
      value: (
        <span className="font-mono text-2xl font-black text-spif-text">
          {problema.tempoLimite}
          <span className="text-xs ml-1 text-spif-secondary font-sans font-medium">s</span>
        </span>
      ),
    },
    {
      label: 'Memória',
      value: (
        <span className="font-mono text-2xl font-black text-spif-text">
          {problema.memoriaLimiteMb}
          <span className="text-xs ml-1 text-spif-secondary font-sans font-medium">MB</span>
        </span>
      ),
    },
    ...(problema.dataCriacao ? [{
      label: 'Registro',
      value: new Date(problema.dataCriacao).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
      }),
    }] : []),
    {
      label: 'Tópicos',
      value: problema.assuntos && problema.assuntos.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {problema.assuntos.map((assunto) => (
            <span
              key={assunto}
              className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-spif-bg border border-spif-card-border text-spif-text rounded-md"
            >
              {assunto}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-[10px] italic text-spif-secondary">Sem tópicos definidos</span>
      ),
    },
  ]

  return (
    <div className="min-h-[calc(100vh-80px)] bg-spif-bg text-spif-text font-sans transition-colors duration-300 flex flex-col">
      <div className="flex flex-1 overflow-hidden">

        {/* ── Conteúdo principal ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto px-8 md:px-12 py-12">

            {/* ── Header ── */}
            <header className="mb-10 border-b border-spif-card-border pb-8">
              <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                <div>
                  <button
                    onClick={() => navigate(getBackPath())}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-spif-secondary hover:text-spif-text transition-colors mb-6"
                  >
                    <ArrowLeft className="w-4 h-4" /> Voltar
                  </button>

                  <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                    {problema.titulo}
                  </h1>
                </div>

                <div className="flex flex-col items-end gap-4">
                  {isOwner && (
                    <button
                      onClick={() => setMostrarModalDeletar(true)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Deletar
                    </button>
                  )}

                  {isOwner && (
                    <nav className="flex items-center gap-2 bg-spif-card p-1.5 rounded-xl border border-spif-card-border shadow-inner">
                      {[
                        { key: 'PROBLEMA', label: 'Problema' },
                        { key: 'CASOS', label: 'Casos de teste' },
                        { key: 'CONFIG', label: 'Configurações' },
                      ].map((item) => {
                        const isActive = abaAtiva === item.key
                        return (
                          <button
                            key={item.key}
                            onClick={() => setAbaAtiva(item.key as Aba)}
                            className={`
                              px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg
                              transition-all duration-300
                              ${isActive
                                ? 'bg-spif-primary text-spif-bg shadow-md shadow-spif-primary/20'
                                : 'text-spif-secondary hover:text-spif-text hover:bg-spif-bg/50'
                              }
                            `}
                          >
                            {item.label}
                          </button>
                        )
                      })}
                    </nav>
                  )}
                </div>
              </div>
            </header>

            {/* ── Barra de ações do aluno — acima do conteúdo ── */}
            {isAluno && (
              <EditorProvider userId={usuario!.id} problemaId={problemaId}>
                <div className="mb-6 glass-card p-4 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setSubmissaoAberta(true)}
                    className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl bg-spif-primary hover:bg-spif-primary-hover text-spif-bg shadow-md shadow-spif-primary/20 hover:scale-[1.02] transition-all"
                  >
                    Submeter Solução
                  </button>

                  <button
                    onClick={() => setHistoricoAberto(true)}
                    className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl border border-spif-card-border text-spif-secondary hover:text-spif-text hover:border-spif-secondary transition-all"
                  >
                    Minhas Submissões
                  </button>

                  <button
                    onClick={() => setChatAberto(true)}
                    className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl border border-dashed border-spif-primary/30 text-spif-primary hover:bg-spif-primary/10 hover:border-spif-primary/50 transition-all"
                  >
                    Chat com IA
                  </button>
                </div>

                <SubmissaoModal
                  isOpen={submissaoAberta}
                  onClose={() => setSubmissaoAberta(false)}
                  problemaId={problemaId}
                  alunoId={usuario!.id}
                />

                <MinhasSubmissoesDrawer
                  isOpen={historicoAberto}
                  onClose={() => setHistoricoAberto(false)}
                  problemaId={problemaId}
                />

                <ChatIaDrawer
                  isOpen={chatAberto}
                  onClose={() => setChatAberto(false)}
                  problemaId={problemaId}
                />
              </EditorProvider>
            )}

            {/* ── Conteúdo ── */}
            <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {abaAtiva === 'PROBLEMA' && (
                <div className="space-y-10 glass-card p-8">
                  <section>
                    <h2 className="tracking-widest uppercase font-bold text-spif-primary mb-1">Enunciado</h2>
                    <div className="text-base leading-relaxed text-spif-text whitespace-pre-wrap font-medium">
                      {problema.enunciado}
                    </div>
                  </section>

                  <section>
                    <h2 className="tracking-widest uppercase font-bold text-spif-primary mb-1">Entrada</h2>
                    <pre className="text-base leading-relaxed text-spif-text whitespace-pre-wrap font-medium">
                      {problema.entrada}
                    </pre>
                  </section>

                  <section>
                    <h2 className="tracking-widest uppercase font-bold text-spif-primary mb-1">Saída</h2>
                    <pre className="text-base leading-relaxed text-spif-text whitespace-pre-wrap font-medium">
                      {problema.saida}
                    </pre>
                  </section>

                  {problema.casosVisiveis && problema.casosVisiveis.length > 0 && (
                    <section className="pt-4">
                      <h2 className="tracking-widest uppercase font-bold text-spif-primary mb-4">Exemplos</h2>
                      <div className="space-y-4">
                        {problema.casosVisiveis.map((caso) => (
                          <div key={caso.id} className="p-4 rounded-xl bg-spif-card/50">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-spif-secondary mb-2">Entrada</p>
                                <code className="block w-full p-3 bg-black/40 rounded-lg text-xs font-mono">{caso.entrada}</code>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase tracking-widest font-bold text-spif-secondary mb-2">Saída Esperada</p>
                                <code className="block w-full p-3 bg-black/40 rounded-lg text-xs font-mono">{caso.saida}</code>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}

              {abaAtiva === 'CASOS' && <ListaCasosContainer problemaId={problemaId} />}
              {abaAtiva === 'CONFIG' && 
                <div className="glass-card p-8">
                  <EditarProblemaForm problema={problema} onSuccess={() => setAbaAtiva('PROBLEMA')} />
                </div>
              }
            </main>
          </div>
        </div>

        {/* ── Sidebar de Detalhes ── */}
        <DetalhesSidebar
          isOpen={detalhesAbertos}
          onToggle={() => setDetalhesAbertos((a) => !a)}
          titulo="Detalhes"
          itens={itensDetalhes}
        />
      </div>

      <ConquistaModal
        conquista={conquistaAtual}
        onFechar={dispensarConquista}
      />

      <ConfirmarDeletarModal
        isOpen={mostrarModalDeletar}
        titulo="Confirmar Exclusão"
        textoConfirmacao="deletar"
        mensagem={`O desafio "${problema.titulo}" será removido permanentemente.`}
        onConfirmar={handleDeletarConfirmar}
        onCancelar={() => setMostrarModalDeletar(false)}
        isPending={isPendingDeletar}
      />
    </div>
  )
}