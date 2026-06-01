import { Check, Inbox } from 'lucide-react'
import type { TurmaResponse } from '../turma.types'

interface TurmaCardProps {
  turma: TurmaResponse
  onClick?: () => void
  // Convite pendente — mostra badge + botão aceitar
  isConvite?: boolean
  onAceitar?: (turmaId: number) => void
}

export default function TurmaCard({ turma, onClick, isConvite, onAceitar }: TurmaCardProps) {
  const porcentagem = (turma.porcentagemConclusao ?? 0) * 100

  return (
    <div
      onClick={!isConvite ? onClick : undefined}
      className={`
        group relative flex flex-col gap-3 p-4 glass-card border border-spif-card-border
        overflow-hidden transition-all duration-300
        ${!isConvite && onClick ? 'cursor-pointer hover:scale-[1.02] hover:bg-spif-card/80' : ''}
      `}
    >
      {/* Glow de fundo */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-spif-primary/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none group-hover:bg-spif-primary/10 transition-all duration-300" />

      {/* Nome + ação inline */}
      <div className="flex items-start justify-between gap-3 relative z-10">
        <h3 className={`
          text-lg font-black tracking-tight leading-tight
          ${!isConvite && onClick ? 'group-hover:text-spif-primary' : ''}
          text-spif-text transition-colors duration-300
        `}>
          {turma.nome}
        </h3>

        {/* Badge convite ou botão aceitar */}
        {isConvite ? (
          <button
            onClick={(e) => { e.stopPropagation(); onAceitar?.(turma.id) }}
            className="flex items-center gap-1.5 shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg border border-spif-primary/30 text-spif-primary bg-spif-primary/10 hover:bg-spif-primary hover:text-spif-bg transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            Aceitar
          </button>
        ) : turma.porcentagemConclusao !== null ? (
          <span className="flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-full bg-spif-card border border-spif-card-border text-[10px] font-black uppercase tracking-widest text-spif-secondary">
            {porcentagem < 1 ? 'não iniciado' : `${porcentagem.toFixed(0)}%`}
          </span>
        ) : null}
      </div>

      {/* Barra de progresso */}
      {!isConvite && turma.porcentagemConclusao !== null && (
        <div className="relative z-10 w-full bg-spif-bg/50 rounded-full h-1.5 overflow-hidden border border-spif-card-border/30">
          <div
            className="bg-spif-primary h-full transition-all duration-300"
            style={{ width: `${porcentagem}%` }}
          />
        </div>
      )}

      {/* Label de convite pendente */}
      {isConvite && (
        <div className="relative z-10 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-spif-secondary">
          <Inbox className="w-3 h-3" />
          Convite pendente
        </div>
      )}
    </div>
  )
}