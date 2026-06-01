import { UserPlus, CheckCircle2, Clock } from 'lucide-react'
import type { UsuarioResumoResponse } from '../usuario.types'
import type { UsuarioStatus } from '../containers/ListaUsuariosContainer'

interface UsuarioCardProps {
  usuario: UsuarioResumoResponse
  status?: UsuarioStatus
  onClick?: () => void
  onInvite?: (usuarioId: number) => void
}

const ROLE_CONFIG: Record<string, { label: string; cor: string }> = {
  ROLE_PROFESSOR: { label: 'Professor', cor: '#10b981' },
  ROLE_ALUNO:     { label: 'Aluno',     cor: '#64748b' },
}

export default function UsuarioCard({ usuario, status, onClick, onInvite }: UsuarioCardProps) {
  const roleConfig = ROLE_CONFIG[usuario.role] ?? { label: usuario.role, cor: '#64748b' }

  const isMatriculado = status === 'MATRICULADO'
  const isConvidado   = status === 'CONVIDADO'
  const isDisponivel  = !isMatriculado && !isConvidado

  return (
    <div
      onClick={onClick}
      className={`
        group flex flex-col justify-between p-4 glass-card border border-spif-card-border
        transition-all duration-300
        ${onClick ? 'cursor-pointer hover:scale-[1.02] hover:bg-spif-card/80' : ''}
      `}
    >
      {/* Role */}
      <span
        className="text-[10px] uppercase tracking-widest font-black mb-3 block"
        style={{ color: roleConfig.cor }}
      >
        {roleConfig.label}
      </span>

      {/* Nome + ação/status alinhados na mesma linha */}
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-bold tracking-tight text-spif-text truncate leading-tight">
            {usuario.nickname}
          </h2>
          <p className="text-[11px] font-bold uppercase tracking-widest text-spif-secondary/60 mt-1">
            {usuario.prontuario}
          </p>
        </div>

        {/* Elemento único: botão clicável ou badge informativo */}
        <div className="shrink-0">
          {onInvite && isDisponivel && (
            <button
              onClick={(e) => { e.stopPropagation(); onInvite(usuario.id) }}
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-spif-card-border text-spif-secondary hover:bg-spif-primary/10 hover:text-spif-primary hover:border-spif-primary/30 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Convidar
            </button>
          )}

          {isConvidado && (
            <div className="flex items-center gap-1.5 text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              Pendente
            </div>
          )}

          {isMatriculado && (
            <div className="flex items-center gap-1.5 text-spif-primary bg-spif-primary/10 border border-spif-primary/30 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Matriculado
            </div>
          )}
        </div>
      </div>
    </div>
  )
}