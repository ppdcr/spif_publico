import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type CriarUsuarioRequest, criarUsuarioSchema } from '../usuario.types'
import { Loader2 } from 'lucide-react'

import { 
  FormProvider, 
  FormItem, 
  FormLabel, 
  FormInput, 
  FormError 
} from '../../../shared/components/form' 

interface UsuarioFormProps {
  defaultValues?: Partial<CriarUsuarioRequest>
  onSubmit: (dados: CriarUsuarioRequest) => Promise<void>
  isSubmitting?: boolean
  globalError?: string
}

export default function CriarUsuarioForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  globalError,
}: UsuarioFormProps) {

  const methods = useForm<CriarUsuarioRequest>({
    resolver: zodResolver(criarUsuarioSchema),
    defaultValues: defaultValues ?? { role: 'ROLE_ALUNO' },
  })

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting: rhfSubmitting },
  } = methods

  const currentRole = watch('role')
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

        {/* Nickname */}
        <FormItem>
          <FormLabel>Nickname</FormLabel>
          <FormInput
            name="nickname"
            placeholder="Como quer ser chamado"
          />
          <FormError name="nickname" />
        </FormItem>

        {/* Email */}
        <FormItem>
          <FormLabel>E-mail</FormLabel>
          <FormInput
            name="email"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
          />
          <FormError name="email" />
        </FormItem>

        {/* Senha */}
        <FormItem>
          <FormLabel>Senha</FormLabel>
          <FormInput
            name="senha"
            type="password"
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
          />
          <FormError name="senha" />
        </FormItem>

        {/* Role (Perfil) como Tags */}
        <FormItem>
          <FormLabel className="mb-2">Perfil de acesso</FormLabel>
          <div className="flex gap-3">
            {[
              { value: 'ROLE_ALUNO', label: 'Aluno' },
              { value: 'ROLE_PROFESSOR', label: 'Professor' },
            ].map((opt) => {
              const isSelected = currentRole === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue('role', opt.value as any)}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold border transition-all duration-300 ${
                    isSelected 
                      ? 'border-spif-primary bg-spif-primary/10 text-spif-primary shadow-sm shadow-spif-primary/20' 
                      : 'border-spif-card-border bg-spif-card hover:border-spif-primary/50 text-spif-secondary hover:text-spif-text'
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
          <FormError name="role" />
        </FormItem>

        {/* Erro global */}
        {globalError && (
          <div className="text-red-400 text-sm font-medium border border-red-400/20 bg-red-400/10 px-4 py-3 rounded-lg flex items-center gap-2">
            {globalError}
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
              Criando conta...
            </>
          ) : (
            'Cadastrar'
          )}
        </button>
      </form>
    </FormProvider>
  )
}