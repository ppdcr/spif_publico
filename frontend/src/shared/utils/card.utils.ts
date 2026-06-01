import { Clock, Lock, type LucideIcon } from "lucide-react";

export const statusData: Record<string, { label: string; className: string; icon: LucideIcon | null }> = {
    AGENDADA: {
        label: 'Agendada',
        className: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        icon: Clock,
    },
    EM_ANDAMENTO: {
        label: 'Em Andamento',
        className: 'bg-green-500/10 text-green-500 border-green-500/20',
        icon: null,
    },
    FINALIZADA: {
        label: 'Finalizada',
        className: 'bg-red-500/10 text-red-500 border-red-500/20',
        icon: Lock,
    },
}

export function getDataStatus(dataInicio: string, dataFim?: string | null) {
    const agora = new Date()
    const inicio = new Date(dataInicio)
    const fim = dataFim ? new Date(dataFim) : null

    if (agora < inicio) return 'AGENDADA'
    if (fim && agora > fim) return 'FINALIZADA'
    return 'EM_ANDAMENTO'
}