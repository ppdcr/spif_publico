
import { ChevronRight, CheckCircle2, Lock } from 'lucide-react'

import { type NivelResponse } from '../nivel.types'

interface NivelCardProps {
  nivel: NivelResponse
  onClick?: () => void
  isLocked?: boolean
}

export default function NivelCard({ nivel, onClick, isLocked }: NivelCardProps) {
  const porcentagem = (nivel.porcentagemConclusao || 0) * 100
  const isConcluido = porcentagem >= 100
  const canClick = onClick && !isLocked

  return (
    <div
      onClick={canClick ? onClick : undefined}
      className={`group relative flex items-center p-5 glass-card border transition-all duration-300 ${isLocked ? 'opacity-60 cursor-not-allowed border-spif-card-border' : (canClick ? 'cursor-pointer hover:bg-spif-card/80 hover:border-spif-primary/30' : 'border-spif-card-border')}`}
    >
      <div className="flex items-center gap-5 w-full">
        {/* Ordem / Icon */}
        <div className={`relative flex items-center justify-center w-9 h-9 rounded-xl font-black text-lg transition-all duration-500 ${isLocked ? 'bg-spif-card text-spif-secondary' : (isConcluido ? 'bg-green-500/10 text-green-500' : 'bg-spif-primary/10 text-spif-primary')}`}>
          {isLocked ? <Lock className="w-5 h-5" /> : (isConcluido ? <CheckCircle2 className="w-6 h-6" /> : nivel.ordem)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className={`font-bold transition-colors truncate ${isLocked ? 'text-spif-secondary' : 'text-spif-text group-hover:text-spif-primary'}`}>
              {nivel.nome}
            </h4>
          </div>
        </div>

        {/* Progress Badge */}
        {!isLocked && nivel.porcentagemConclusao !== null && (
          <div className="flex flex-col items-end gap-1.5 ml-4">
            <span className={`text-[10px] font-black uppercase tracking-widest ${isConcluido ? 'text-green-500' : 'text-spif-primary'}`}>
              {porcentagem < 1 ? 'não iniciado' : `${porcentagem.toFixed(0)}%`}
            </span>
            <div className="min-w-3xs max-w-xs h-1 bg-spif-bg/50 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${isConcluido ? 'bg-green-500' : 'bg-spif-primary'}`}
                style={{ width: `${porcentagem}%` }}
              />
            </div>
          </div>
        )}

        {canClick && (
          <ChevronRight className="w-4 h-4 text-spif-secondary ml-4 group-hover:translate-x-1 transition-transform" />
        )}
      </div>
    </div>
  )
}
