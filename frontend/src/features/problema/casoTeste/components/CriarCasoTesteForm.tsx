import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCriarCasoTeste, useListarCasos } from '../caso.hooks'
import { criarCasoTesteSchema, type CriarCasoTesteRequest } from '../caso.types'
import { Loader2, Send } from 'lucide-react'

import {
  FormItem,
  FormLabel,
  FormInput,
  FormTextarea,
  FormError,
  FormBooleanSelect,
} from '../../../../shared/components/form'

export default function CriarCasoTesteForm({ problemaId, onSuccess }: { problemaId: number, onSuccess: () => void }) {
  const { data: casos = [] } = useListarCasos(problemaId)
  const { mutate: criar, isPending } = useCriarCasoTeste(problemaId)

  const proximaOrdem = casos.length > 0 ? Math.max(...casos.map((c) => c.ordem)) + 1 : 1

  const methods = useForm<CriarCasoTesteRequest>({
    resolver: zodResolver(criarCasoTesteSchema),
    defaultValues: { 
      entrada: '', 
      saida: '', 
      visivel: false, 
      ordem: proximaOrdem 
    },
  })

  const { handleSubmit, reset } = methods

  const handleFormSubmit = async (dados: CriarCasoTesteRequest) => {
    criar(dados, {
      onSuccess: () => {
        reset()
        onSuccess()
      }
    })
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

          <FormItem>
            <FormLabel>Visivel?</FormLabel>
            <FormBooleanSelect name="visivel" />
            <FormError name="visivel" />
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

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center gap-3 w-full py-4 bg-spif-primary hover:bg-spif-primary-hover text-spif-bg text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-spif-primary/10 active:scale-[0.98] disabled:opacity-50"
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Adicionando...</>
            ) : (
              <><Send className="w-4 h-4" /> Criar</>
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  )
}