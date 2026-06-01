import { useMemo, useState } from 'react'
import { type UsuarioResumoResponse } from '../usuario.types'
import UsuarioCard from '../components/UsuarioCard'
import { AlertTriangle, Loader2, Search, ShieldAlert, UserPlus } from 'lucide-react'
import { useUsuariosPorNome } from '../usuario.hooks'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type UsuarioStatus = 'DISPONIVEL' | 'MATRICULADO' | 'CONVIDADO' | 'PROFESSOR'

type Aba = 'PROFESSORES' | 'ALUNOS' | 'ADICIONAR'

interface ListaUsuariosContainerProps {
  usuarios: UsuarioResumoResponse[]
  statusMap?: Record<number, UsuarioStatus>
  isLoading?: boolean
  isError?: boolean
  onClickUser?: (usuarioId: number) => void
  onInvite?: (usuarioId: number) => void
  isProfessor?: boolean
  modoAdicionar?: 'TURMA' | 'DISCIPLINA'
  candidatos?: UsuarioResumoResponse[]
}

// ─── Aba de membros ───────────────────────────────────────────────────────────

function AbaMembros({
  usuarios,
  statusMap,
  role,
  onInvite,
}: {
  usuarios: UsuarioResumoResponse[]
  statusMap?: Record<number, UsuarioStatus>
  role: 'ROLE_PROFESSOR' | 'ROLE_ALUNO'
  onInvite?: (id: number) => void
}) {
  const [termo, setTermo] = useState('')

  const filtrados = useMemo(() => {
    const t = termo.trim().toLowerCase()
    return usuarios
      .filter((u) => u.role === role)
      .filter((u) => !t || `${u.nickname} ${u.prontuario}`.toLowerCase().includes(t))
  }, [usuarios, role, termo])

  return (
    <div className="space-y-5">
      {/* Busca local */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-spif-secondary opacity-40 group-focus-within:opacity-100 transition-all" />
        <input
          type="text"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Pesquisar por nome ou prontuário..."
          className="w-full bg-spif-card border border-spif-card-border pl-11 pr-4 py-3 text-xs font-medium rounded-xl outline-none focus:border-spif-primary/50 transition-all placeholder:text-spif-secondary/40 text-spif-text"
        />
      </div>

      {filtrados.length === 0 ? (
        <div className="glass-card border-dashed flex flex-col items-center justify-center py-16 text-center gap-4">
          <p className="text-base font-bold text-spif-text">Nenhum usuário encontrado</p>
          <p className="text-sm text-spif-secondary">Ajuste a pesquisa.</p>
        </div>
      ) : (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {filtrados.map((u) => (
            <UsuarioCard
              key={u.id}
              usuario={u}
              status={statusMap?.[u.id]}
              onInvite={onInvite}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Aba Adicionar: Aluno ────────────────────────────────────────────────

function AbaAdicionarAluno({
  statusMap,
  onInvite,
}: {
  statusMap?: Record<number, UsuarioStatus>
  onInvite?: (id: number) => void
}) {
  const [termo, setTermo] = useState('')
  const { data: resultados, isLoading, isFetching } = useUsuariosPorNome(termo)

  const alunosFiltrados = useMemo(
    () => (resultados ?? []).filter((u) => u.role === 'ROLE_ALUNO'),
    [resultados],
  )

  return (
    <div className="space-y-5">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-spif-secondary opacity-40 group-focus-within:opacity-100 transition-all" />
        <input
          type="text"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Digite o nome do aluno para buscar..."
          className="w-full bg-spif-card border border-spif-card-border pl-11 pr-4 py-3 text-xs font-medium rounded-xl outline-none focus:border-spif-primary/50 transition-all placeholder:text-spif-secondary/40 text-spif-text"
        />
        {isFetching && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-spif-primary animate-spin" />
        )}
      </div>

      {termo.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-3 opacity-40">
          <UserPlus className="w-10 h-10" />
          <p className="text-sm font-bold text-spif-text">Digite um nome para buscar alunos</p>
        </div>
      )}

      {isLoading && termo.length >= 1 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-spif-primary animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-xs font-bold uppercase tracking-widest">Buscando...</span>
        </div>
      )}

      {!isLoading && termo.length >= 1 && alunosFiltrados.length === 0 && (
        <div className="glass-card border-dashed flex flex-col items-center justify-center py-16 text-center gap-4">
          <ShieldAlert className="w-10 h-10 opacity-30" />
          <p className="text-base font-bold text-spif-text">Nenhum aluno encontrado</p>
          <p className="text-sm text-spif-secondary">Tente outro nome.</p>
        </div>
      )}

      {!isLoading && alunosFiltrados.length > 0 && (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {alunosFiltrados.map((u) => (
            <UsuarioCard
              key={u.id}
              usuario={u}
              status={statusMap?.[u.id]}
              onInvite={onInvite}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Container Principal ──────────────────────────────────────────────────────

export default function ListaUsuariosContainer({
  usuarios,
  statusMap,
  isLoading,
  isError,
  onInvite,
  isProfessor = false,
  modoAdicionar,
}: ListaUsuariosContainerProps) {
  // Aba "ADICIONAR" só existe no modo DISCIPLINA
  const temAbaAdicionar = isProfessor && modoAdicionar === 'DISCIPLINA'

  const [abaAtiva, setAbaAtiva] = useState<Aba>('ALUNOS')

  const ABAS = [
    { key: 'ALUNOS',      label: 'Alunos',    show: true },
    { key: 'PROFESSORES', label: 'Professores', show: true },
    { key: 'ADICIONAR',   label: 'Adicionar',  show: temAbaAdicionar },
  ].filter((t) => t.show)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-spif-primary animate-pulse gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm font-bold tracking-widest uppercase">Carregando usuários...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="glass-card flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold text-lg text-spif-text">Erro ao carregar usuários</p>
          <p className="text-sm text-spif-secondary">Tente novamente mais tarde.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* ── Abas ── */}
      <nav className="flex items-center gap-1.5 bg-spif-card p-1.5 rounded-xl border border-spif-card-border shadow-inner w-fit">
        {ABAS.map((aba) => {
          const isActive = abaAtiva === aba.key
          return (
            <button
              key={aba.key}
              onClick={() => setAbaAtiva(aba.key as Aba)}
              className={`
                flex items-center gap-2 px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all duration-200
                ${isActive
                  ? 'bg-spif-primary text-spif-bg shadow-md shadow-spif-primary/20'
                  : 'text-spif-secondary hover:text-spif-text hover:bg-spif-bg/50'
                }
              `}
            >
              {aba.label}
            </button>
          )
        })}
      </nav>

      {/* ── Conteúdo ── */}
      {abaAtiva === 'ALUNOS' && (
        <AbaMembros
          usuarios={usuarios}
          statusMap={statusMap}
          role="ROLE_ALUNO"
          // Passa onInvite nas abas de membros somente no modo TURMA
          onInvite={modoAdicionar === 'TURMA' && isProfessor ? onInvite : undefined}
        />
      )}
      {abaAtiva === 'PROFESSORES' && (
        <AbaMembros
          usuarios={usuarios}
          statusMap={statusMap}
          role="ROLE_PROFESSOR"
          onInvite={modoAdicionar === 'TURMA' && isProfessor ? onInvite : undefined}
        />
      )}
      {abaAtiva === 'ADICIONAR' && temAbaAdicionar && (
        <AbaAdicionarAluno
          statusMap={statusMap}
          onInvite={onInvite}
        />
      )}
    </div>
  )
}