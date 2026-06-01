import { type UsuarioResponse } from '../../usuario/usuario.types'
import { Link } from 'react-router-dom'
import { Medal } from 'lucide-react'

interface RankingCardProps {
  title: string
  items: UsuarioResponse[]
  emptyMessage: string
  currentUser: UsuarioResponse | null
}

export default function RankingCard({
  title,
  items,
  emptyMessage,
  currentUser,
}: RankingCardProps) {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <h2 className="text-2xl font-bold tracking-tight text-spif-text">
          {title.split(' ')[0]} - <span className="text-spif-primary">{title.split(' ')[1]}</span>
        </h2>
      </header>

      {items.length === 0 ? (
        <div className="glass-card p-8 text-center text-spif-secondary font-medium">
          {emptyMessage}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((usuario, index) => {
            const isCurrentUser = currentUser?.id === usuario.id
            const rank = index + 1
            const isTop3 = rank <= 3
            
            // Cores do Pódio
            const medalColors = {
              1: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
              2: 'text-slate-300 bg-slate-300/10 border-slate-300/30',
              3: 'text-amber-600 bg-amber-600/10 border-amber-600/30'
            }
            const defaultColor = 'text-spif-secondary bg-spif-card border-spif-card-border'
            const currentStyle = isTop3 ? medalColors[rank as 1|2|3] : defaultColor

            return (
              <Link 
                key={usuario.id} 
                to={`/usuarios/${usuario.id}`}
                className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:bg-spif-card/80 ${currentStyle} ${
                  isCurrentUser ? 'ring-2 ring-spif-primary shadow-lg shadow-spif-primary/20' : ''
                }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    isTop3 ? 'bg-white/10' : 'bg-spif-bg/50'
                  }`}>
                    {isTop3 ? <Medal className="w-5 h-5" /> : rank}
                  </div>
                  
                  <div className="flex flex-col">
                    <p className="text-base font-bold text-spif-text group-hover:text-spif-primary transition-colors">
                      {usuario.nickname}
                    </p>
                    <p className="text-xs font-mono text-spif-secondary uppercase tracking-wider">
                      {usuario.prontuario}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-spif-secondary mb-0.5">
                    {usuario.role === 'ROLE_ALUNO' ? 'PONTOS' : 'ELOGIOS'}
                  </p>
                  <p className={`font-black text-xl ${isTop3 ? '' : 'text-spif-text'}`}>
                    {usuario.role === 'ROLE_ALUNO' ? usuario.pontos ?? 0 : usuario.elogios ?? 0}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}