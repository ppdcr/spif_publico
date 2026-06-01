import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { atualizarCasoTesteSchema, type AtualizarCasoTesteRequest } from '../caso.types'
import { useAtualizarCasoTeste } from '../caso.hooks'
import {
  FormItem,
  FormLabel,
  FormInput,
  FormTextarea,
  FormError
} from '../../../../shared/components/form'
import { Loader2, Save, X } from 'lucide-react'

interface EditarCasoTesteFormProps {
  problemaId: number
  casoId: number
  defaultValues: AtualizarCasoTesteRequest
  onCancel: () => void
  onSuccess: () => void
}

export default function EditarCasoTesteForm({
  problemaId,
  casoId,
  defaultValues,
  onCancel,
  onSuccess,
}: EditarCasoTesteFormProps) {
  const {mutate: atualizar, isPending} = useAtualizarCasoTeste(problemaId, casoId)

  const methods = useForm<AtualizarCasoTesteRequest>({
    resolver: zodResolver(atualizarCasoTesteSchema),
    defaultValues,
  })

  const { handleSubmit, reset } = methods

  const handleFormSubmit = (dados: AtualizarCasoTesteRequest) => {
    atualizar(dados, { 
      onSuccess: () => {
        reset()
        onSuccess()
      }
    }
    )
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <FormItem>
            <FormLabel>Ordem</FormLabel>
            <FormInput name="ordem" type="number" isNumber min={1} />
            <FormError name="ordem" />
          </FormItem>
        </div>

        <FormItem>
          <FormLabel>Entrada</FormLabel>
          <FormTextarea name="entrada" rows={4} placeholder={`Ex:\n5\n1 2 3...`} />
          <FormError name="entrada" />
        </FormItem>

        <FormItem>
          <FormLabel>Saída Esperada</FormLabel>
          <FormTextarea name="saida" rows={4} placeholder="Ex: 15" />
          <FormError name="saida" />
        </FormItem>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-spif-card-border">
            {onCancel && (
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-spif-secondary hover:text-spif-text hover:bg-spif-card transition-all"
                >
                    <X className="w-4 h-4" /> Cancelar
                </button>
            )}
            <button
                type="submit"
                disabled={isPending || !methods.formState.isDirty }
                className="flex items-center justify-center gap-2 w-full sm:w-auto bg-spif-primary text-spif-bg px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-spif-primary-hover transition-all shadow-lg shadow-spif-primary/20 active:scale-95 disabled:opacity-50"
            >
                {isPending ? (
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