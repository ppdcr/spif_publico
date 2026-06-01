import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type AuthRequest, authRequestSchema } from '../../usuario/usuario.types'
import { Loader2 } from 'lucide-react'

import { 
  FormProvider, 
  FormItem, 
  FormLabel, 
  FormInput, 
  FormError 
} from '../../../shared/components/form' 

interface LoginFormProps {
  defaultValues?: Partial<AuthRequest>
  onSubmit: (dados: AuthRequest) => Promise<void> | void
  isSubmitting?: boolean
  globalError?: string
}

export default function LoginForm({ defaultValues, onSubmit, isSubmitting = false, globalError }: LoginFormProps) {
  const methods = useForm<AuthRequest>({
    resolver: zodResolver(authRequestSchema),
    defaultValues,
  })

  const {
    handleSubmit,
    formState: { errors, isSubmitting: rhfSubmitting },
  } = methods

  const loading = isSubmitting || rhfSubmitting

  return (
    <FormProvider {...methods}>
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-700"
      >
        {/* Prontuário */}
        <FormItem>
          <FormLabel>Prontuário</FormLabel>
          <FormInput
            name="prontuario"
            placeholder="SP0000000"
            autoComplete="username"
          />
          <FormError name="prontuario" />
        </FormItem>

        {/* Senha */}
        <FormItem>
          <FormLabel>Senha</FormLabel>
          <FormInput
            name="senha"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <FormError name="senha" />
        </FormItem>

        {/* Erro global */}
        {(errors.root || globalError) && (
          <div className="text-red-400 text-sm font-medium border border-red-400/20 bg-red-400/10 px-4 py-3 rounded-lg flex items-center gap-2">
            {errors.root?.message ?? globalError}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-spif-primary text-spif-bg py-3.5 rounded-lg font-bold text-base mt-2
                     hover:bg-spif-primary-hover disabled:opacity-70 disabled:cursor-not-allowed
                     transition-all shadow-lg shadow-spif-primary/20 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Autenticando...
            </>
          ) : (
            'Entrar'
          )}
        </button>
      </form>
    </FormProvider>
  )
}