import { Loader2, Save } from 'lucide-react'
import { type CompeticaoResponse } from '../competicao.types'
import { useAuth } from '../../../contexts/AuthContext'
import { getDataStatus, statusData } from '../../../shared/utils/card.utils'

interface CompeticaoCardProps {
  competicao: CompeticaoResponse
  onClick?: () => void
  onToggleAtiva?: () => void
  bloqueada?: boolean
  isUpdating?: boolean
}

export default function CompeticaoCard({ competicao, onClick, onToggleAtiva, bloqueada, isUpdating }: CompeticaoCardProps) {
  console.log(competicao)
  const porcentagem = (competicao.porcentagemConclusao || 0) * 100
  const isConcluida = porcentagem >= 100
  const status = getDataStatus(competicao.dataInicio, competicao.dataFim)
  const statusConfig = statusData[status]
  const StatusIcon = statusConfig.icon
  const { role } = useAuth()
  const isProfessor = role === 'ROLE_PROFESSOR'

  const isClickable = onClick && !bloqueada

  return (
    <div
      className={`group relative flex flex-col p-4 glass-card border transition-all duration-300 overflow-hidden ${isClickable
        ? 'cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-spif-primary/10 hover:border-spif-primary/30'
        : bloqueada ? 'opacity-60 cursor-not-allowed' : ''
        }`}
    >
      <div onClick={isClickable ? onClick : undefined}>
        {/* Overlay de bloqueio */}
        {bloqueada && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-spif-bg/60 backdrop-blur-[2px] rounded-[inherit]">
            <p className="text-[11px] font-black uppercase tracking-widest text-spif-secondary">
              {status === 'AGENDADA' ? 'Não iniciada' : 'Encerrada'}
            </p>
            <p className="text-[10px] text-spif-secondary opacity-60 text-center px-4">
              {status === 'AGENDADA'
                ? `Começa em ${new Date(competicao.dataInicio).toLocaleDateString()}`
                : `Encerrou em ${competicao.dataFim ? new Date(competicao.dataFim).toLocaleDateString() : undefined}`}
            </p>
          </div>
        )}

        <div className='flex justify-between mb-3'>
          <h3 className="text-md font-black text-spif-text mb-2 line-clamp-1 group-hover:text-spif-primary transition-colors">
            {competicao.nome}
          </h3>

          <div className="flex justify-between mb-3">
            <span className={`flex items-center gap-1.5 px-3 py-1 border text-[10px] font-black uppercase tracking-widest rounded-full ${statusConfig.className}`}>
              {StatusIcon && <StatusIcon className="w-3 h-3" />}
              {statusConfig.label}
            </span>
          </div>
        </div>

        {competicao.porcentagemConclusao !== null && competicao.porcentagemConclusao !== undefined && (
          <div className="mt-auto space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-spif-secondary">Progresso</span>
                <span className={isConcluida ? 'text-green-500' : 'text-spif-primary'}>
                  {porcentagem === 0 ? 'Não iniciado' : `${Math.round(porcentagem)}%`}
                </span>
              </div>
              <div className="h-1.5 bg-spif-card rounded-full overflow-hidden border border-spif-card-border">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${isConcluida ? 'bg-green-500' : 'bg-spif-primary'}`}
                  style={{ width: `${Math.max(0, Math.min(100, porcentagem))}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      {isProfessor && (
        <div className="pt-4 border-t border-spif-card-border">
          <button
            onClick={onToggleAtiva}
            disabled={isUpdating}
            className="w-full flex items-center justify-center gap-2 py-2 bg-spif-primary/10 text-spif-primary border border-spif-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-spif-primary hover:text-spif-bg transition-all disabled:opacity-50"
          >
            {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {competicao.ativa ? 'Desativar' : 'Ativar'}
          </button>
        </div>
      )}
    </div>
  )
}
