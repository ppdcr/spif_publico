import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Send } from 'lucide-react'

import { 
  FormItem, 
  FormLabel, 
  FormInput, 
  FormError 
} from '../../../../shared/components/form' 
import { useCriarTurma } from '../turma.hooks'
import { criarTurmaSchema, type CriarTurmaRequest } from '../turma.types'

interface CriarTurmaFormProps {
    disciplinaId: number
    onSuccess: () => void
}

export default function CriarTurmaForm({ disciplinaId, onSuccess }: CriarTurmaFormProps) {
  const criarMutation = useCriarTurma(disciplinaId)
  
  const methods = useForm<CriarTurmaRequest>({
    resolver: zodResolver(criarTurmaSchema) as any,
    defaultValues: {
      nome: ''
    },
  })

  const { handleSubmit, reset } = methods

  const handleFormSubmit = async (dados: CriarTurmaRequest) => {
    criarMutation.mutate(dados, {
      onSuccess: () => {
        reset()
        onSuccess()
      },
    })
  }

  return (
    <FormProvider {...methods}>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <FormItem>
                <FormLabel>Nome da Turma</FormLabel>
                <FormInput name="nome" placeholder="Ex: Recuperação" />
                <FormError name="nome" />
              </FormItem>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={criarMutation.isPending}
              className="flex items-center justify-center gap-2 w-full py-4 bg-spif-primary hover:bg-spif-primary-hover text-spif-bg text-xs font-bold uppercase tracking-widest rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-spif-primary/20"
            >
              {criarMutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Cadastrando...</>
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