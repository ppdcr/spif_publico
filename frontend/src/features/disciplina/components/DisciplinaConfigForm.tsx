import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  FormItem, 
  FormLabel, 
  FormInput, 
  FormError,
} from '../../../shared/components/form'
import { atualizarDisciplinaSchema, type AtualizarDisciplinaRequest, type DisciplinaResponse } from '../disciplina.types'
import { useAtualizarDisciplina } from '../disciplina.hooks'
import { Save, Loader2, Calendar } from 'lucide-react'

export default function DisciplinaConfigForm({ disciplina }: { disciplina: DisciplinaResponse }) {
  const { mutateAsync: atualizar, isPending } = useAtualizarDisciplina(disciplina.id)

  const form = useForm<AtualizarDisciplinaRequest>({
    resolver: zodResolver(atualizarDisciplinaSchema),
    defaultValues: {
        nome: disciplina.nome,
        ano: disciplina.ano,
    },
  })

  const handleFormSubmit = async (dados: AtualizarDisciplinaRequest) => {
    try {
      await atualizar({ disciplinaId: disciplina.id, dados })
    } catch {
      form.setError('root', { message: 'Falha na sincronização com o banco de dados.' })
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormInput name="nome" />
              <FormError name="nome" />
            </FormItem>
          </div>
          <FormItem>
            <FormLabel>Ano Letivo</FormLabel>
            <div className="relative">
              <FormInput name="ano" type="number" isNumber />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-spif-secondary opacity-30 pointer-events-none" />
            </div>
            <FormError name="ano" />
          </FormItem>
        </div>

        {form.formState.errors.root && (
          <p className="text-red-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
            ⚠️ {form.formState.errors.root.message}
          </p>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending || !form.formState.isDirty}
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
