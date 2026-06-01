import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { turmaUsuarioService } from './turma-usuario.service';
import type { MatricularTurmaRequest } from './turma-usuario.types';

export const turmaUsuarioKeys = {
  all: ['turma-usuario'] as const,
  
  // Visão do Aluno/Usuário (Painel da Disciplina)
  meuPainel: (disciplinaId: number) => [...turmaUsuarioKeys.all, 'minhas', disciplinaId] as const,
  minhasTurmas: (disciplinaId: number) => [...turmaUsuarioKeys.meuPainel(disciplinaId), 'ativas'] as const,
  meusConvites: (disciplinaId: number) => [...turmaUsuarioKeys.meuPainel(disciplinaId), 'convites'] as const,

  // Visão do Professor (Gestão da Turma)
  gestao: (disciplinaId: number, turmaId: number) => [...turmaUsuarioKeys.all, 'gestao', disciplinaId, turmaId] as const,
  membrosMatriculados: (disciplinaId: number, turmaId: number) => [...turmaUsuarioKeys.gestao(disciplinaId, turmaId), 'matriculados'] as const,
  membrosConvidados: (disciplinaId: number, turmaId: number) => [...turmaUsuarioKeys.gestao(disciplinaId, turmaId), 'convidados'] as const,
};

// --- HOOKS DE CONSULTA (QUERIES) ---

export const useMinhasTurmas = (disciplinaId: number) => {
  return useQuery({
    queryKey: turmaUsuarioKeys.minhasTurmas(disciplinaId),
    queryFn: () => turmaUsuarioService.listarMinhasTurmas(disciplinaId),
  });
};

export const useMeusConvitesTurma = (disciplinaId: number) => {
  return useQuery({
    queryKey: turmaUsuarioKeys.meusConvites(disciplinaId),
    queryFn: () => turmaUsuarioService.listarMeusConvites(disciplinaId),
  });
};

export const useUsuariosMatriculadosTurma = (disciplinaId: number, turmaId: number) => {
  return useQuery({
    queryKey: turmaUsuarioKeys.membrosMatriculados(disciplinaId, turmaId),
    queryFn: () => turmaUsuarioService.listarUsuariosMatriculados(disciplinaId, turmaId),
  });
};

export const useConvidadosTurma = (disciplinaId: number, turmaId: number) => {
  return useQuery({
    queryKey: turmaUsuarioKeys.membrosConvidados(disciplinaId, turmaId),
    queryFn: () => turmaUsuarioService.listarUsuariosConvidados(disciplinaId, turmaId),
  });
};

// --- HOOKS DE AÇÃO (MUTATIONS) ---

export const useConvidarUsuarioTurma = (disciplinaId: number, turmaId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: MatricularTurmaRequest) => 
      turmaUsuarioService.convidar(disciplinaId, turmaId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: turmaUsuarioKeys.gestao(disciplinaId, turmaId) 
      });
    },
    onError: (e) => {
      console.log(e);
      throw e;
    }
  });
};

export const useAceitarConviteTurma = (disciplinaId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (turmaId: number) => turmaUsuarioService.aceitarConvite(disciplinaId, turmaId),
    onSuccess: (_, turmaId) => {
      // 1. Remove dos convites da turma
      queryClient.invalidateQueries({ queryKey: turmaUsuarioKeys.meusConvites(disciplinaId) });
      // 2. Adiciona às turmas ativas do aluno
      queryClient.invalidateQueries({ queryKey: turmaUsuarioKeys.minhasTurmas(disciplinaId) });
      // 3. Atualiza a lista de membros para o professor daquela turma
      queryClient.invalidateQueries({ queryKey: turmaUsuarioKeys.gestao(disciplinaId, turmaId) });
      
      // Se houver uma listagem geral de turmas, pode invalidar aqui também
      // queryClient.invalidateQueries({ queryKey: turmaKeys.lists() });
    },
  });
};

export const useDesmatricularTurma = (disciplinaId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (turmaId: number) => turmaUsuarioService.desmatricular(disciplinaId, turmaId),
    onSuccess: (_, turmaId) => {
      queryClient.invalidateQueries({ queryKey: turmaUsuarioKeys.minhasTurmas(disciplinaId) });
      queryClient.invalidateQueries({ queryKey: turmaUsuarioKeys.gestao(disciplinaId, turmaId) });
      
      // Se houver uma listagem geral de turmas, pode invalidar aqui também
      // queryClient.invalidateQueries({ queryKey: turmaKeys.lists() });
    },
  });
};

export const useAceitarConviteQrCode = (disciplinaId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (codigoConvite: string) => turmaUsuarioService.aceitarConviteQrCode(disciplinaId, codigoConvite),
    onSuccess: () => {
      // Remove dos convites e adiciona às turmas ativas
      queryClient.invalidateQueries({ queryKey: turmaUsuarioKeys.meusConvites(disciplinaId) });
      queryClient.invalidateQueries({ queryKey: turmaUsuarioKeys.minhasTurmas(disciplinaId) });
    },
  });
};