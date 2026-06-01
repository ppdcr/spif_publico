import { type DisciplinaResponse } from '../disciplina.types'
import { Calendar, ChevronRight } from 'lucide-react'

interface DisciplinaCardProps {
  disciplina: DisciplinaResponse
  action?: React.ReactNode
  onClick?: () => void
}

export default function DisciplinaCard({ disciplina, action, onClick }: DisciplinaCardProps) {
  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col p-4 glass-card border border-spif-card-border overflow-hidden transition-all duration-300 ${onClick ? 'cursor-pointer hover:scale-[1.02] hover:bg-spif-card/80' : ''}`}
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-spif-primary/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none group-hover:bg-spif-primary/10 transition-all duration-500" />

      <div className="flex flex-col h-full justify-between relative z-10">
        <div className="space-y-3 flex justify-between items-start">
          <h3 className="text-xl font-black tracking-tight text-spif-text transition-all duration-300 group-hover:text-spif-primary leading-tight">
            {disciplina.nome}
          </h3>
          
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-spif-card border border-spif-card-border text-[10px] font-black uppercase tracking-widest text-spif-secondary">
              <Calendar className="w-3 h-3" />
              {disciplina.ano}
            </div>
          </div>
        </div>

        {action && (
          <div className="flex items-center justify-end pt-4">
            <div className="flex items-center gap-3">
              {action}
              {onClick && (
                <div className="p-2 rounded-lg bg-spif-card border border-spif-card-border text-spif-secondary group-hover:text-spif-primary group-hover:border-spif-primary/30 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}