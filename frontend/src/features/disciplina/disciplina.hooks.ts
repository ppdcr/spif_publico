import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { disciplinaService } from './disciplina.service'
import type {
  AtualizarDisciplinaRequest,
  CriarDisciplinaRequest,
} from './disciplina.types'
import { cursaKeys } from './disciplina-usuario/disciplina-usuario.hooks'

// ── Query keys centralizadas ──────────────────────────────────────────────────

export const disciplinaKeys = {
  all: ['disciplinas'] as const,
  lists: () => [...disciplinaKeys.all, 'list'] as const,
  detail: (id: number) => [...disciplinaKeys.all, 'detail', id] as const, 
}

// ── Queries ───────────────────────────────────────────────────────────────────

export const useListarDisciplinas = () => {
  return useQuery({
    queryKey: disciplinaKeys.lists(),
    queryFn: () => disciplinaService.listarDisciplinas(),
  })
}

export const useBuscarDisciplina = (id: number) => {
  return useQuery({
    queryKey: disciplinaKeys.detail(id),
    queryFn: () => disciplinaService.buscarDisciplina(id),
    enabled: !!id
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export const useCriarDisciplina = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dados: CriarDisciplinaRequest) => disciplinaService.criarDisciplina(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: disciplinaKeys.lists() })
    },
  })
}

export const useAtualizarDisciplina = (userId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    // Passamos o ID e os dados no objeto da mutation
    mutationFn: ({ disciplinaId, dados }: { disciplinaId: number; dados: AtualizarDisciplinaRequest }) => 
      disciplinaService.atualizarDisciplina(disciplinaId, dados),
    onSuccess: (_data, variables) => {
      const { disciplinaId } = variables
      
      queryClient.invalidateQueries({ queryKey: disciplinaKeys.detail(disciplinaId) })
      queryClient.invalidateQueries({ queryKey: disciplinaKeys.lists() })
      
      // Invalida a visão do usuário se ele estiver vinculado
      queryClient.invalidateQueries({ queryKey: cursaKeys.minhasAtivas(userId) })
    },
  })
}

export const useDeletarDisciplina = (userId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (disciplinaId: number) => disciplinaService.deletarDisciplina(disciplinaId),
    onSuccess: (_data, disciplinaId) => {
      // Invalida a lista e remove o detalhe específico do cache
      queryClient.invalidateQueries({ queryKey: disciplinaKeys.lists() })
      queryClient.invalidateQueries({ queryKey: disciplinaKeys.detail(disciplinaId) })
      
      // Atualiza o painel do usuário
      queryClient.invalidateQueries({ queryKey: cursaKeys.minhasAtivas(userId) })
    },
  })
}