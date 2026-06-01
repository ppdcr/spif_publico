import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../../contexts/AuthContext'
import { useUsuarioPorId, useElogiarProfessor, useEditarPerfil } from '../usuario.hooks'
import { User, ArrowLeft, Loader2, AlertTriangle, Save } from 'lucide-react'

export default function PerfilPage() {
  const { id: idParam } = useParams<{ id: string }>()
  const id = Number(idParam)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  
  const { usuario: usuarioLogado, updateUsuario } = useAuth()
  const { data: usuarioPerfil, isLoading, error } = useUsuarioPorId(id)
  const elogiarMutation = useElogiarProfessor(id)
  const editarPerfilMutation = useEditarPerfil()

  const [jaElogiou, setJaElogiou] = useState(false)

  // Estados locais para controlar a edição em tempo real
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erroSalvar, setErroSalvar] = useState<string | null>(null)

  // Sincroniza os estados locais quando os dados do perfil carregarem
  useEffect(() => {
    if (usuarioPerfil) {
      setNickname(usuarioPerfil.nickname)
      setEmail(usuarioPerfil.email)
      setSenha('')
    }
  }, [usuarioPerfil])

  if (!id || id <= 0 || error || (!isLoading && !usuarioPerfil)) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-spif-bg text-spif-text p-8">
        <div className="glass-card p-10 flex flex-col items-center max-w-sm w-full text-center gap-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <p className="font-bold text-lg">Usuário não encontrado</p>
          <button onClick={() => navigate('/home')} className="flex items-center gap-2 text-spif-primary font-bold uppercase tracking-widest text-xs">
            <ArrowLeft className="w-4 h-4" /> Voltar para home
          </button>
        </div>
      </div>
    )
  }

  if (isLoading || !usuarioPerfil) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-spif-bg">
        <div className="flex flex-col items-center gap-4 text-spif-primary animate-pulse">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-sm font-bold tracking-widest uppercase">Carregando dados...</span>
        </div>
      </div>
    )
  }

  const isMeuPerfil = usuarioLogado?.id === usuarioPerfil.id
  const isProfessor = usuarioPerfil.role === 'ROLE_PROFESSOR'
  const isAlunoLogado = usuarioLogado?.role === 'ROLE_ALUNO'
  
  // Verifica de forma reativa se algo mudou do dado original
  const temAlteracoes = 
    nickname !== usuarioPerfil.nickname || 
    email !== usuarioPerfil.email || 
    senha.length > 0

  const handleSalvarAlteracoes = async () => {
    try {
      setErroSalvar(null)
      const payload: any = {}
      if (nickname !== usuarioPerfil.nickname) payload.nickname = nickname
      if (email !== usuarioPerfil.email) payload.email = email
      if (senha.length > 0) payload.senha = senha

      const updatedAuth = await editarPerfilMutation.mutateAsync(payload)
      updateUsuario(updatedAuth)
      setSenha('')
      
      queryClient.invalidateQueries({ queryKey: ['usuario', id] })
      queryClient.invalidateQueries({ queryKey: ['usuario', 'ranking'] })
    } catch (e) {
      setErroSalvar('Erro ao salvar dados.')
    }
  }

  const handleElogiar = async () => {
    try {
      await elogiarMutation.mutateAsync()
      setJaElogiou(true)
      queryClient.invalidateQueries({ queryKey: ['usuario', id] })
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-spif-bg text-spif-text font-sans flex flex-col items-center justify-start py-12 px-6 md:px-16 overflow-y-auto animate-in fade-in duration-300">
      <div className="w-full max-w-[1600px] flex flex-col gap-6 relative">
        
        {/* Voltar */}
        <div className="flex justify-start">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-spif-secondary hover:text-spif-text transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
        </div>

        {/* Card Principal em Lista Única */}
        <div className="glass-card p-8 bg-spif-card/40 border-spif-card-border/60 backdrop-blur-sm flex flex-col gap-6">
          
          <div className="flex items-center gap-4 border-b border-spif-card-border/50 pb-5">
            <div className="w-12 h-12 rounded-full bg-spif-primary/10 border border-spif-primary/20 flex items-center justify-center text-spif-primary">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black">{isMeuPerfil ? 'Meu perfil' : `${usuarioPerfil.nickname}`}</h2>
              <p className="text-[10px] font-bold tracking-widest uppercase text-spif-secondary mt-0.5">
                {isProfessor ? 'Professor' : 'Aluno'} • {usuarioPerfil.prontuario}
              </p>
            </div>
          </div>

          {/* Lista de Campos - Um embaixo do outro */}
          <div className="flex flex-col gap-5">
            
            {/* Campo 1: Nickname */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] tracking-widest uppercase font-black text-spif-secondary flex items-center gap-1">
                Nickname 
              </label>
              <input
                type="text"
                disabled={!isMeuPerfil}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-spif-bg/50 border border-spif-card-border rounded-xl px-4 py-3 text-sm font-medium transition-all focus:border-spif-primary/50"
              />
            </div>

            {/* Campo 2: E-mail */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] tracking-widest uppercase font-black text-spif-secondary flex items-center gap-1">
                E-mail 
              </label>
              <input
                type="email"
                disabled={!isMeuPerfil}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-spif-bg/50 border border-spif-card-border rounded-xl px-4 py-3 text-sm font-medium transition-all focus:border-spif-primary/50"
              />
            </div>

            {/* Campo 3: Senha (Apenas se for o dono do perfil) */}
            {isMeuPerfil && (
              <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
                <label className="text-[10px] tracking-widest uppercase font-black text-spif-secondary">
                  Nova Senha (Deixe em branco para não alterar)
                </label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-spif-bg/50 border border-spif-card-border rounded-xl px-4 py-3 text-sm font-medium transition-all focus:border-spif-primary/50"
                />
              </div>
            )}

            {/* Campo 4: Prontuário (Sempre travado) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] tracking-widest uppercase font-black text-spif-secondary flex items-center gap-1">
                Prontuário
              </label>
              <input
                type="text"
                disabled
                value={usuarioPerfil.prontuario}
                className="w-full bg-spif-bg/50 border border-spif-card-border rounded-xl px-4 py-3 text-sm font-medium transition-all focus:border-spif-primary/50 uppercase"
              />
            </div>

            {/* Estatísticas Simples em Linha */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-spif-primary/10 bg-spif-primary/5 mt-2">
              <span className="text-xs font-bold tracking-wider uppercase text-spif-primary flex items-center gap-2">
                {isProfessor ? 'Elogios Obtidos' : 'Pontuação Total'}
              </span>
              <span className="text-2xl font-black text-spif-primary">
                {isProfessor ? (usuarioPerfil.elogios ?? 0) : (usuarioPerfil.pontos ?? 0)}
              </span>
            </div>

          </div>

          {/* Erro de Salvamento local */}
          {erroSalvar && <p className="text-xs text-red-400 font-medium text-center">{erroSalvar}</p>}

          {/* Ações para Perfis de Terceiros */}
          {!isMeuPerfil && isAlunoLogado && isProfessor && (
            <button
              onClick={handleElogiar}
              disabled={elogiarMutation.isPending || jaElogiou}
              className="w-full flex items-center justify-center gap-2 bg-spif-primary hover:bg-emerald-500 text-spif-bg py-3.5 px-6 rounded-xl text-xs tracking-widest uppercase font-black disabled:opacity-50 transition-all mt-2"
            >
              {jaElogiou ? 'Professor Elogiado ✓' : 'Elogiar Professor'}
            </button>
          )}

        </div>

        {/* ── Botão de Salvar Reativo (Aparece se houver modificação) ── */}
        {isMeuPerfil && temAlteracoes && (
          <div className="fixed bottom-6 right-6 md:absolute md:bottom-[-70px] md:right-0 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 z-40">
            <button
              onClick={handleSalvarAlteracoes}
              disabled={editarPerfilMutation.isPending}
              className="flex items-center gap-2 bg-spif-primary hover:bg-emerald-400 text-spif-bg font-black px-6 py-4 rounded-xl text-xs tracking-widest uppercase shadow-xl shadow-spif-primary/20 transition-all hover:scale-105"
            >
              {editarPerfilMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Salvar Alterações
            </button>
          </div>
        )}

      </div>
    </div>
  )
}