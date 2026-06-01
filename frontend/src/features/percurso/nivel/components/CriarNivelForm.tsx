import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, Hash, Send } from 'lucide-react'
import { useCriarNivel, useListarNiveis } from '../nivel.hooks'
import { criarNivelSchema, type CriarNivelRequest } from '../nivel.types'
import { FormError, FormInput, FormItem, FormLabel, FormTextarea } from '../../../../shared/components/form'


interface CriarNivelFormProps {
  percursoId: number
  onSuccess: () => void
}

export default function CriarNivelForm({ percursoId, onSuccess }: CriarNivelFormProps) {
  const { data: niveis = [] } = useListarNiveis(percursoId)
  const criarMutation = useCriarNivel(percursoId)

  const proximaOrdem = niveis.length > 0 ? Math.max(...niveis.map((n) => n.ordem)) + 1 : 1

  const methods = useForm<CriarNivelRequest>({
    resolver: zodResolver(criarNivelSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      ordem: proximaOrdem,
    },
  })

  const { handleSubmit, reset } = methods

  const handleFormSubmit = async (dados: CriarNivelRequest) => {
    criarMutation.mutate(dados, {
      onSuccess: () => {
        reset()
        onSuccess()
      },
    })
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-4">
          <div className="md:col-span-3">
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormInput name="nome" placeholder="Ex: Estruturas de Repetição" />
              <FormError name="nome" />
            </FormItem>
          </div>

          <FormItem>
            <FormLabel>Ordem</FormLabel>
            <div className="relative">
              <FormInput
                name="ordem"
                type="number"
                isNumber
                placeholder="1"
              />
              <Hash className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-spif-secondary opacity-30 pointer-events-none" />
            </div>
            <FormError name="ordem" />
          </FormItem>
        </div>

        <FormItem>
          <FormLabel>Descrição</FormLabel>
          <FormTextarea
            name="descricao"
            placeholder="Breve descrição dos conceitos abordados neste nível..."
            className="min-h-[100px]"
          />
          <FormError name="descricao" />
        </FormItem>

        <div className="pt-2">
          <button
            type="submit"
            disabled={criarMutation.isPending}
            className="flex items-center justify-center gap-3 w-full py-4 bg-spif-primary hover:bg-spif-primary-hover text-spif-bg text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-spif-primary/10 active:scale-[0.98] disabled:opacity-50"
          >
            {criarMutation.isPending ? (
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
