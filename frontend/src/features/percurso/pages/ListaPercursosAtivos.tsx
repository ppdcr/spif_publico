import { AlertTriangle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useListarPercursos } from "../percurso.hooks";
import PercursoCard from "../components/PercursoCard";

export default function ListaPercursosAtivos() {
    const { data: percursos, isLoading, isError } = useListarPercursos()

    const navigate = useNavigate()

    if (isLoading || !percursos) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-spif-primary animate-pulse gap-4">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-sm font-bold tracking-widest uppercase">Buscando percursos...</span>
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
                    Falha ao carregar percursos
                    </p>
                    <p className="text-sm text-spif-secondary">
                    Tente novamente mais tarde.
                    </p>
                </div>
            </div>
        )
    }
    
    if (percursos.length === 0) {
        return (
            <div className="glass-card border-dashed flex flex-col items-center justify-center py-20 text-center gap-4">
                <p className="text-lg font-bold text-spif-text">
                Nenhum percurso encontrado
                </p>
                <p className="text-sm text-spif-secondary">
                Ainda não existem percursos disponíveis.
                </p>
            </div>
        )
    }

    return (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 fade-out duration-300">
            {percursos?.map((p) => {
                return (
                    <PercursoCard
                    key={p.id}
                    percurso={p}
                    onClick={() => navigate(`/percursos/${p.id}`)}
                    />
                )
            })}
        </div>
    )


}