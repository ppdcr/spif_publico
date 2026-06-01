import { useAuth } from '../../../contexts/AuthContext'
import LoginForm from '../components/LoginForm'
import { type AuthRequest } from '../usuario.types'
import { useState } from 'react'

export default function LoginPage() {
  const { login } = useAuth()
  const [error, setError] = useState<string | undefined>()

  const onSubmit = async (data: AuthRequest) => {
    try {
      setError(undefined)
      await login(data.prontuario, data.senha)
    } catch {
      setError("Prontuário ou senha inválidos")
    }
  }

  return (
    <div className="min-h-screen bg-spif-bg text-spif-text font-sans flex relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-spif-primary/10 blur-[150px] rounded-full pointer-events-none" />

      {/* ── Painel esquerdo */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-16 relative z-10 border-r border-spif-card-border/50 bg-spif-card/30 backdrop-blur-sm">
        <div>
          <h2 className="text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-6">
            Continue de<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-spif-primary to-emerald-300">
              onde parou.
            </span>
          </h2>
          <p className="text-spif-secondary text-lg max-w-md">
            Acesse sua conta para continuar resolvendo problemas e acompanhando seu progresso.
          </p>
        </div>
      </div>

      {/* ── Painel direito */}
      <div className="flex flex-1 flex-col justify-center px-8 md:px-20 py-16 relative z-10">
        <div className="max-w-md w-full mx-auto">
          <LoginForm onSubmit={onSubmit} globalError={error} />

        </div>
      </div>
    </div>
  )
}