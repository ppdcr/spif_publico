import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { turmaService } from './turma.service';
import type { AtualizarTurmaRequest, CriarTurmaRequest } from './turma.types';
import { turmaUsuarioKeys } from './turma-usuario/turma-usuario.hooks';

// --- CHAVES DE CACHE (QUERY KEYS) ---
export const turmaKeys = {
  all: ['turmas'] as const,
  lists: (disciplinaId: number) => [...turmaKeys.all, 'list', disciplinaId] as const,
  detail: (disciplinaId: number, turmaId: number) => [...turmaKeys.all, 'detail', disciplinaId, turmaId] as const,
};

// --- HOOKS DE CONSULTA (QUERIES) ---

export const useBuscarTurma = (disciplinaId: number, turmaId: number) => {
  return useQuery({
    queryKey: turmaKeys.detail(disciplinaId, turmaId),
    queryFn: () => turmaService.buscar(disciplinaId, turmaId),
    enabled: !!disciplinaId && !!turmaId, // Só executa se tiver os IDs
  });
};

// --- HOOKS DE AÇÃO (MUTATIONS) ---

export const useCriarTurma = (disciplinaId: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (dados: CriarTurmaRequest) => turmaService.criar(disciplinaId, dados),
    onSuccess: () => {
      // Invalida a lista de turmas da disciplina para recarregar com a nova turma
      queryClient.invalidateQueries({ queryKey: turmaUsuarioKeys.minhasTurmas(disciplinaId)})
      queryClient.invalidateQueries({ queryKey: turmaKeys.lists(disciplinaId) });
    },
  });
};

export const useAtualizarTurma = (disciplinaId: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ turmaId, dados }: { turmaId: number; dados: AtualizarTurmaRequest }) => 
      turmaService.atualizar(disciplinaId, turmaId, dados),
    
    // Desestruturamos 'variables' para acessar o 'turmaId'
    onSuccess: (_data, variables) => {
      const { turmaId } = variables; // <--- Pegamos o ID aqui

      // Agora passamos o number corretamente
      queryClient.invalidateQueries({ 
        queryKey: turmaKeys.detail(disciplinaId, turmaId) 
      });
    
      queryClient.invalidateQueries({ 
        queryKey: turmaKeys.lists(disciplinaId) 
      });
    },
  });
};

export const useDeletarTurma = (disciplinaId: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (turmaId: number) => turmaService.deletar(disciplinaId, turmaId),
    onSuccess: (_, turmaId) => {
      // Limpa os dados específicos da turma deletada
      queryClient.invalidateQueries({ queryKey: turmaKeys.detail(disciplinaId, turmaId) });
      // Invalida a lista para remover o item deletado da interface
      queryClient.invalidateQueries({ queryKey: turmaKeys.lists(disciplinaId) });
      queryClient.invalidateQueries({ queryKey: turmaUsuarioKeys.minhasTurmas(disciplinaId)})
    },
  });
};