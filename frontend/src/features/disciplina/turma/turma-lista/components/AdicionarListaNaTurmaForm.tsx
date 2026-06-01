import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AdicionarListaATurmaRequestSchema, type AdicionarListaATurmaRequest } from "../turma-lista.types"
import { FormProvider, FormItem, FormLabel, FormError } from "../../../../../shared/components/form"
import { X, Loader2, Send } from 'lucide-react'
import { DateTimePicker } from "../../../../../shared/components/DatetimePicker"

interface AdicionarListaNaTurmaFormProps {
    listaId: number
    onSubmit: (dados: AdicionarListaATurmaRequest) => void
    onCancel?: () => void
    isSubmitting?: boolean
}

export default function AdicionarListaNaTurmaForm({
    listaId,
    onSubmit,
    onCancel,
    isSubmitting
}: AdicionarListaNaTurmaFormProps) {

    const methods = useForm<AdicionarListaATurmaRequest>({
        resolver: zodResolver(AdicionarListaATurmaRequestSchema),
        defaultValues: {
            listaId: listaId,
            dataInicio: '',
            dataFim: null
        },
    })

    const { handleSubmit, reset } = methods

    const handleFormSubmit = (dados: AdicionarListaATurmaRequest) => {
        const formatarParaISO = (dataStr: string | null | undefined) => {
            if (!dataStr) return null;
            return new Date(dataStr).toISOString();
        };

        const dadosFormatados = {
            ...dados,
            dataInicio: formatarParaISO(dados.dataInicio),
            dataFim: formatarParaISO(dados.dataFim)
        };

        onSubmit(dadosFormatados as AdicionarListaATurmaRequest);
        reset();
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-8 animate-in fade-in duration-500">

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

                <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4 border-t border-spif-card-border">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-spif-secondary hover:text-spif-text hover:bg-spif-card transition-all"
                        >
                            <X className="w-4 h-4" /> Cancelar
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto bg-spif-primary text-spif-bg px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-spif-primary-hover transition-all shadow-lg shadow-spif-primary/20 active:scale-95 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</>
                        ) : (
                            <><Send className="w-4 h-4" /> Atribuir</>
                        )}
                    </button>
                </div>
            </form>
        </FormProvider>
    )
}