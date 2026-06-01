import { type ProblemaResponse } from '../problema.types'
import { type UsuarioResponse } from '../../usuario/usuario.types'
import { Clock, HardDrive, Info, User, Calendar, Tag } from 'lucide-react'

interface DetalhesPainelProps {
  problema: ProblemaResponse
  professor: UsuarioResponse | undefined
}

export default function DetalhesPainel({
  problema,
  professor,
}: DetalhesPainelProps) {
  return (
    <div className="p-6 space-y-6 h-fit">
      {/* ── Cabeçalho do Painel ── */}
      <header className="flex items-center gap-2 border-b border-spif-card-border pb-4">
        <Info className="w-4 h-4 text-spif-primary" />
        <h3 className="text-xs tracking-widest uppercase font-bold text-spif-text">
          Info
        </h3>
      </header>

      {/* ── Limites de Sistema ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-spif-secondary">
            <Clock className="w-3.5 h-3.5" /> Tempo Limite
          </p>
          <p className="font-mono text-xl font-bold text-spif-text">
            {problema.tempoLimite}<span className="text-xs ml-1 text-spif-secondary font-sans font-medium">s</span>
          </p>
        </div>

        <div className="space-y-1.5">
          <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-spif-secondary">
            <HardDrive className="w-3.5 h-3.5" /> Memória
          </p>
          <p className="font-mono text-xl font-bold text-spif-text">
            {problema.memoriaLimiteMb}<span className="text-xs ml-1 text-spif-secondary font-sans font-medium">MB</span>
          </p>
        </div>
      </div>

      {/* ── Assuntos (Tags) ── */}
      <div className="border-t border-spif-card-border pt-6">
        <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-spif-secondary mb-3">
          <Tag className="w-3.5 h-3.5" /> Tópicos Relacionados
        </p>
        <div className="flex flex-wrap gap-2">
          {problema.assuntos && problema.assuntos.length > 0 ? (
            problema.assuntos.map((assunto) => (
              <span
                key={assunto}
                className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest bg-spif-card border border-spif-card-border text-spif-text rounded-md"
              >
                {assunto}
              </span>
            ))
          ) : (
            <p className="text-[10px] italic text-spif-secondary font-medium">
              Sem tags definidas
            </p>
          )}
        </div>
      </div>

      {/* ── Metadados de Autoria ── */}
      <div className="border-t border-spif-card-border pt-6 space-y-4">
        {professor && (
          <div>
            <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-spif-secondary mb-1.5">
              <User className="w-3.5 h-3.5" /> Autor
            </p>
            <p className="text-sm font-bold text-spif-text">
              {professor.nickname}
            </p>
          </div>
        )}

        {problema.dataCriacao && (
          <div>
            <p className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-spif-secondary mb-1.5">
              <Calendar className="w-3.5 h-3.5" /> Registro
            </p>
            <p className="text-xs font-mono font-medium text-spif-secondary">
              {new Date(problema.dataCriacao).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}