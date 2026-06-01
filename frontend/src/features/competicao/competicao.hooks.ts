import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { competicaoService } from './competicao.service'
import type {
  CriarCompeticaoRequest,
  AtualizarCompeticaoRequest,
  AdicionarProblemaEmCompeticaoRequest,
} from './competicao.types'
import { problemaKeys } from '../problema/problema.hooks'

// ── Query keys centralizadas ──────────────────────────────────────────────────

export const competicaoKeys = {
  all: ['competicoes'] as const,
  ativas: () => [...competicaoKeys.all, 'ativas'] as const,
  inativas: () => [...competicaoKeys.all, 'inativas'] as const,
}

// ── Queries ───────────────────────────────────────────────────────────────────

export const useListarCompeticoesAtivas = () => {
  return useQuery({
    queryKey: competicaoKeys.ativas(),
    queryFn: () => competicaoService.listarAtivas(),
  })
}

export const useListarCompeticoesInativas = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: competicaoKeys.inativas(),
    queryFn: () => competicaoService.listarInativas(),
    ...options,
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export const useCriarCompeticao = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dados: CriarCompeticaoRequest) => competicaoService.criar(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: competicaoKeys.all })
    },
  })
}

export const useAtualizarCompeticao = (id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dados: AtualizarCompeticaoRequest) =>
      competicaoService.atualizar(id, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: competicaoKeys.all })
    },
  })
}

export const useDeletarCompeticao = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => competicaoService.deletar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: competicaoKeys.all })
    },
  })
}

export const useAdicionarProblemasACompeticao = (competicaoId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dados: AdicionarProblemaEmCompeticaoRequest) =>
      competicaoService.adicionarProblemas(competicaoId, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: competicaoKeys.all })
      queryClient.invalidateQueries({ queryKey: problemaKeys.lists() })
    },
  })
}

export const useRemoverProblemaDaCompeticao = (competicaoId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (problemaId: number) =>
      competicaoService.removerProblema(competicaoId, problemaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: competicaoKeys.all })
      queryClient.invalidateQueries({ queryKey: problemaKeys.lists() })
    },
  })
}
