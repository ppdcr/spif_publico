import { useState } from 'react'
import type { ListaProblemasResponse } from '../lista.types'
import { Eye, EyeOff, Loader2, Trash2 } from 'lucide-react'
import { getDataStatus, statusData } from '../../../shared/utils/card.utils'

interface ListaCardProps {
  lista: ListaProblemasResponse
  action?: React.ReactNode
  footerText?: string
  isAtivo?: boolean
  onAtualizarAtivo?: (ativo: boolean) => Promise<void>
  onClick?: () => void
  bloqueada?: boolean | null
  onRemover?: () => void
}

export default function ListaCard({
  lista,
  action,
  footerText,
  isAtivo,
  onAtualizarAtivo,
  onClick,
  bloqueada,
  onRemover,
}: ListaCardProps) {
  const [isUpdatingAtivo, setIsUpdatingAtivo] = useState(false)

  const status = getDataStatus(lista.dataInicio!, lista.dataFim)
  const statusConfig = statusData[status]
  const StatusIcon = statusConfig.icon

  const handleToggleAtivo = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!onAtualizarAtivo || isAtivo === undefined) return
    setIsUpdatingAtivo(true)
    try {
      await onAtualizarAtivo(!isAtivo)
    } finally {
      setIsUpdatingAtivo(false)
    }
  }

  const hasToggleAction = onAtualizarAtivo !== undefined && isAtivo !== undefined
  const hasFooterActions = Boolean(onRemover || action || hasToggleAction)
  const porcentagem = (lista.porcentagemConclusao ?? 0) * 100
  const isClickable = onClick && !bloqueada

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      className={`
        group relative flex flex-col p-4 glass-card border border-spif-card-border
        transition-all duration-300 overflow-hidden
        ${isClickable ? 'cursor-pointer hover:scale-[1.02] hover:bg-spif-card/80' : ''}
        ${bloqueada ? 'opacity-60 cursor-not-allowed' : ''}
      `}
    >
      {/* Overlay de bloqueio */}
      {bloqueada && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-spif-bg/60 backdrop-blur-[2px] rounded-[inherit]">
          <p className="text-[11px] font-black uppercase tracking-widest text-spif-secondary">
            {status === 'AGENDADA' ? 'Não iniciada' : 'Encerrada'}
          </p>
          <p className="text-[10px] text-spif-secondary opacity-60 text-center px-4">
            {status === 'AGENDADA'
              ? `Começa em ${new Date(lista.dataInicio!).toLocaleDateString()}`
              : `Encerrou em ${lista.dataFim ? new Date(lista.dataFim).toLocaleDateString() : '—'}`}
          </p>
        </div>
      )}

      {/* ── Corpo ── */}
      <div className="flex items-start justify-between gap-4 flex-1 relative z-10">
        <div className="flex-1 min-w-0">
          {/* Badge de status de data */}
          {(lista.dataInicio || lista.dataFim) && (
            <div className="flex items-center gap-2 mb-2">
              <span className={`flex items-center gap-1 px-2 py-0.5 border text-[9px] font-black uppercase tracking-widest rounded-full ${statusConfig.className}`}>
                {StatusIcon && <StatusIcon className="w-2.5 h-2.5" />}
                {statusConfig.label}
              </span>
            </div>
          )}

          <h3 className="text-xl font-bold tracking-tight text-spif-text transition-all group-hover:text-spif-primary leading-tight line-clamp-2">
            {lista.titulo}
          </h3>
        </div>
      </div>

      {/* Barra de progresso */}
      {lista.porcentagemConclusao !== null && (
        <div className="relative z-10 mt-3 w-full bg-spif-bg/50 rounded-full h-1.5 overflow-hidden border border-spif-card-border/30">
          <div
            className="bg-spif-primary h-full transition-all duration-1000 ease-out"
            style={{ width: `${porcentagem}%` }}
          />
        </div>
      )}

      {/* ── Rodapé de Ações — mesmo padrão do ProblemaCard ── */}
      {hasFooterActions && (
        <div className="relative z-10 mt-6 pt-4 border-t border-spif-card-border flex flex-wrap items-center justify-between gap-3">

          {/* Lado esquerdo: toggle ativo/inativo */}
          <div className="flex items-center gap-2">
            {hasToggleAction && (
              <button
                onClick={handleToggleAtivo}
                disabled={isUpdatingAtivo}
                className={`
                  flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all
                  ${isAtivo
                    ? 'text-spif-secondary border-spif-card-border hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
                    : 'text-amber-500 border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20'
                  }
                  ${isUpdatingAtivo ? 'opacity-50 cursor-wait' : ''}
                `}
              >
                {isUpdatingAtivo
                  ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  : isAtivo
                    ? <Eye className="w-3.5 h-3.5" />
                    : <EyeOff className="w-3.5 h-3.5" />
                }
                <span>{isAtivo ? 'Ativo' : 'Inativo'}</span>
              </button>
            )}
            {footerText && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-spif-secondary opacity-60">
                {footerText}
              </span>
            )}
          </div>

          {/* Lado direito: ações de contexto */}
          <div className="flex items-center gap-2 ml-auto">
            {action}
            {onRemover && (
              <button
                onClick={(e) => { e.stopPropagation(); onRemover() }}
                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-spif-card-border text-spif-secondary hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remover</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}