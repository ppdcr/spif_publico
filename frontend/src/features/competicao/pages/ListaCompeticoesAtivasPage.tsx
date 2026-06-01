import { AlertTriangle, Loader2 } from "lucide-react";
import { useListarCompeticoesAtivas } from "../competicao.hooks";
import { getDataStatus } from "../../../shared/utils/card.utils";
import CompeticaoCardWithToggle from "../components/CompeticaoCardWithToggle";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ListaCompeticoesAtivasPage({ onAtualizar }: { onAtualizar: () => void }) {
    const { data: competicoes, isLoading, isError } = useListarCompeticoesAtivas()

    const { role } = useAuth()
    const isProfessor = role === 'ROLE_PROFESSOR'
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
                Ainda não existem competições disponíveis.
                </p>
            </div>
        )
    }

    return (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 fade-out duration-300">
            {competicoes?.map((c) => {
                const status = getDataStatus(c.dataInicio, c.dataFim)
                // Alunos não podem acessar competições fora do período
                const bloqueada = !isProfessor && status !== 'EM_ANDAMENTO'
                return (
                    <CompeticaoCardWithToggle
                    key={c.id}
                    competicao={c}
                    onClick={bloqueada ? undefined : () => navigate(`/competicoes/${c.id}`)}
                    bloqueada={bloqueada}
                    onRedirecionar={onAtualizar}
                    />
                )
            })}
        </div>
    )


}