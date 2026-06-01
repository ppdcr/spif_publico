import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { problemaService } from './problema.service'
import type {
  AtualizarProblemaRequest,
  CriarProblemaRequest,
  ProblemaFiltroRequest,
} from './problema.types'

// ── Query keys centralizadas ──────────────────────────────────────────────────

export const problemaKeys = {
  all: ['problemas'] as const,
  lists: () => [...problemaKeys.all, 'list'] as const,
  list: (filtro?: ProblemaFiltroRequest) => [...problemaKeys.lists(), filtro] as const,
  meAtivos: () => [...problemaKeys.all, 'me', 'ativos'] as const,
  meInativos: () => [...problemaKeys.all, 'me', 'inativos'] as const,
  detail: (id: number) => [...problemaKeys.all, 'detail', id] as const,
}

// ── Queries ───────────────────────────────────────────────────────────────────

export const useListarProblemas = (filtro?: ProblemaFiltroRequest) => {
  return useQuery({
    queryKey: problemaKeys.list(filtro),
    queryFn: () => problemaService.listarProblemas(filtro),
  })
}

export const useBuscarProblema = (id: number) => {
  return useQuery({
    queryKey: problemaKeys.detail(id),
    queryFn: () => problemaService.buscarProblema(id),
    enabled: id > 0,
  })
}

export const useMeusProblemasAtivos = () => {
  return useQuery({
    queryKey: problemaKeys.meAtivos(),
    queryFn: () => problemaService.listarMeusProblemasAtivos(),
  })
}

export const useMeusProblemasInativos = () => {
  return useQuery({
    queryKey: problemaKeys.meInativos(),
    queryFn: () => problemaService.listarMeusProblemasInativos(),
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export const useCriarProblema = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dados: CriarProblemaRequest) => problemaService.criarProblema(dados),
    onSuccess: () => {
      // Invalida todas as listas para refletir o novo problema
      queryClient.invalidateQueries({ queryKey: problemaKeys.lists() })
      queryClient.invalidateQueries({ queryKey: problemaKeys.meAtivos() })
    },
  })
}

export const useAtualizarProblema = (id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dados: AtualizarProblemaRequest) => problemaService.atualizarProblema(id, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: problemaKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: problemaKeys.lists() })
      queryClient.invalidateQueries({ queryKey: problemaKeys.meAtivos() })
      queryClient.invalidateQueries({ queryKey: problemaKeys.meInativos() })
    },
  })
}

export const useDeletarProblema = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => problemaService.deletarProblema(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: problemaKeys.all })
    },
  })
}