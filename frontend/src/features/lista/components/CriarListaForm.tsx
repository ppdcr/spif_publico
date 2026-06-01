import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  FormItem,
  FormLabel,
  FormInput,
  FormError,
  FormTextarea
} from '../../../shared/components/form'
import { useCriarLista } from '../lista.hooks'
import { CriarListaProblemasRequestSchema, type CriarListaProblemasRequest } from '../lista.types'
import { AlignLeft, Loader2, Send, } from 'lucide-react'

export default function CriarListaForm({ onSuccess }: { onSuccess?: () => void }) {
  const criarMutation = useCriarLista()

  const methods = useForm<CriarListaProblemasRequest>({
    resolver: zodResolver(CriarListaProblemasRequestSchema) as any,
    defaultValues: {
      titulo: '',
      descricao: ''
    },
  })

  const { handleSubmit, reset, formState: { isSubmitting } } = methods

  const handleFormSubmit = async (dados: CriarListaProblemasRequest) => {
    criarMutation.mutate(dados, {
      onSuccess: () => {
        reset()
        onSuccess?.()
      },
    })
  }

  return (
    <FormProvider {...methods}>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-10">

            <div className="grid gap-8 md:grid-cols-2">
              <FormItem>
                <FormLabel>Título da Lista</FormLabel>
                <FormInput name="titulo" placeholder="Ex: Estruturas de Dados Básicas" />
                <FormError name="titulo" />
              </FormItem>
            </div>

            <FormItem>
                <FormLabel>Descrição</FormLabel>
                <div className="relative">
                  <FormTextarea 
                    name="descricao" 
                    placeholder="Explique o objetivo desta lista para os alunos..."
                    className="min-h-[120px]"
                  />
                  <AlignLeft className="absolute right-4 top-4 w-4 h-4 text-spif-secondary opacity-30 pointer-events-none" />
                </div>
                <FormError name="descricao" />
            </FormItem>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-3 w-full py-5 bg-spif-primary hover:bg-spif-primary-hover text-spif-bg text-xs font-black uppercase tracking-[0.3em] rounded-2xl transition-all shadow-xl shadow-spif-primary/20 active:scale-[0.99] disabled:opacity-50"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Criando Lista...</>
              ) : (
                <><Send className="w-5 h-5" /> Criar</>
              )}
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  )
}