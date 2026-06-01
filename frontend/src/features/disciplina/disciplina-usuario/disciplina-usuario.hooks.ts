import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { disciplinaUsuarioService } from './disciplina-usuario.service'
import { disciplinaKeys } from '../disciplina.hooks'
import type { MatricularCursaRequest } from './disciplina-usuario.types'

export const cursaKeys = {
  all: ['cursas'] as const,
  // Visão do Aluno/Usuário (Dashboard)
  meuPainel: (userId: number) => [...cursaKeys.all, 'usuario', userId] as const,
  minhasAtivas: (userId: number) => [...cursaKeys.meuPainel(userId), 'ativas'] as const,
  meusConvites: (userId: number) => [...cursaKeys.meuPainel(userId), 'convites'] as const,

  // Visão do Professor (Gestão da Disciplina)
  gestao: (disciplinaId: number) => [...cursaKeys.all, 'disciplina', disciplinaId] as const,
  membrosAtivos: (disciplinaId: number) => [...cursaKeys.gestao(disciplinaId), 'ativos'] as const,
  membrosConvidados: (disciplinaId: number) => [...cursaKeys.gestao(disciplinaId), 'convidados'] as const,
}

// --- HOOKS DE CONSULTA (QUERIES) ---

export const useMinhasDisciplinas = (userId: number) => {
  return useQuery({
    queryKey: cursaKeys.minhasAtivas(userId),
    queryFn: disciplinaUsuarioService.listarMinhasDisciplinasAtivas,
  })
}

export const useMeusConvites = (userId: number) => {
  return useQuery({
    queryKey: cursaKeys.meusConvites(userId),
    queryFn: disciplinaUsuarioService.listarMeusConvites,
  })
}

export const useUsuariosAtivosDisciplina = (disciplinaId: number) => {
  return useQuery({
    queryKey: cursaKeys.membrosAtivos(disciplinaId),
    queryFn: () => disciplinaUsuarioService.listarUsuariosAtivos(disciplinaId),
  });
};

export const useConvidadosDisciplina = (disciplinaId: number) => {
  return useQuery({
    queryKey: cursaKeys.membrosConvidados(disciplinaId),
    queryFn: () => disciplinaUsuarioService.listarConvidados(disciplinaId),
  });
};

// --- HOOKS DE AÇÃO (MUTATIONS) ---

// No arquivo de hooks
export const useConvidarAluno = (disciplinaId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: MatricularCursaRequest) => 
      disciplinaUsuarioService.convidarAluno(disciplinaId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: cursaKeys.gestao(disciplinaId) 
      })
    },
    onError: (e) => {
      console.log(e)
      throw e
    }
  })
}

export const useAceitarConvite = (userId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (disciplinaId: number) => disciplinaUsuarioService.aceitarConvite(disciplinaId),
    onSuccess: (_, disciplinaId) => {
      // 1. Remove dos convites do aluno
      queryClient.invalidateQueries({ queryKey: cursaKeys.meusConvites(userId) })
      // 2. Adiciona às disciplinas ativas do aluno
      queryClient.invalidateQueries({ queryKey: cursaKeys.minhasAtivas(userId) })
      // 3. Atualiza a lista de membros para o professor daquela disciplina
      queryClient.invalidateQueries({ queryKey: cursaKeys.gestao(disciplinaId) })
      queryClient.invalidateQueries({ queryKey: disciplinaKeys.lists() })
    },
  })
}

export const useMinistrarDisciplina = (userId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (disciplinaId: number) => disciplinaUsuarioService.adicionarProfessor(disciplinaId),
    onSuccess: (_, disciplinaId) => {
      queryClient.invalidateQueries({ queryKey: cursaKeys.minhasAtivas(userId) })
      queryClient.invalidateQueries({ queryKey: cursaKeys.gestao(disciplinaId) })
      queryClient.invalidateQueries({ queryKey: disciplinaKeys.lists() })
    },
  })
}

export const useDesmatricular = (userId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (disciplinaId: number) => disciplinaUsuarioService.desmatricular(disciplinaId),
    onSuccess: (_, disciplinaId) => {
      queryClient.invalidateQueries({ queryKey: cursaKeys.minhasAtivas(userId) })
      queryClient.invalidateQueries({ queryKey: cursaKeys.gestao(disciplinaId) })
      queryClient.invalidateQueries({ queryKey: disciplinaKeys.lists() })
    },
  })
}