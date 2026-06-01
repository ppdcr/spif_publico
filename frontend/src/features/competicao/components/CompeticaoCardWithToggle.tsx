import { useAtualizarCompeticao } from "../competicao.hooks"
import type { CompeticaoResponse } from "../competicao.types"
import CompeticaoCard from "./CompeticaoCard"

interface CompeticaoCardWithToggleProps {
    competicao: CompeticaoResponse
    bloqueada?: boolean
    onClick?: () => void
    onRedirecionar?: () => void
}

export default function CompeticaoCardWithToggle({
    competicao,
    onClick,
    bloqueada,
    onRedirecionar
}: CompeticaoCardWithToggleProps) {
    const { mutateAsync } = useAtualizarCompeticao(competicao.id)

    const handleAtualizarVisivel = async () => {
        await mutateAsync({ ativa: !competicao.ativa })
        onRedirecionar?.()
    }

    return (
        <CompeticaoCard
            competicao={competicao}
            onClick={onClick}
            bloqueada={bloqueada}
            onToggleAtiva={handleAtualizarVisivel}
        />
    )
}
