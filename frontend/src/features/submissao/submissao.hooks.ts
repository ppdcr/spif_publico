import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useWebSocket } from '../../contexts/WebSockerContext'
import { submissaoService } from './submissao.service'
import {
    isErroCompilacao,
    type CriarSubmissaoPayload,
    type ProgressoSubmissao,
    type WsPayload,
} from './submissao.types'
import { problemaKeys } from '../problema/problema.hooks'
import { usuarioKeys } from '../usuario/usuario.hooks'

// ─── Query Keys ───────────────────────────────────────────────────────────────

export const submissaoKeys = {
    all: (problemaId: number) => ['submissoes', problemaId] as const,
    detalhe: (problemaId: number, submissaoId: number) =>
        ['submissoes', problemaId, submissaoId] as const,
}

// ─── Listar Submissões ────────────────────────────────────────────────────────

export function useListarSubmissoes(problemaId: number) {
    return useQuery({
        queryKey: submissaoKeys.all(problemaId),
        queryFn: () => submissaoService.listar(problemaId),
        enabled: problemaId > 0,
    })
}

// ─── Buscar Detalhe ───────────────────────────────────────────────────────────

export function useBuscarSubmissaoDetalhe(
    problemaId: number,
    submissaoId: number | null,
) {
    return useQuery({
        queryKey: submissaoKeys.detalhe(problemaId, submissaoId ?? 0),
        queryFn: () => submissaoService.buscarDetalhe(problemaId, submissaoId!),
        enabled: submissaoId !== null && submissaoId > 0,
    })
}

// ─── Criar Submissão ──────────────────────────────────────────────────────────

export function useCriarSubmissao(problemaId: number) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (payload: CriarSubmissaoPayload) =>
            submissaoService.criar(problemaId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: submissaoKeys.all(problemaId) })
        },
    })
}

// ─── WebSocket: Progresso em Tempo Real ──────────────────────────────────────

const PROGRESSO_INICIAL: ProgressoSubmissao = {
    status: 'PENDENTE',
    resultados: [],
    erroCompilacao: null,
    submissaoId: null,
}

export function useSubmissaoWebSocket(alunoId: number, problemaId: number) {
    const client = useWebSocket()
    const queryClient = useQueryClient()
    const [progresso, setProgresso] = useState<ProgressoSubmissao>(PROGRESSO_INICIAL)
    const [aguardando, setAguardando] = useState(false)

    // Inicia a espera — chamado após criar uma submissão
    const iniciarEspera = () => {
        setProgresso(PROGRESSO_INICIAL)
        setAguardando(true)
    }

    const resetar = () => {
        setProgresso(PROGRESSO_INICIAL)
        setAguardando(false)
    }

    useEffect(() => {
        if (!client || !aguardando || alunoId <= 0) return

        const canal = `/topic/submissoes/${alunoId}`

        const subscription = client.subscribe(canal, (message) => {
            try {
                const payload: WsPayload = JSON.parse(message.body)

                if (isErroCompilacao(payload)) {
                    setProgresso({
                        status: 'COMPILATION_ERROR',
                        resultados: payload.submissao.resultados ?? [],
                        erroCompilacao: payload.erro,
                        submissaoId: payload.submissao.id,
                    })
                } else {
                    setProgresso({
                        status: payload.status,
                        resultados: payload.resultados ?? [],
                        erroCompilacao: null,
                        submissaoId: payload.id,
                    })
                }

                setAguardando(false)

                // Invalida a lista de submissões para que o histórico seja atualizado
                queryClient.invalidateQueries({ queryKey: submissaoKeys.all(problemaId) })

                // Invalida os dados do problema (para atualizar o status 'acertou')
                queryClient.invalidateQueries({ queryKey: problemaKeys.lists() })
                queryClient.invalidateQueries({ queryKey: problemaKeys.detail(problemaId) })

                // Invalida os dados do usuário (para atualizar pontos)
                queryClient.invalidateQueries({ queryKey: usuarioKeys.all })
            } catch (err) {
                console.error('[ws] falha ao parsear payload:', err)
                setAguardando(false)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [client, aguardando, alunoId, problemaId, queryClient])

    return { progresso, aguardando, iniciarEspera, resetar }
}