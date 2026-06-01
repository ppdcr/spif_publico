import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { criarDisciplinaSchema, type CriarDisciplinaRequest } from '../disciplina.types'
import { useCriarDisciplina } from '../disciplina.hooks'
import { Loader2, Send, Calendar } from 'lucide-react'

import { 
  FormItem, 
  FormLabel, 
  FormInput, 
  FormError 
} from '../../../shared/components/form' 

interface CriarDisciplinaFormProps {
  onSuccess: () => void
}

export default function CriarDisciplinaForm({ onSuccess }: CriarDisciplinaFormProps) {
  const criarMutation = useCriarDisciplina()

  const methods = useForm<CriarDisciplinaRequest>({
    resolver: zodResolver(criarDisciplinaSchema) as any,
    defaultValues: {
      nome: '',
      ano: new Date().getFullYear(),
    },
  })

  const { handleSubmit, reset } = methods

  const handleFormSubmit = async (dados: CriarDisciplinaRequest) => {
    criarMutation.mutate(dados, {
      onSuccess: () => {
        reset()
        onSuccess()
      },
    })
  }

  return (
    <FormProvider {...methods}>
      <div className="animate-in fade-out slide-in-from-bottom-4 duration-300">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-10">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-3">
            <FormItem>
                <FormLabel>Nome da Disciplina</FormLabel>
                <FormInput name="nome" placeholder="Ex: Algoritmos" />
                <FormError name="nome" />
            </FormItem>
            </div>

            <FormItem>
            <FormLabel>Ano Letivo</FormLabel>
            <div className="relative">
                <FormInput 
                    name="ano" 
                    type="number" 
                    isNumber 
                    placeholder="2026"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-spif-secondary opacity-30 pointer-events-none" />
            </div>
            <FormError name="ano" />
            </FormItem>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={criarMutation.isPending}
              className="flex items-center justify-center gap-3 w-full py-5 bg-spif-primary hover:bg-spif-primary-hover text-spif-bg text-xs font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl shadow-spif-primary/20 active:scale-[0.99] disabled:opacity-50"
            >
              {criarMutation.isPending ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Cadastrando Disciplina...</>
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