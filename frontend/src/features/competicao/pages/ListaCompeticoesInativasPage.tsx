import { AlertTriangle, Loader2 } from "lucide-react";
import { useListarCompeticoesInativas } from "../competicao.hooks";
import CompeticaoCardWithToggle from "../components/CompeticaoCardWithToggle";
import { useNavigate } from "react-router-dom";

export default function ListaCompeticoesInativasPage({ onAtualizar }: { onAtualizar: () => void }) {
    const { data: competicoes, isLoading, isError } = useListarCompeticoesInativas()

    const navigate = useNavigate()

    if (isLoading || !competicoes) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-spif-primary animate-pulse gap-4">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-sm font-bold tracking-widest uppercase">Buscando competições...</span>
            </div>
        )
    }
    
    if (isError) {
        return (
            <div className="glass-card flex flex-col items-center justify-center gap-4 py-16 text-center">
                <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                    <p className="font-bold text-lg text-spif-text">
                    Falha ao carregar competições
                    </p>
                    <p className="text-sm text-spif-secondary">
                    Tente novamente mais tarde.
                    </p>
                </div>
            </div>
        )
    }
    
    if (competicoes.length === 0) {
        return (
            <div className="glass-card border-dashed flex flex-col items-center justify-center py-20 text-center gap-4">
                <p className="text-lg font-bold text-spif-text">
                Nenhuma competição encontrada
                </p>
                <p className="text-sm text-spif-secondary">
                Ainda não existem competições indisponíveis.
                </p>
            </div>
        )
    }

    return (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 fade-out duration-300">
            {competicoes?.map((c) => {
                return (
                    <CompeticaoCardWithToggle
                    key={c.id}
                    competicao={c}
                    onClick={() => navigate(`/competicoes/${c.id}`)}
                    onRedirecionar={onAtualizar}
                    />
                )
            })}
        </div>
    )


}