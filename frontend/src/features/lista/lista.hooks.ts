import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listaService } from './lista.service';
import { 
  type CriarListaProblemasRequest, 
  type AtualizarListaProblemasRequest,
  type AdicionarProblemaAListaRequest 
} from './lista.types';
import { problemaKeys } from '../problema/problema.hooks';

// === Keys de Cache ===
export const listaKeys = {
  all: ['listas'] as const,
  detail: (listaId: number) => [...listaKeys.all, listaId],
  me: (titulo?: string) => [...listaKeys.all, 'me', titulo ?? 'todos'] as const,
};

// === Hooks de Queries (Busca de Dados) ===

export function useListarMinhasListas(titulo?: string) {
  return useQuery({
    queryKey: listaKeys.me(titulo),
    queryFn: () => listaService.listarMinhas(titulo),
  });
}

export function useBuscarLista(listaId: number, turmaId: number | undefined) {
  return useQuery({
    queryKey: listaKeys.detail(listaId),
    queryFn: () => listaService.buscar(listaId, turmaId)
  })
}

// === Hooks de Mutations (Alteração de Dados) ===

export function useCriarLista() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CriarListaProblemasRequest) => listaService.criar(request),
    onSuccess: () => {
      // Invalida a lista do professor para atualizar a tela automaticamente
      queryClient.invalidateQueries({ queryKey: listaKeys.all });
    },
  });
}

export function useAtualizarLista() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ listaId, dados }: { listaId: number; dados: AtualizarListaProblemasRequest }) => 
      listaService.atualizar(listaId, dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listaKeys.all });
    },
  });
}

export function useDeletarLista() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listaId: number) => listaService.deletar(listaId),
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: listaKeys.all });
    },
  });
}

export function useAdicionarProblemaALista(listaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AdicionarProblemaAListaRequest) => 
      listaService.adicionarProblema(listaId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listaKeys.detail(listaId) });
      queryClient.invalidateQueries({ queryKey: problemaKeys.lists() });
    },
  });
}

export function useDeletarProblemaDaLista(listaId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (problemaId: number) => 
      listaService.deletarProblema(listaId, problemaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: listaKeys.detail(listaId) });
      queryClient.invalidateQueries({ queryKey: problemaKeys.lists() });
    },
  });
}