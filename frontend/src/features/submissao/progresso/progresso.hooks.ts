import { useCallback, useEffect, useState } from 'react'
import type { ProgressoPayload } from './progresso.types'
import { useWebSocket } from '../../../contexts/WebSockerContext'

// ─── Fila de conquistas ───────────────────────────────────────────────────────
// Quando chegam múltiplas conquistas em sequência (ex: acertou o último problema
// de uma lista que também encerra uma competição), elas são enfileiradas e
// exibidas uma a uma — cada modal é fechado antes de abrir o próximo.

export type ConquistaItem = ProgressoPayload & { uid: string }

export function useProgressoWebSocket(alunoId: number) {
    const client = useWebSocket()
    const [fila, setFila] = useState<ConquistaItem[]>([])

    useEffect(() => {
        if (!client || alunoId <= 0) return

        const canal = `/topic/progresso/${alunoId}`

        const subscription = client.subscribe(canal, (message) => {
            try {
                const payload: ProgressoPayload = JSON.parse(message.body)
                const item: ConquistaItem = {
                    ...payload,
                    uid: `${payload.nomeObjeto}-${Date.now()}`,
                }
                setFila((prev) => [...prev, item])
            } catch (err) {
                console.error('[ws] falha ao parsear progresso:', err)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [client, alunoId])

    // Chamado pelo modal ao fechar — remove o item da cabeça da fila
    const dispensar = useCallback(() => {
        setFila((prev) => prev.slice(1))
    }, [])

    // A conquista atualmente visível é sempre a cabeça da fila
    const atual = fila[0] ?? null

    return { atual, dispensar }
}