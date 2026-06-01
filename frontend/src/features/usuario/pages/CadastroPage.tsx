import { useNavigate } from 'react-router-dom'
import { useCadastrarUsuario } from '../../usuario/usuario.hooks'
import { useAuth } from '../../../contexts/AuthContext'
import UsuarioForm from '../components/CriarUsuarioForm'
import type { CriarUsuarioRequest } from '../usuario.types'
import { useState } from 'react'

export default function CadastroPage() {
  const navigate = useNavigate()
  const { setUsuarioFromToken } = useAuth()
  const cadastrarMutation = useCadastrarUsuario()

  const [error, setError] = useState<string | undefined>()

  const onSubmit = async (data: CriarUsuarioRequest) => {
    try {
      const auth = await cadastrarMutation.mutateAsync(data)
      setUsuarioFromToken(auth)
      navigate('/login', { replace: true })
    } catch {
      setError('Prontuário ou email em uso.')
    }
  }

  return (
    <div className="min-h-screen bg-spif-bg text-spif-text font-sans flex relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute bottom-0 right-0 w-full max-w-2xl h-[500px] bg-spif-primary/10 blur-[150px] rounded-full pointer-events-none" />

      {/* ── Painel esquerdo */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-16 relative z-10 border-r border-spif-card-border/50 bg-spif-card/30 backdrop-blur-sm">

        <div>
          <h2 className="text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-6">
            Seu primeiro<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-spif-primary to-emerald-300">
              passo começa aqui.
            </span>
          </h2>
          <p className="text-spif-secondary text-lg max-w-md">
            Crie sua conta para acessar desafios de programação, disciplinas e evoluir suas habilidades.
          </p>
        </div>
      </div>

      {/* ── Painel direito */}
      <div className="flex flex-1 flex-col justify-center px-8 md:px-20 py-16 relative z-10 overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <UsuarioForm
            onSubmit={onSubmit} globalError={error}
          />
        </div>
      </div>
    </div>
  )
}