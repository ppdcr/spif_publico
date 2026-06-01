import { Play, List, MessageSquare, Terminal } from 'lucide-react'

type Props = {
  onAbrirSubmissao: () => void
  onAbrirHistorico: () => void
  onAbrirChat: () => void
}

export default function AlunoPanel({ onAbrirSubmissao, onAbrirHistorico, onAbrirChat }: Props) {
  const buttonBaseClass = `
    w-full flex items-center justify-center gap-2 py-3.5 px-4 text-xs font-bold uppercase tracking-widest rounded-xl
    transition-all duration-300 disabled:opacity-50
  `

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center gap-2 border-b border-spif-card-border pb-4">
        <Terminal className="w-4 h-4 text-spif-primary" />
        <h3 className="text-xs tracking-widest uppercase font-bold text-spif-text">
          Ações
        </h3>
      </header>

      <div className="flex flex-col gap-4">
        {/* Ação Primária */}
        <button
          onClick={onAbrirSubmissao}
          className={`${buttonBaseClass} bg-spif-primary hover:bg-spif-primary-hover text-spif-bg shadow-lg shadow-spif-primary/20 hover:scale-[1.02]`}
        >
          <Play className="w-4 h-4 fill-spif-bg" /> Submeter Solução
        </button>

        {/* Ações Secundárias */}
        <button
          onClick={onAbrirHistorico}
          className={`${buttonBaseClass} bg-spif-card border border-spif-card-border text-spif-secondary hover:text-spif-text hover:border-spif-secondary`}
        >
          <List className="w-4 h-4" /> Minhas Submissões
        </button>

        <button
          onClick={onAbrirChat}
          className={`${buttonBaseClass} bg-spif-primary/5 border border-dashed border-spif-primary/30 text-spif-primary hover:bg-spif-primary/10 hover:border-spif-primary/50`}
        >
          <MessageSquare className="w-4 h-4" /> Chat com IA
        </button>
      </div>
    </div>
  )
}