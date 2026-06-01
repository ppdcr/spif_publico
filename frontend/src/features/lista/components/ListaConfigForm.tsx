import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  FormItem, 
  FormLabel, 
  FormInput, 
  FormError,
  FormTextarea
} from '../../../shared/components/form'
import { AtualizarListaProblemasRequestSchema, type AtualizarListaProblemasRequest, type ListaProblemasResponse } from '../lista.types'
import { useAtualizarLista } from '../lista.hooks'
import { Save, Loader2 } from 'lucide-react'

export default function ListaConfigForm({ lista, onSucess }: { lista: ListaProblemasResponse; onSucess: () => void }) {
  const { mutateAsync: atualizar, isPending } = useAtualizarLista()

  const form = useForm<AtualizarListaProblemasRequest>({
    resolver: zodResolver(AtualizarListaProblemasRequestSchema),
    defaultValues: {
        titulo: lista.titulo,
        descricao: lista.descricao
    },
  })

  const handleFormSubmit = async (dados: AtualizarListaProblemasRequest) => {
    try {
      await atualizar({ listaId: lista.id, dados })
      onSucess()
    } catch {
      form.setError('root', { message: 'Falha na sincronização com o banco de dados.' })
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormItem>
          <FormLabel>Título da Lista</FormLabel>
          <FormInput name="titulo" />
          <FormError name="titulo" />
        </FormItem>

        <FormItem>
          <FormLabel>Descrição</FormLabel>
          <FormTextarea name="descricao" rows={5} />
          <FormError name="descricao" />
        </FormItem>

        {form.formState.errors.root && (
          <p className="text-red-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
            ⚠️ {form.formState.errors.root.message}
          </p>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center justify-center gap-3 w-full py-4 bg-spif-primary hover:bg-spif-primary-hover text-spif-bg text-xs font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-spif-primary/20 active:scale-[0.98] disabled:opacity-50"
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
