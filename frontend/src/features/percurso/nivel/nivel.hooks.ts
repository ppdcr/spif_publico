import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { nivelService } from './nivel.service'
import type { 
  AtualizarNivelRequest, 
  CriarNivelRequest,
  AdicionarProblemasAoNivelRequest 
} from './nivel.types'
import { problemaKeys } from '../../problema/problema.hooks'

// ── Query keys centralizadas ──────────────────────────────────────────────────

export const nivelKeys = {
  all: ['niveis'] as const,
  lists: (percursoId: number) => [...nivelKeys.all, 'list', percursoId] as const,
  detail: (percursoId: number, nivelId: number) => [...nivelKeys.all, 'detail', percursoId, nivelId] as const,
}

// ── Queries ───────────────────────────────────────────────────────────────────

export const useListarNiveis = (percursoId: number) => {
  return useQuery({
    queryKey: nivelKeys.lists(percursoId),
    queryFn: () => nivelService.listarNiveis(percursoId),
    enabled: !!percursoId,
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export const useCriarNivel = (percursoId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dados: CriarNivelRequest) => nivelService.criarNivel(percursoId, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nivelKeys.lists(percursoId) })
    },
  })
}

export const useAtualizarNivel = (percursoId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ nivelId, dados }: { nivelId: number; dados: AtualizarNivelRequest }) =>
      nivelService.atualizarNivel(percursoId, nivelId, dados),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: nivelKeys.lists(percursoId) })
      queryClient.invalidateQueries({ queryKey: nivelKeys.detail(percursoId, variables.nivelId) })
    },
  })
}

export const useDeletarNivel = (percursoId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (nivelId: number) => nivelService.deletarNivel(percursoId, nivelId),
    onSuccess: (_data, nivelId) => {
      queryClient.invalidateQueries({ queryKey: nivelKeys.lists(percursoId) })
      queryClient.removeQueries({ queryKey: nivelKeys.detail(percursoId, nivelId) })
    },
  })
}

export const useAdicionarProblemasAoNivel = (percursoId: number, nivelId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dados: AdicionarProblemasAoNivelRequest) => 
      nivelService.adicionarProblemas(percursoId, nivelId, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nivelKeys.lists(percursoId) })
      queryClient.invalidateQueries({ queryKey: nivelKeys.detail(percursoId, nivelId) })
      queryClient.invalidateQueries({ queryKey: problemaKeys.lists() })
    },
  })
}

export const useRemoverProblemaDoNivel = (percursoId: number, nivelId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (problemaId: number) => 
      nivelService.removerProblema(percursoId, nivelId, problemaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nivelKeys.lists(percursoId) })
      queryClient.invalidateQueries({ queryKey: nivelKeys.detail(percursoId, nivelId) })
      queryClient.invalidateQueries({ queryKey: problemaKeys.lists() })
    },
  })
}
