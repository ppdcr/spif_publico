import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { criarPercursoSchema, type CriarPercursoRequest } from '../percurso.types'
import { useCriarPercurso } from '../percurso.hooks'
import { Loader2, Send, AlignLeft } from 'lucide-react'

import { 
  FormItem, 
  FormLabel, 
  FormInput, 
  FormError,
  FormTextarea
} from '../../../shared/components/form' 

interface CriarPercursoFormProps {
  onSuccess: () => void
}

export default function CriarPercursoForm({ onSuccess }: CriarPercursoFormProps) {
  const criarMutation = useCriarPercurso()

  const methods = useForm<CriarPercursoRequest>({
    resolver: zodResolver(criarPercursoSchema) as any,
    defaultValues: {
      nome: '',
      descricao: '',
    },
  })

  const { handleSubmit, reset } = methods

  const handleFormSubmit = async (dados: CriarPercursoRequest) => {
    criarMutation.mutate(dados, {
      onSuccess: () => {
        reset()
        onSuccess()
      },
    })
  }

  return (
    <FormProvider {...methods}>
      <div className="fade-out duration-300">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
          
          <div className="space-y-6">
            
            <FormItem>
                <FormLabel>Nome do Percurso</FormLabel>
                <FormInput name="nome" placeholder="Ex: Jornada do Iniciante em C++" />
                <FormError name="nome" />
            </FormItem>

            <FormItem>
                <FormLabel>Descrição</FormLabel>
                <div className="relative">
                  <FormTextarea 
                    name="descricao" 
                    placeholder="Descreva o objetivo deste mapa de estudo..."
                    className="min-h-[120px]"
                  />
                  <AlignLeft className="absolute right-4 top-4 w-4 h-4 text-spif-secondary opacity-30 pointer-events-none" />
                </div>
                <FormError name="descricao" />
            </FormItem>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={criarMutation.isPending}
              className="flex items-center justify-center gap-3 w-full py-5 bg-spif-primary hover:bg-spif-primary-hover text-spif-bg text-xs font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl shadow-spif-primary/20 active:scale-[0.99] disabled:opacity-50"
            >
              {criarMutation.isPending ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Gerando Percurso...</>
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
