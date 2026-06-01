import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usuarioService } from './usuario.service'
import type {
  AuthRequest,
  CriarUsuarioRequest,
  UsuarioResponse,
  UsuarioRankingResponse,
} from './usuario.types'

// ── Query keys centralizadas ──────────────────────────────────────────────────

export const usuarioKeys = {
  all: ['usuario'] as const,
  list: () => [...usuarioKeys.all, 'list'] as const,
  detail: (id: number) => [...usuarioKeys.all, 'detail', id] as const,
  ranking: () => [...usuarioKeys.all, 'ranking'] as const,
}

// ── Queries ───────────────────────────────────────────────────────────────────

export const useUsuarioPorId = (id: number) => {
  return useQuery<UsuarioResponse>({
    queryKey: usuarioKeys.detail(id),
    queryFn: () => usuarioService.buscarUsuarioPorId(id),
    enabled: id > 0,
  })
}

export const useUsuariosPorNome = (termo: string) => {
  const termoLimpo = termo.trim()
  return useQuery({
    queryKey: ['usuarios', 'busca', termoLimpo],
    queryFn: () => usuarioService.buscarUsuarioPorNome(termoLimpo),
    enabled: termoLimpo.length >= 1
  });
};

export const useListarRanking = () => {
  return useQuery<UsuarioRankingResponse>({
    queryKey: usuarioKeys.ranking(),
    queryFn: () => usuarioService.listarRanking(),
  })
}

// ── Mutations ─────────────────────────────────────────────────────────────────

export const useCadastrarUsuario = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dados: CriarUsuarioRequest) => usuarioService.cadastrarUsuario(dados),
    onSuccess: () => {
      // Invalida a lista de usuários (se houver) para refletir novo cadastro
      queryClient.invalidateQueries({ queryKey: usuarioKeys.all })
    },
  })
}

export const useLoginUsuario = () => {
  return useMutation({
    mutationFn: (dados: AuthRequest) => usuarioService.loginUsuario(dados),
  })
}

export const useEditarPerfil = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dados: Partial<CriarUsuarioRequest>) => usuarioService.atualizarUsuario(dados),
    onSuccess: () => {
      // Invalida todas as queries de usuário para refletir alterações
      queryClient.invalidateQueries({ queryKey: usuarioKeys.all })
    },
  })
}

export const useElogiarProfessor = (id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => usuarioService.elogiarProfessor(id),
    onSuccess: () => {
      // Atualiza detalhes do professor elogiado
      queryClient.invalidateQueries({ queryKey: usuarioKeys.detail(id) })
    },
  })
}