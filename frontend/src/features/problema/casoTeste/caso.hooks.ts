// src/features/problema/casoTeste/casoTeste.hooks.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { casoTesteService } from './caso.service'
import { problemaKeys } from '../problema.hooks'
import type { AtualizarCasoTesteRequest, CriarCasoTesteRequest } from './caso.types'

// ── Query keys ────────────────────────────────────────────────────────────────

export const casoTesteKeys = {
  all: (problemaId: number) => ['problemas', problemaId, 'casos'] as const,
}

// ── Query ─────────────────────────────────────────────────────────────────────

export const useListarCasos = (problemaId: number) => {
  return useQuery({
    queryKey: casoTesteKeys.all(problemaId),
    queryFn: () => casoTesteService.listarCasos(problemaId),
    enabled: problemaId > 0,
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export const useCriarCasoTeste = (problemaId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dados: CriarCasoTesteRequest) =>
      casoTesteService.criarCasoTeste(problemaId, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: casoTesteKeys.all(problemaId) })
      // Invalida o detalhe do problema pois casosVisiveis pode ter mudado
      queryClient.invalidateQueries({ queryKey: problemaKeys.detail(problemaId) })
    },
  })
}

export const useAtualizarCasoTeste = (problemaId: number, casoId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dados: AtualizarCasoTesteRequest) =>
      casoTesteService.atualizarCasoTeste(problemaId, casoId, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: casoTesteKeys.all(problemaId) })
      queryClient.invalidateQueries({ queryKey: problemaKeys.detail(problemaId) })
    },
  })
}

export const useDeletarCasoTeste = (problemaId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (casoId: number) => casoTesteService.deletarCasoTeste(problemaId, casoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: casoTesteKeys.all(problemaId) })
      queryClient.invalidateQueries({ queryKey: problemaKeys.detail(problemaId) })
    },
  })
}