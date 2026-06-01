import { useEffect, useRef, useState } from 'react'
import {
    X,
    Upload,
    CheckCircle2,
    XCircle,
    Loader2,
    Clock,
    AlertTriangle,
    Terminal,
    Send,
} from 'lucide-react'
import CodeEditor from '@uiw/react-textarea-code-editor'
import { useCriarSubmissao, useSubmissaoWebSocket } from '../submissao.hooks'
import type { Linguagem, StatusSubmissao, ResultadoCasoTeste } from '../submissao.types'
import { useCodeEditor } from '../../../contexts/CodeEditorContext'

// ─── Constantes ───────────────────────────────────────────────────────────────

const LINGUAGENS: { valor: Linguagem; label: string; extensao: string }[] = [
    { valor: 'PYTHON', label: 'Python', extensao: '.py' },
    { valor: 'CPP', label: 'C++', extensao: '.cpp' },
    { valor: 'JAVA', label: 'Java', extensao: '.java' },
    { valor: 'C', label: 'C', extensao: '.c' },
    { valor: 'JAVASCRIPT', label: 'JavaScript', extensao: '.js' },
]

const LANG_PARA_PRISM: Record<Linguagem, string> = {
    PYTHON: 'python',
    CPP: 'cpp',
    JAVA: 'java',
    C: 'c',
    JAVASCRIPT: 'js',
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function BadgeStatus({ status }: { status: StatusSubmissao }) {
    const config: Record<StatusSubmissao, { cor: string; label: string }> = {
        PENDENTE: { cor: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', label: 'Pendente' },
        PROCESSANDO: { cor: 'text-blue-400 bg-blue-400/10 border-blue-400/30', label: 'Processando' },
        ACEITO: { cor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30', label: 'Aceito' },
        REJEITADO: { cor: 'text-red-400 bg-red-400/10 border-red-400/30', label: 'Rejeitado' },
        COMPILATION_ERROR: { cor: 'text-orange-400 bg-orange-400/10 border-orange-400/30', label: 'Erro de Compilação' },
    }
    const { cor, label } = config[status]
    return (
        <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${cor}`}>
            {label}
        </span>
    )
}

function CartaoCasoTeste({
    resultado,
    index,
    visivel,
}: {
    resultado: ResultadoCasoTeste
    index: number
    visivel: boolean
}) {
    const aprovado = resultado.erro === null

    return (
        <div
            className={`
        flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-mono
        transition-all duration-500
        ${visivel ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
        ${aprovado
                    ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300'
                    : 'border-red-500/30 bg-red-500/5 text-red-300'
                }
      `}
        >
            <div className="flex items-center gap-3">
                {aprovado
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    : <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                }
                <span className="text-spif-text font-semibold">Caso #{index + 1}</span>
                {resultado.erro && (
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                        {resultado.erro.replace(/_/g, ' ')}
                    </span>
                )}
            </div>
            {resultado.tempoGasto !== null && (
                <div className="flex items-center gap-1.5 text-xs text-spif-secondary">
                    <Clock className="w-3 h-3" />
                    {(resultado.tempoGasto * 1000).toFixed(0)}ms
                </div>
            )}
        </div>
    )
}

// ─── Componente Principal ─────────────────────────────────────────────────────

type Props = {
    isOpen: boolean
    onClose: () => void
    problemaId: number
    alunoId: number
}

type Tela = 'editor' | 'feedback'

export default function SubmissaoModal({ isOpen, onClose, problemaId, alunoId }: Props) {
    const { linguagem, codigo, setLinguagem, setCodigo } = useCodeEditor()
    const [tela, setTela] = useState<Tela>('editor')
    const [erroValidacao, setErroValidacao] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { mutate: criarSubmissao, isPending: enviando } = useCriarSubmissao(problemaId)
    const { progresso, aguardando, iniciarEspera, resetar } = useSubmissaoWebSocket(alunoId, problemaId)

    // Reseta ao fechar
    useEffect(() => {
        if (!isOpen) {
            setTela('editor')
            setErroValidacao(null)
            resetar()
        }
    }, [isOpen, resetar])

    const handleEnviar = () => {
        criarSubmissao(
            {
                linguagem,
                codigo
            },
            {
                onSuccess: () => {
                    iniciarEspera()
                    setTela('feedback')
                },
                onError: () => {
                    setErroValidacao('Falha ao enviar submissão. Tente novamente.')
                },
            },
        )
    }

    const handleArquivo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (ev) => setCodigo(ev.target?.result as string ?? '')
        reader.readAsText(file)

        // Detecta linguagem pela extensão
        const ext = file.name.split('.').pop()?.toLowerCase()
        const map: Record<string, Linguagem> = {
            py: 'PYTHON',
            cpp: 'CPP',
            java: 'JAVA',
            c: 'C',
            js: 'JAVASCRIPT',
        }
        if (ext && map[ext]) setLinguagem(map[ext])
        e.target.value = ''
    }

    const isTerminado = !aguardando && tela === 'feedback' && progresso.submissaoId !== null
    const isFeedbackCarregando = tela === 'feedback' && aguardando

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-7xl flex flex-col glass-card overflow-hidden animate-in fade-in zoom-in-95 duration-300">

                {/* ── Cabeçalho ── */}
                <header className="flex items-center justify-between px-6 py-4 border-b border-spif-card-border shrink-0">
                    <div className="flex items-center gap-3">
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-spif-text">
                                {tela === 'editor' ? 'Submeter Solução' : 'Resultado do Juiz'}
                            </h2>
                            {tela === 'feedback' && (
                                <div className="mt-0.5">
                                    <BadgeStatus status={progresso.status} />
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-spif-secondary hover:text-spif-text hover:bg-spif-card-border/50 transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </header>

                {/* ── Corpo ── */}
                <div className="flex-1 overflow-y-auto">

                    {/* TELA: EDITOR */}
                    {tela === 'editor' && (
                        <div className="p-6 space-y-5">
                            {/* Seletor de Linguagem */}
                            <div className="space-y-2">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-spif-secondary">
                                    Linguagem
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {LINGUAGENS.map((lng) => (
                                        <button
                                            key={lng.valor}
                                            onClick={() => setLinguagem(lng.valor)}
                                            className={`
                                                        px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg border transition-all
                                                        ${linguagem === lng.valor
                                                    ? 'bg-spif-primary text-spif-bg border-spif-primary shadow-md shadow-spif-primary/20'
                                                    : 'bg-spif-card text-spif-secondary border-spif-card-border hover:border-spif-secondary hover:text-spif-text'
                                                }
                                            `}
                                        >
                                            {lng.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Editor de Código */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-spif-secondary">
                                        Código
                                    </p>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-spif-primary hover:text-spif-primary-hover transition-colors"
                                    >
                                        <Upload className="w-3 h-3" />
                                        Importar arquivo
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".py,.cpp,.java,.c,.js"
                                        onChange={handleArquivo}
                                        className="hidden"
                                    />
                                </div>

                                <div className="rounded-xl overflow-hidden border border-spif-card-border bg-[#0d1117]">
                                    <CodeEditor
                                        value={codigo}
                                        language={LANG_PARA_PRISM[linguagem]}
                                        placeholder={`// Digite seu código aqui...`}
                                        onChange={(e) => setCodigo(e.target.value)}
                                        padding={16}
                                        style={{
                                            fontSize: 13,
                                            fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                                            minHeight: '300px',
                                            backgroundColor: 'transparent',
                                            color: '#e2e8f0',
                                        }}
                                        className="w-full"
                                    />
                                </div>

                                {erroValidacao && (
                                    <p className="text-xs text-red-400 flex items-center gap-1.5">
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                        {erroValidacao}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* TELA: FEEDBACK */}
                    {tela === 'feedback' && (
                        <div className="p-6 space-y-6">
                            {/* Carregando */}
                            {isFeedbackCarregando && (
                                <div className="flex flex-col items-center justify-center gap-4 py-12">
                                    <div className="relative">
                                        <div className="w-16 h-16 rounded-full border-2 border-spif-primary/20" />
                                        <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-t-spif-primary animate-spin" />
                                        <Terminal className="absolute inset-0 m-auto w-6 h-6 text-spif-primary" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-spif-text">Juiz processando...</p>
                                        <p className="text-xs text-spif-secondary mt-1">Aguarde enquanto os casos de teste são executados</p>
                                    </div>
                                </div>
                            )}

                            {/* Erro de Compilação */}
                            {isTerminado && progresso.status === 'COMPILATION_ERROR' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-orange-400">
                                        <AlertTriangle className="w-5 h-5" />
                                        <span className="text-sm font-bold uppercase tracking-widest">Erro de Compilação</span>
                                    </div>
                                    <pre className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 text-xs font-mono text-orange-200 overflow-x-auto whitespace-pre-wrap max-h-60">
                                        {progresso.erroCompilacao}
                                    </pre>
                                </div>
                            )}

                            {/* Resultados dos Casos de Teste */}
                            {isTerminado && progresso.status !== 'COMPILATION_ERROR' && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] uppercase tracking-widest font-bold text-spif-secondary">
                                            Casos de Teste
                                        </p>
                                        <span className="text-xs text-spif-secondary">
                                            {progresso.resultados.filter(r => r.erro === null).length}/{progresso.resultados.length} aprovados
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {progresso.resultados.map((resultado, i) => (
                                            <CartaoCasoTeste
                                                key={resultado.casoTesteId}
                                                resultado={resultado}
                                                index={i}
                                                visivel={true}
                                            />
                                        ))}
                                        {progresso.resultados.length === 0 && (
                                            <p className="text-xs text-spif-secondary text-center py-4">
                                                Nenhum caso de teste retornado.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Rodapé ── */}
                <footer className="px-6 py-4 border-t border-spif-card-border flex items-center justify-between gap-3 shrink-0 bg-spif-card/50">
                    {tela === 'editor' ? (
                        <>
                            <button
                                onClick={onClose}
                                className="px-4 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl border border-spif-card-border text-spif-secondary hover:text-spif-text hover:border-spif-secondary transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleEnviar}
                                disabled={enviando}
                                className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl bg-spif-primary hover:bg-spif-primary-hover text-spif-bg shadow-lg shadow-spif-primary/20 hover:scale-[1.02] active:scale-100 transition-all disabled:opacity-50 disabled:scale-100"
                            >
                                {enviando
                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                    : <Send className="w-4 h-4 fill-spif-bg" />
                                }
                                {enviando ? 'Enviando...' : 'Enviar Solução'}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => { setTela('editor'); resetar() }}
                                className="px-4 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl border border-spif-card-border text-spif-secondary hover:text-spif-text hover:border-spif-secondary transition-all"
                            >
                                ← Editar Código
                            </button>
                            <button
                                onClick={onClose}
                                className="px-4 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl bg-spif-primary hover:bg-spif-primary-hover text-spif-bg transition-all"
                            >
                                Concluir
                            </button>
                        </>
                    )}
                </footer>
            </div>
        </div>
    )
}