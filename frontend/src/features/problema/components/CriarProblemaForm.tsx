import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { criarProblemaSchema, type CriarProblemaRequest } from '../problema.types'
import { assuntos } from '../problema.utils'
import { Loader2, Send, AlignLeft } from 'lucide-react'

import {
  FormItem,
  FormLabel,
  FormInput,
  FormTextarea,
  FormError,
  FormCheckboxGroup
} from '../../../shared/components/form'
import { useCriarProblema } from '../problema.hooks'

export default function CriarProblemaForm({ onSuccess }: { onSuccess?: () => void }) {
  const methods = useForm<CriarProblemaRequest>({
    resolver: zodResolver(criarProblemaSchema) as any,
    defaultValues: {
      titulo: '',
      enunciado: '',
      entrada: '',
      saida: '',
      dificuldade: 1,
      tempoLimite: 1,
      memoriaLimiteMb: 256,
      assuntos: [],
    },
  })

  const { handleSubmit, reset, formState: { isSubmitting } } = methods
  const criarMutation = useCriarProblema()

  const handleFormSubmit = async (dados: CriarProblemaRequest) => {
    criarMutation.mutate(dados, {
      onSuccess: () => {
        reset()
        onSuccess?.()
      }
    })
  }

  return (
    <FormProvider {...methods}>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
          <div className="grid gap-8 md:grid-cols-2">
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormInput name="titulo" placeholder="Ex: Algoritmo de Dijkstra" />
              <FormError name="titulo" />
            </FormItem>

            <FormItem>
              <FormLabel>Dificuldade (1-10)</FormLabel>
              <FormInput name="dificuldade" type="number" isNumber min={1} max={10} />
              <FormError name="dificuldade" />
            </FormItem>
          </div>

          <FormItem>
            <FormLabel>Enunciado</FormLabel>
            <div className="relative">
              <FormTextarea 
                name="enunciado" 
                placeholder="Descreva o problema, as restrições e o que se espera da solução..."
                className="min-h-[120px]"
              />
              <AlignLeft className="absolute right-4 top-4 w-4 h-4 text-spif-secondary opacity-30 pointer-events-none" />
            </div>
            <FormError name="enunciado" />
          </FormItem>

          <div className="grid gap-8 md:grid-cols-2">
            <FormItem>
              <FormLabel>Entrada</FormLabel>
              <FormTextarea name="entrada" rows={4} placeholder="Descreva como será a entrada do programa..." />
            </FormItem>
            <FormItem>
              <FormLabel>Saída</FormLabel>
              <FormTextarea name="saida" rows={4} placeholder="Descreva como será a saída do programa..." />
            </FormItem>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <FormItem>
              <FormLabel>Tempo Limite (segundos)</FormLabel>
              <FormInput name="tempoLimite" type="number" isNumber step="0.1" />
            </FormItem>
            <FormItem>
              <FormLabel>Memória Limite (MB)</FormLabel>
              <FormInput name="memoriaLimiteMb" type="number" isNumber />
            </FormItem>
          </div>

          <FormItem>
            <FormLabel>Categorias</FormLabel>
            <FormCheckboxGroup name="assuntos" options={assuntos} />
            <FormError name="assuntos" />
          </FormItem>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-3 w-full py-5 bg-spif-primary hover:bg-spif-primary-hover text-spif-bg text-xs font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl shadow-spif-primary/20 active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Publicando Desafio...</>
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