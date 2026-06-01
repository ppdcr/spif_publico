import { useEffect, useRef, useState } from 'react'
import {
    Send,
    Loader2,
    Bot,
    User,
    AlertTriangle,
} from 'lucide-react'
import { useListarMensagensProblema, useEnviarMensagemProblema } from '../../mensagem/mensagem.hooks'
import { useCodeEditor } from '../../../contexts/CodeEditorContext'
import ReactMarkdown from 'react-markdown'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatarHora(iso: string | null | undefined): string {
    if (!iso) return ''
    return new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(iso))
}

// ─── Bolha de Mensagem ────────────────────────────────────────────────────────

function BolhaMensagem({
    conteudo,
    remetente,
    horario,
}: {
    conteudo: string
    remetente: 'USER' | 'MODEL' | undefined
    horario: string | null | undefined
}) {
    const isIA = remetente === 'MODEL'

    return (
        <div className={`flex items-start gap-3 w-full ${isIA ? 'justify-start' : 'justify-end'}`}>
            
            {/* Ícone da IA (Sempre à esquerda se for IA) */}
            {isIA && (
                <div className="w-8 h-8 rounded-full bg-spif-primary/10 border border-spif-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-spif-primary" />
                </div>
            )}

            {/* Container do Balão + Horário */}
            <div className={`flex flex-col max-w-[75%] ${isIA ? 'items-start' : 'items-end'}`}>
                
                {/* Balão de Mensagem */}
                <div
                    className={`
                        px-4 py-3 rounded-2xl text-sm leading-relaxed break-words
                        ${isIA
                            ? 'bg-spif-card border border-spif-card-border text-spif-text rounded-tl-sm' // IA: Fundo do card neutro, sem verde
                            : 'bg-spif-primary text-spif-bg rounded-br-sm' // Usuário: Mantém o destaque (verde/cor principal)
                        }
                    `}
                >
                    <ReactMarkdown
                        components={{
                            strong: ({ node, ...props }) => (
                                <strong className="font-extrabold text-inherit" {...props} />
                            ),
                            code: ({ node, ...props }) => (
                                <code 
                                    className={`px-1.5 py-0.5 rounded font-mono text-xs ${
                                        isIA 
                                            ? 'bg-spif-bg text-spif-primary' 
                                            : 'bg-black/20 text-white'
                                    }`} 
                                    {...props} 
                                />
                            ),
                            p: ({ node, ...props }) => <p className="mb-1 last:mb-0" {...props} />
                        }}
                    >
                        {conteudo}
                    </ReactMarkdown>
                </div>

                {/* Horário */}
                {horario && (
                    <span className="text-[10px] text-spif-secondary mt-1 px-1">
                        {formatarHora(horario)}
                    </span>
                )}
            </div>

            {/* Ícone do Usuário (Sempre à direita se for Usuário) */}
            {!isIA && (
                <div className="w-8 h-8 rounded-full bg-spif-card border border-spif-card-border flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-spif-secondary" />
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

export default function ChatIaDrawer({ isOpen, onClose, problemaId }: Props) {
    const { codigo } = useCodeEditor()
    const [mensagem, setMensagem] = useState('')
    const [anexarCodigo, setAnexarCodigo] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const { data: mensagens, isLoading, isError } = useListarMensagensProblema(problemaId)
    const { mutate: enviarMensagem, isPending: enviando } = useEnviarMensagemProblema(problemaId)

    // Auto-scroll ao chegar novas mensagens
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [mensagens])

    // Auto-resize do textarea
    useEffect(() => {
        const ta = textareaRef.current
        if (!ta) return
        ta.style.height = 'auto'
        ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`
    }, [mensagem])

    const handleEnviar = () => {
        const conteudo = mensagem.trim()
        if (!conteudo || enviando) return

        const payload: { conteudo: string; codigo?: string } = { conteudo }
        if (anexarCodigo && codigo.trim()) {
            payload.codigo = codigo
        }

        enviarMensagem(payload, {
            onSuccess: () => {
                setMensagem('')
                setAnexarCodigo(false)
            },
        })
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleEnviar()
        }
    }

    const temCodigo = codigo.trim().length > 0

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
                {/* ── Cabeçalho ── */}
                <header className="flex items-center justify-center px-6 py-5 border-b border-spif-card-border shrink-0">
                    <h2 className="text-md font-black uppercase tracking-widest text-spif-text">
                        AJUDA
                    </h2>
                </header>

                {/* ── Área de Mensagens ── */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-spif-secondary">
                            <Loader2 className="w-6 h-6 animate-spin text-spif-primary" />
                            <span className="text-xs uppercase tracking-widest font-bold">Carregando conversa...</span>
                        </div>
                    )}

                    {isError && (
                        <div className="flex flex-col items-center justify-center h-full gap-3 text-red-400">
                            <AlertTriangle className="w-6 h-6" />
                            <span className="text-xs uppercase tracking-widest font-bold">Falha ao carregar</span>
                        </div>
                    )}

                    {!isLoading && !isError && (!mensagens || mensagens.length === 0) && (
                        <div className="flex flex-col items-center justify-center h-full gap-5 text-spif-secondary px-6">
                            <div className="text-center space-y-2">
                                <p className="text-md font-bold text-spif-text">Olá! Eu sou Robito, seu ajudante.</p>
                                <p className="text-xs leading-relaxed">
                                    Faça perguntas sobre o problema, peça dicas ou anexe seu código para receber feedback.
                                </p>
                            </div>
                        </div>
                    )}

                    {mensagens?.map((msg) => (
                        <BolhaMensagem
                            key={msg.id}
                            conteudo={msg.conteudo}
                            remetente={msg.remetente}
                            horario={msg.horarioEnviada}
                        />
                    ))}

                    {/* Indicador de digitação da IA */}
                    {enviando && (
                        <div className="flex items-end gap-2.5 justify-start">
                            <div className="w-7 h-7 rounded-full bg-spif-primary/10 border border-spif-primary/20 flex items-center justify-center shrink-0">
                                <Bot className="w-3.5 h-3.5 text-spif-primary" />
                            </div>
                            <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-spif-bg border border-spif-card-border">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-spif-primary/60 animate-bounce [animation-delay:0ms]" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-spif-primary/60 animate-bounce [animation-delay:150ms]" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-spif-primary/60 animate-bounce [animation-delay:300ms]" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* ── Rodapé: Input ── */}
                <footer className="px-4 py-4 border-t border-spif-card-border shrink-0 space-y-3 bg-spif-card/50">
                    {/* Opção: Anexar Código */}
                    <label
                        className={`
                        flex items-center gap-2.5 cursor-pointer group w-fit
                        ${!temCodigo ? 'opacity-40 cursor-not-allowed' : ''}
                        `}
                        >
                        <div
                            onClick={() => temCodigo && setAnexarCodigo((a) => !a)}
                            className={`
                                w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all
                                ${anexarCodigo && temCodigo
                                ? 'bg-spif-primary border-spif-primary'
                                : 'border-spif-card-border group-hover:border-spif-secondary'
                                }
                            `}
                        >
                            {anexarCodigo && temCodigo && (
                                <svg viewBox="0 0 10 8" className="w-2.5 h-2 fill-spif-bg">
                                    <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-spif-secondary group-hover:text-spif-text transition-colors select-none">
                            Anexar meu código atual
                            {!temCodigo && (
                                <span className="text-[10px] font-normal">(editor vazio)</span>
                            )}
                        </div>
                    </label>

                    {/* Área de texto + botão */}
                    <div className="flex items-center gap-2">
                        <textarea
                            className="flex-1 rounded-xl border border-spif-card-border bg-spif-bg focus-within:border-spif-primary/50 transition-colors overflow-hidden w-full px-4 py-3 text-sm bg-transparent text-spif-text placeholder:text-spif-secondary resize-none outline-none disabled:opacity-50"
                            ref={textareaRef}
                            value={mensagem}
                            onChange={(e) => setMensagem(e.target.value)}
                            onKeyDown={handleKeyDown}
                                placeholder="Digite sua dúvida..."
                                rows={1}
                                disabled={enviando}
                
                            />
                        <button
                            onClick={handleEnviar}
                            disabled={!mensagem.trim() || enviando}
                            className="w-13 h-13 rounded-xl bg-spif-primary hover:bg-spif-primary-hover text-spif-bg flex items-center justify-center shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                        >
                            {enviando
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <Send className="w-4 h-4" />
                            }
                        </button>
                    </div>
                </footer>
            </div>
        </>
    )
}