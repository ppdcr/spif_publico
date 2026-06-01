import { Link } from 'react-router-dom'
import { useListarRanking } from '../../usuario/usuario.hooks'
import RankingSection from '../components/RankingSection'
import { Trophy, AlertTriangle } from 'lucide-react'

export default function HomePage() {
  const { data, isLoading, error } = useListarRanking()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-spif-bg">
        <div className="flex flex-col items-center gap-4 animate-pulse text-spif-primary">
          <Trophy className="w-12 h-12" />
          <span className="text-sm font-bold tracking-widest uppercase">
            Sincronizando Ranking...
          </span>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-spif-bg p-8">
        <div className="max-w-md w-full glass-card p-10 flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <p className="text-spif-text font-bold text-lg">
            Falha na conexão com o servidor
          </p>
          <Link 
            to="/home" 
            className="bg-spif-primary hover:bg-spif-primary-hover text-spif-bg font-bold py-3 px-8 rounded-lg transition-all w-full shadow-lg shadow-spif-primary/20"
          >
            Tentar novamente
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full font-sans flex flex-col bg-spif-bg text-spif-text fade-out duration-300">
      {/* ── Main Content ── */}
      <main className="flex-1 w-full px-8 md:px-12 py-12 max-w-[1600px] mx-auto">
        <RankingSection
          rankingAluno={data.rankingAlunos}
          rankingProfessor={data.rankingProfessores}
        />
      </main>
    </div>
  )
}