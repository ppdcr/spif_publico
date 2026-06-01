import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { percursoService } from './percurso.service'
import type { AtualizarPercursoRequest, CriarPercursoRequest } from './percurso.types'

// ── Query keys centralizadas ──────────────────────────────────────────────────

export const percursoKeys = {
  all: ['percursos'] as const,
  lists: () => [...percursoKeys.all, 'list'] as const,
  detail: (id: number) => [...percursoKeys.all, 'detail', id] as const,
}

// ── Queries ───────────────────────────────────────────────────────────────────

export const useListarPercursos = () => {
  return useQuery({
    queryKey: percursoKeys.lists(),
    queryFn: () => percursoService.listarPercursos(),
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export const useCriarPercurso = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dados: CriarPercursoRequest) => percursoService.criarPercurso(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: percursoKeys.lists() })
    },
  })
}

export const useAtualizarPercurso = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ percursoId, dados }: { percursoId: number; dados: AtualizarPercursoRequest }) =>
      percursoService.atualizarPercurso(percursoId, dados),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: percursoKeys.lists() })
      queryClient.invalidateQueries({ queryKey: percursoKeys.detail(variables.percursoId) })
    },
  })
}

export const useDeletarPercurso = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (percursoId: number) => percursoService.deletarPercurso(percursoId),
    onSuccess: (_data, percursoId) => {
      queryClient.invalidateQueries({ queryKey: percursoKeys.lists() })
      queryClient.removeQueries({ queryKey: percursoKeys.detail(percursoId) })
    },
  })
}
