import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { atualizarNivelSchema, type AtualizarNivelRequest, type NivelResponse } from '../nivel.types'
import { useAtualizarNivel } from '../nivel.hooks'
import { Loader2, Save, Hash } from 'lucide-react'

import {
  FormItem,
  FormLabel,
  FormInput,
  FormError,
  FormTextarea
} from '../../../../shared/components/form'

interface NivelConfigFormProps {
  percursoId: number
  nivel: NivelResponse
  onSuccess: () => void
}

export default function NivelConfigForm({ percursoId, nivel, onSuccess }: NivelConfigFormProps) {
  const atualizarMutation = useAtualizarNivel(percursoId)

  const methods = useForm<AtualizarNivelRequest>({
    resolver: zodResolver(atualizarNivelSchema) as any,
    values: {
      nome: nivel.nome,
      descricao: nivel.descricao,
      ordem: nivel.ordem,
    },
  })

  const { handleSubmit } = methods

  const handleFormSubmit = async (dados: AtualizarNivelRequest) => {
    atualizarMutation.mutate({ nivelId: nivel.id, dados })
    onSuccess()
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-4">
          <div className="md:col-span-3">
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormInput name="nome" />
              <FormError name="nome" />
            </FormItem>
          </div>

          <FormItem>
            <FormLabel>Ordem</FormLabel>
            <div className="relative">
              <FormInput name="ordem" type="number" isNumber />
              <Hash className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-spif-secondary opacity-30 pointer-events-none" />
            </div>
            <FormError name="ordem" />
          </FormItem>
        </div>

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
