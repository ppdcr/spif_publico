import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getDificuldadeTexto, getDificuldadeCor } from '../problema.utils'
import type { ProblemaResumoResponse } from '../problema.types'
import { CheckCircle2, EyeOff, Eye, Plus, Trash2 } from 'lucide-react'

interface ProblemaCardProps {
  problema: ProblemaResumoResponse
  isOwnProblem?: boolean
  isAtribuido?: boolean
  onAtualizarVisivel?: (visivel: boolean) => Promise<void>
  onAtribuir?: (problemaId: number) => void
  onRemover?: (problemaId: number) => void
  onClick?: () => void
}

export default function ProblemaCard({
  problema,
  isOwnProblem = false,
  isAtribuido,
  onAtualizarVisivel,
  onAtribuir,
  onRemover,
  onClick
}: ProblemaCardProps) {
  const navigate = useNavigate()
  const [isUpdatingVisivel, setIsUpdatingVisivel] = useState(false)

  const dificuldadeTexto = getDificuldadeTexto(problema.dificuldade)
  const dificuldadeCor = getDificuldadeCor(dificuldadeTexto)

  const handleToggleVisivel = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!onAtualizarVisivel) return

    setIsUpdatingVisivel(true)
    try {
      await onAtualizarVisivel(!problema.visivel)
    } finally {
      setIsUpdatingVisivel(false)
    }
  }

  const hasFooterActions = isOwnProblem || onAtribuir || onRemover;

  return (
    <div
      onClick={onClick || (() => navigate(`/problemas/${problema.id}`))}
      className="group relative flex flex-col p-4 glass-card border border-spif-card-border transition-all duration-300 hover:scale-[1.02] hover:bg-spif-card/80 cursor-pointer"
    >

      <div className="flex items-start justify-between gap-6 flex-1">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-xs uppercase tracking-widest font-black px-2 py-0.5 rounded-sm"
              style={{ color: dificuldadeCor }}
            >
              {dificuldadeTexto}
            </span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-spif-text transition-all group-hover:text-spif-primary">
            {problema.titulo}
          </h2>
        </div>

        {problema.acertou && (
          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-center gap-1.5 text-spif-primary bg-spif-primary/10 border border-spif-primary/30 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Resolvido</span>
            </div>
          </div>
        )}
      </div>

      {/* Rodapé de Ações Dinâmico */}
      {hasFooterActions && (
        <div className="mt-6 pt-4 border-t border-spif-card-border flex flex-wrap items-center justify-between gap-3">

          {/* Lado Esquerdo: Ações do Dono (Visibilidade) */}
          <div className="flex items-center gap-2 flex-wrap">
            {isOwnProblem && (
              <button
              onClick={handleToggleVisivel}
              disabled={isUpdatingVisivel}
              className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all text-spif-secondary border-spif-card-border 
                ${problema.visivel
                ? 'hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30'
                : 'hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30'
                } ${isUpdatingVisivel ? 'opacity-50 cursor-wait' : ''}`}
            >
              {problema.visivel ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{problema.visivel ? 'Visível' : 'Privado'}</span>
            </button>
            )}
          </div>

          {/* Lado Direito: Ações de Contexto (Atribuir/Remover) */}
          <div className="flex items-center gap-2 ml-auto">
            {onAtribuir && (
              <button
                disabled={isAtribuido}
                onClick={(e) => {
                  e.stopPropagation()
                  if (!isAtribuido) onAtribuir(problema.id)
                }}
                className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border transition-all ${isAtribuido
                  ? 'opacity-50 cursor-not-allowed bg-spif-primary/10 text-spif-primary border-spif-primary/30'
                  : 'text-spif-secondary border-spif-card-border hover:bg-spif-primary/10 hover:text-spif-primary hover:border-spif-primary/30'
                  }`}
              >
                {isAtribuido ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{isAtribuido ? 'Atribuído' : 'Atribuir'}</span>
              </button>
            )}

            {onRemover && isAtribuido && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemover(problema.id);
                }}
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