import { type PercursoResponse } from '../percurso.types'

interface PercursoCardProps {
  percurso: PercursoResponse
  onClick?: () => void
}

export default function PercursoCard({ percurso, onClick }: PercursoCardProps) {
  const porcentagem = (percurso.porcentagemConclusao || 0) * 100

  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col p-4 glass-card border border-spif-card-border overflow-hidden fade-out duration-300 ${onClick ? 'cursor-pointer hover:scale-[1.02] hover:bg-spif-card/80' : ''}`}
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-spif-primary/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none group-hover:bg-spif-primary/10 fade-out duration-300" />

      <div className="flex flex-col h-full relative z-10">
        {percurso.porcentagemConclusao !== null && (
          <div className="flex justify-end items-start">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-spif-card border border-spif-card-border text-[10px] font-black uppercase tracking-widest text-spif-secondary">
                {porcentagem < 1 ? 'não iniciado' : `${porcentagem.toFixed(0)}% concluído`}
              </div>
          </div>
        )}

          <div>
            <h3 className="text-xl font-black tracking-tight text-spif-text fade-out duration-300 group-hover:text-spif-primary leading-tight">
              {percurso.nome}
            </h3>
          </div>

        {percurso.porcentagemConclusao !== null && (
          <div className="mt-2">
            {/* Progress Bar */}
            <div className="w-full bg-spif-bg/50 rounded-full h-1.5 overflow-hidden border border-spif-card-border/30">
              <div
                className="bg-spif-primary h-full fade-out duration-300"
                style={{ width: `${porcentagem}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
