import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { turmaListaService } from './turma-lista.service';
import type { AdicionarListaATurmaRequest, AtualizarListaTurmaRequest } from './turma-lista.types';

// === Keys de Cache ===
export const turmaListaKeys = {
  all: (disciplinaId: number, turmaId: number) => ['disciplinas', disciplinaId, 'turmas', turmaId, 'listas'] as const,
  ativas: (disciplinaId: number, turmaId: number) => [...turmaListaKeys.all(disciplinaId, turmaId), 'ativas'] as const,
  inativas: (disciplinaId: number, turmaId: number) => [...turmaListaKeys.all(disciplinaId, turmaId), 'inativas'] as const,
};

// === Hooks de Queries ===

export function useListasAtivasTurma(disciplinaId: number, turmaId: number) {
  return useQuery({
    queryKey: turmaListaKeys.ativas(disciplinaId, turmaId),
    queryFn: () => turmaListaService.listarAtivas(disciplinaId, turmaId),
  });
}

export function useListasInativasTurma(disciplinaId: number, turmaId: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: turmaListaKeys.inativas(disciplinaId, turmaId),
    queryFn: () => turmaListaService.listarInativas(disciplinaId, turmaId),
    enabled: options?.enabled,
  });
}

// === Hooks de Mutations ===

export function useAdicionarListaTurma(disciplinaId: number, turmaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AdicionarListaATurmaRequest) => 
      turmaListaService.adicionar(disciplinaId, turmaId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: turmaListaKeys.all(disciplinaId, turmaId) });
    },
  });
}

export function useAtualizarListaTurma(disciplinaId: number, turmaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listaId, request }: { listaId: number; request: AtualizarListaTurmaRequest }) => 
      turmaListaService.atualizar(disciplinaId, turmaId, listaId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: turmaListaKeys.all(disciplinaId, turmaId) });
    },
  });
}

export function useDeletarListaTurma(disciplinaId: number, turmaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listaId: number) => 
      turmaListaService.deletar(disciplinaId, turmaId, listaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: turmaListaKeys.all(disciplinaId, turmaId) });
    },
  });
}