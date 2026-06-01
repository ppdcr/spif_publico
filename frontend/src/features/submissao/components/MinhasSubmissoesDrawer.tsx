import { useState } from 'react'
import {
    ChevronDown,
    CheckCircle2,
    XCircle,
    Clock,
    AlertTriangle,
    Loader2,
} from 'lucide-react'
import { useListarSubmissoes, useBuscarSubmissaoDetalhe } from '../submissao.hooks'
import type { StatusSubmissao, SubmissaoResumo } from '../submissao.types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<StatusSubmissao, { cor: string; label: string; icone: React.ReactNode }> = {
    PENDENTE: {
        cor: 'text-yellow-400',
        label: 'Pendente',
        icone: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
    },
    PROCESSANDO: {
        cor: 'text-blue-400',
        label: 'Processando',
        icone: <Loader2 className="w-3.5 h-3.5 animate-spin" />,
    },
    ACEITO: {
        cor: 'text-emerald-400',
        label: 'Aceito',
        icone: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    REJEITADO: {
        cor: 'text-red-400',
        label: 'Rejeitado',
        icone: <XCircle className="w-3.5 h-3.5" />,
    },
    COMPILATION_ERROR: {
        cor: 'text-orange-400',
        label: 'Erro de Compilação',
        icone: <AlertTriangle className="w-3.5 h-3.5" />,
    },
}

// ─── Card de Detalhe expandível ───────────────────────────────────────────────

function CardSubmissao({
    submissao,
    problemaId,
}: {
    submissao: SubmissaoResumo
    problemaId: number
}) {
    const [aberto, setAberto] = useState(false)
    const { data: detalhe, isLoading } = useBuscarSubmissaoDetalhe(
        problemaId,
        aberto ? submissao.id : null,
    )
    const config = STATUS_CONFIG[submissao.status]

    return (
        <div className="rounded-xl border border-spif-card-border bg-spif-card overflow-hidden transition-all">
            {/* Cabeçalho do card */}
            <button
                onClick={() => setAberto((a) => !a)}
                className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-spif-bg/40 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide ${config.cor}`}>
                        {config.icone}
                        {config.label}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-spif-secondary border border-spif-card-border rounded-md px-2 py-0.5">
                        {submissao.linguagem}
                    </span>
                </div>
                <div className="flex items-center gap-3 text-spif-secondary">
                    <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${aberto ? 'rotate-180' : ''}`}
                    />
                </div>
            </button>

            {/* Conteúdo expandido */}
            {aberto && (
                <div className="border-t border-spif-card-border animate-in fade-in slide-in-from-top-2 duration-200">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8 gap-2 text-spif-secondary text-xs">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Carregando detalhes...
                        </div>
                    ) : detalhe ? (
                        <div className="p-4 space-y-4">
                            {/* Código */}
                            <div className="space-y-2">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-spif-secondary flex items-center gap-1.5">
                                    Código Enviado
                                </p>
                                <pre className="p-3 rounded-lg bg-[#0d1117] border border-spif-card-border text-xs font-mono text-slate-300 overflow-x-auto max-h-48 overflow-y-auto whitespace-pre">
                                    {detalhe.codigo}
                                </pre>
                            </div>

                            {/* Resultados */}
                            {detalhe.resultados && detalhe.resultados.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-spif-secondary">
                                        Casos de Teste
                                    </p>
                                    <div className="space-y-1.5">
                                        {detalhe.resultados.map((r, i) => {
                                            const aprovado = r.erro === null
                                            return (
                                                <div
                                                    key={r.casoTesteId}
                                                    className={`
                            flex items-center justify-between px-3 py-2 rounded-lg border text-xs
                            ${aprovado
                                                            ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-300'
                                                            : 'border-red-500/20 bg-red-500/5 text-red-300'
                                                        }
                          `}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {aprovado
                                                            ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                                            : <XCircle className="w-3.5 h-3.5 text-red-400" />
                                                        }
                                                        <span className="font-semibold text-spif-text">Caso #{i + 1}</span>
                                                        {r.erro && (
                                                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                                                                {r.erro.replace(/_/g, ' ')}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {r.tempoGasto !== null && (
                                                        <div className="flex items-center gap-1 text-spif-secondary">
                                                            <Clock className="w-3 h-3" />
                                                            {(r.tempoGasto * 1000).toFixed(0)}ms
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-xs text-spif-secondary text-center py-6">
                            Não foi possível carregar os detalhes.
                        </p>
                    )}
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
}

export default function MinhasSubmissoesDrawer({ isOpen, onClose, problemaId }: Props) {
    const { data: submissoes, isLoading, isError } = useListarSubmissoes(problemaId)

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Drawer */}
            <div
                className={`
                    fixed top-0 right-0 z-50 h-full w-full max-w-md
                    flex flex-col bg-spif-card border-l border-spif-card-border shadow-2xl
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                {/* Cabeçalho */}
                <header className="flex items-center justify-between px-6 py-5 border-b border-spif-card-border shrink-0">
                    <div className="flex items-center gap-3">
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-widest text-spif-text">
                                Minhas Submissões
                            </h2>
                        </div>
                    </div>
                </header>

                {/* Lista */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-spif-secondary">
                            <Loader2 className="w-6 h-6 animate-spin text-spif-primary" />
                            <span className="text-xs uppercase tracking-widest font-bold">Carregando...</span>
                        </div>
                    )}

                    {isError && (
                        <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-400">
                            <AlertTriangle className="w-6 h-6" />
                            <span className="text-xs uppercase tracking-widest font-bold">Falha ao carregar</span>
                        </div>
                    )}

                    {!isLoading && !isError && (!submissoes || submissoes.length === 0) && (
                        <div className="flex flex-col items-center justify-center py-20 gap-4 text-spif-secondary">
                            <div className="text-center">
                                <p className="text-sm font-bold text-spif-text">Nenhuma submissão</p>
                                <p className="text-xs mt-1">Envie sua primeira solução para ver o histórico aqui.</p>
                            </div>
                        </div>
                    )}

                    {submissoes?.map((s) => (
                        <CardSubmissao key={s.id} submissao={s} problemaId={problemaId} />
                    ))}
                </div>
            </div>
        </>
    )
}