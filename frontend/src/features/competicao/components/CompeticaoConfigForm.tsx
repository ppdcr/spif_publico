import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { atualizarCompeticaoSchema, type AtualizarCompeticaoRequest, type CompeticaoResponse } from '../competicao.types'
import { useAtualizarCompeticao } from '../competicao.hooks'
import { Loader2, Save, AlignLeft } from 'lucide-react'

import {
  FormItem,
  FormLabel,
  FormInput,
  FormError,
  FormTextarea,
} from '../../../shared/components/form'
import { DateTimePicker } from '../../../shared/components/DatetimePicker'

interface CompeticaoConfigFormProps {
  competicao: CompeticaoResponse
  onSuccess: () => void
}

export default function CompeticaoConfigForm({ competicao, onSuccess }: CompeticaoConfigFormProps) {
  const atualizarMutation = useAtualizarCompeticao(competicao.id)

  const methods = useForm<AtualizarCompeticaoRequest>({
    resolver: zodResolver(atualizarCompeticaoSchema) as any,
    defaultValues: {
      nome: competicao.nome,
      descricao: competicao.descricao,
      dataInicio: competicao.dataInicio ? competicao.dataInicio.slice(0, 16) : '',
      dataFim: competicao.dataFim ? competicao.dataFim.slice(0, 16) : '',
      ativa: competicao.ativa
    },
  })

  const { handleSubmit } = methods

  const handleFormSubmit = async (dados: AtualizarCompeticaoRequest) => {
    atualizarMutation.mutate(dados)
    onSuccess()
  }

  return (
    <FormProvider {...methods}>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormInput name="nome" placeholder="Nome atualizado" />
            <FormError name="nome" />
          </FormItem>

          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <div className="relative">
              <FormTextarea
                name="descricao"
                placeholder="Nova descrição..."
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
              disabled={atualizarMutation.isPending || !methods.formState.isDirty}
              className="flex items-center justify-center gap-3 w-full py-4 bg-spif-primary hover:bg-spif-primary-hover text-spif-bg text-xs font-black uppercase tracking-[0.3em] rounded-xl transition-all shadow-xl shadow-spif-primary/20 active:scale-[0.99] disabled:opacity-50"
            >
              {atualizarMutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</>
              ) : (
                <><Save className="w-4 h-4" /> Atualizar</>
              )}
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  )
}
