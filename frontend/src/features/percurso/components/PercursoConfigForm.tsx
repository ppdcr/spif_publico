import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { atualizarPercursoSchema, type AtualizarPercursoRequest, type PercursoResponse } from '../percurso.types'
import { useAtualizarPercurso } from '../percurso.hooks'
import { Loader2, Save } from 'lucide-react'

import {
  FormItem,
  FormLabel,
  FormInput,
  FormError,
  FormTextarea
} from '../../../shared/components/form'

interface PercursoConfigFormProps {
  percurso: PercursoResponse
  onSuccess: () => void
}

export default function PercursoConfigForm({ percurso, onSuccess }: PercursoConfigFormProps) {
  const atualizarMutation = useAtualizarPercurso()

  const methods = useForm<AtualizarPercursoRequest>({
    resolver: zodResolver(atualizarPercursoSchema) as any,
    values: {
      nome: percurso.nome,
      descricao: percurso.descricao,
    },
  })

  const { handleSubmit } = methods

  const handleFormSubmit = async (dados: AtualizarPercursoRequest) => {
    atualizarMutation.mutate({ percursoId: percurso.id, dados })
    onSuccess()
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormItem>
          <FormLabel>Nome do Percurso</FormLabel>
          <FormInput name="nome" />
          <FormError name="nome" />
        </FormItem>

        <FormItem>
          <FormLabel>Descrição</FormLabel>
          <FormTextarea
            name="descricao"
            className="min-h-[120px]"
          />
          <FormError name="descricao" />
        </FormItem>

        <div className="pt-2">
          <button
            type="submit"
            disabled={atualizarMutation.isPending || !methods.formState.isDirty}
            className="flex items-center justify-center gap-3 w-full py-4 bg-spif-primary hover:bg-spif-primary-hover text-spif-bg text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-spif-primary/20 active:scale-[0.98] disabled:opacity-50"
          >
            {atualizarMutation.isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</>
            ) : (
              <><Save className="w-4 h-4" /> Atualizar</>
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  )
}
