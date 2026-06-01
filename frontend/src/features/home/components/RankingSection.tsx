import { useAuth } from '../../../contexts/AuthContext'
import RankingCard from './RankingCard'
import { type UsuarioResponse } from '../../usuario/usuario.types'

interface RankingSectionProps {
  rankingAluno: UsuarioResponse[]
  rankingProfessor: UsuarioResponse[]
}

export default function RankingSection({
  rankingAluno,
  rankingProfessor,
}: RankingSectionProps) {
  const { usuario: currentUser } = useAuth()

  return (
    <section className="grid w-full grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
      {/* Ranking de Alunos */}
      <div className="w-full">
        <RankingCard
          title="Alunos Pontos"
          items={rankingAluno}
          emptyMessage="Nenhum aluno no ranking ainda."
          currentUser={currentUser}
        />
      </div>

      {/* Ranking de Professores */}
      <div className="w-full lg:border-l border-spif-card-border lg:pl-24">
        <RankingCard
          title="Professores Elogios"
          items={rankingProfessor}
          emptyMessage="Nenhum professor no ranking ainda."
          currentUser={currentUser}
        />
      </div>
    </section>
  )
}