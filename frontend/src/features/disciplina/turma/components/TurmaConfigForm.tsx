import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { 
  FormItem, 
  FormLabel, 
  FormInput, 
  FormError,
} from '../../../../shared/components/form'
import { atualizarTurmaSchema, type AtualizarTurmaRequest, type TurmaResponse } from '../turma.types'
import { useAtualizarTurma } from '../turma.hooks'
import { Save, Loader2 } from 'lucide-react'

export default function TurmaConfigForm({ disciplinaId, turma }: { disciplinaId: number, turma: TurmaResponse }) {
  const { mutateAsync: atualizar, isPending } = useAtualizarTurma(disciplinaId)

  const form = useForm<AtualizarTurmaRequest>({
    resolver: zodResolver(atualizarTurmaSchema),
    defaultValues: {
        nome: turma.nome
    },
  })

  const handleFormSubmit = async (dados: AtualizarTurmaRequest) => {
    try {
      await atualizar({ turmaId: turma.id, dados })
    } catch {
      form.setError('root', { message: 'Falha na sincronização com o banco de dados.' })
    }
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormItem>
          <FormLabel>Nome da Turma</FormLabel>
          <FormInput name="nome" placeholder="Ex: Recuperação" />
          <FormError name="nome" />
        </FormItem>

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
