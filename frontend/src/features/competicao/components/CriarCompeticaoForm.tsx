import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { criarCompeticaoSchema, type CriarCompeticaoRequest } from '../competicao.types'
import { useCriarCompeticao } from '../competicao.hooks'
import { Loader2, Send, AlignLeft } from 'lucide-react'

import {
  FormItem,
  FormLabel,
  FormInput,
  FormError,
  FormTextarea
} from '../../../shared/components/form'
import { DateTimePicker } from '../../../shared/components/DatetimePicker'

interface CriarCompeticaoFormProps {
  onSuccess: () => void
}

export default function CriarCompeticaoForm({ onSuccess }: CriarCompeticaoFormProps) {
  const criarMutation = useCriarCompeticao()

  const methods = useForm<CriarCompeticaoRequest>({
    resolver: zodResolver(criarCompeticaoSchema) as any,
    defaultValues: {
      nome: '',
      descricao: '',
      dataInicio: '',
      dataFim: null,
    },
  })

  const { handleSubmit, reset } = methods

  const handleFormSubmit = async (dados: CriarCompeticaoRequest) => {
    criarMutation.mutate(dados, {
      onSuccess: () => {
        reset()
        onSuccess()
      },
    })
  }

  return (
    <FormProvider {...methods}>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          
          <FormItem>
            <FormLabel>Nome da Competição</FormLabel>
            <FormInput name="nome" placeholder="Ex: OBI 2025" />
            <FormError name="nome" />
          </FormItem>

          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <div className="relative">
              <FormTextarea
                name="descricao"
                placeholder="Descreva do que se trata..."
                className="min-h-[120px]"
              />
              <AlignLeft className="absolute right-4 top-4 w-4 h-4 text-spif-secondary opacity-30 pointer-events-none" />
            </div>
            <FormError name="descricao" />
          </FormItem>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem>
              <FormLabel>Data de Início</FormLabel>
              <DateTimePicker name="dataInicio" placeholder="Selecionar data de início" />
              <FormError name="dataInicio" />
            </FormItem>

            <FormItem>
              <FormLabel>Data de Fim</FormLabel>
              <DateTimePicker name="dataFim" placeholder="Selecionar data de fim" optional />
              <FormError name="dataFim" />
            </FormItem>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={criarMutation.isPending}
              className="flex items-center justify-center gap-3 w-full py-5 bg-spif-primary hover:bg-spif-primary-hover text-spif-bg text-xs font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl shadow-spif-primary/20 active:scale-[0.99] disabled:opacity-50"
            >
              {criarMutation.isPending ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Gerando Competição...</>
              ) : (
                <><Send className="w-5 h-5" />Criar</>
              )}
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  )
}
