import { ArrowLeft, User } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import type { UsuarioResponse } from '../../usuario/usuario.types'

interface ChatHeaderProps {
  destinatario: UsuarioResponse | undefined
}

export default function ChatHeader({ destinatario }: ChatHeaderProps) {
  const navigate = useNavigate()

  return (
    <Link to={`/usuarios/${destinatario?.id}`}>
      <header className="flex items-center gap-4 p-5 border-b border-spif-card-border bg-spif-bg/80 backdrop-blur-xl sticky top-0 z-10">
        <button
          onClick={() => navigate("/minhas-conversas")}
          className="md:hidden p-2 rounded-xl bg-spif-card border border-spif-card-border text-spif-secondary hover:text-spif-primary transition-all active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-spif-primary/10 border border-spif-primary/20 flex items-center justify-center text-spif-primary">
            <User className="w-5 h-5" />
          </div>

          <div className="flex flex-col min-w-0">
              <h1 className="text-lg font-black tracking-tight leading-none text-spif-text truncate">
                  {destinatario?.nickname ?? 'Carregando...'}
              </h1>
          </div>
        </div>
      </header>
    </Link>
  )
}