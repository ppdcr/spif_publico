import { useForm } from 'react-hook-form'
import {
  FormProvider,
  FormItem,
  FormLabel,
  FormInput,
  FormError,
} from '../../../shared/components/form'

import { type EditarPerfilRequest, type UsuarioResponse } from '../usuario.types';
import { Save, AlertCircle, Loader2 } from 'lucide-react'

interface EditarPerfilFormProps {
  usuario: UsuarioResponse
  onSubmit: (data: EditarPerfilRequest) => void
  isSubmitting: boolean
  globalError: string | null
}

export default function EditarPerfilForm({
  usuario,
  onSubmit,
  isSubmitting,
  globalError,
}: EditarPerfilFormProps) {
  const methods = useForm<EditarPerfilRequest>({
    defaultValues: {
      nickname: usuario.nickname,
      email: usuario.email,
      senha: '',
    },
  })

  const { handleSubmit, formState: { errors } } = methods

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
        
        {/* Nickname */}
        <FormItem>
          <FormLabel>Nickname</FormLabel>
          <FormInput
            name="nickname"
            placeholder={usuario.nickname}
          />
          <FormError name="nickname" />
        </FormItem>

        {/* E-mail */}
        <FormItem>
          <FormLabel>E-mail</FormLabel>
          <FormInput
            name="email"
            type="email"
            placeholder={usuario.email}
          />
          <FormError name="email" />
        </FormItem>

        {/* Nova Senha */}
        <FormItem>
          <FormLabel>Nova Senha</FormLabel>
          <FormInput
            name="senha"
            type="password"
            placeholder="Deixe em branco para manter a atual"
          />
          <FormError name="senha" />
        </FormItem>

        {/* Erro global */}
        {(errors.root || globalError) && (
          <div className="flex items-center gap-2 text-red-400 text-xs font-medium border border-red-400/20 bg-red-400/5 px-4 py-3 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.root?.message ?? globalError}</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 bg-spif-primary text-spif-bg py-3 px-6 rounded-lg text-sm tracking-widest font-bold uppercase hover:bg-spif-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4 shadow-lg shadow-spif-primary/20"
        >
          {isSubmitting ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</>
          ) : (
            <><Save className="w-4 h-4" /> Salvar</>
          )}
        </button>
      </form>
    </FormProvider>
  )
}