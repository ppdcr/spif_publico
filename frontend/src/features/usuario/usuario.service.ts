import api from '../../shared/api.service'
import {
  authResponseSchema,
  usuarioResponseSchema,
  usuarioRankingResponseSchema,
  type AuthRequest,
  type AuthResponse,
  type CriarUsuarioRequest,
  type UsuarioResponse,
  type UsuarioRankingResponse,
  type UsuarioResumoResponse,
  usuarioResumoResponseSchema
} from './usuario.types'

const cadastrarUsuario = async (dados: CriarUsuarioRequest): Promise<AuthResponse> => {
  const { data } = await api.post('/usuarios/auth/cadastrar', dados)
  return authResponseSchema.parse(data)
}

const loginUsuario = async (dados: AuthRequest): Promise<AuthResponse> => {
  try{
    const { data } = await api.post('/usuarios/auth/login', dados)
    return authResponseSchema.parse(data)
  } catch (error: any) {
    console.log(error.response?.data);
    console.log(error.response?.status);
    throw error
  }
}

const buscarUsuarioPorId = async (id: number): Promise<UsuarioResponse> => {
  const { data } = await api.get(`/usuarios/${id}`)
  return usuarioResponseSchema.parse(data)
}

const buscarUsuarioPorNome = async (termo: string): Promise<UsuarioResumoResponse[]> => {
  try {
    const { data } = await api.get(`/usuarios?nome=${encodeURIComponent(termo)}`)
    console.log('Resultado da busca por nome:', data)
    return usuarioResumoResponseSchema.array().parse(data)
  } catch (error: any) {
    console.error('Erro ao buscar usuários por nome:', error.response?.status, error.response?.data)
    throw error
  }
}

const atualizarUsuario = async (
  dados: Partial<CriarUsuarioRequest>
): Promise<UsuarioResponse> => {
  const { data } = await api.put('/usuarios/me/atualizar-dados', dados)
  return usuarioResponseSchema.parse(data)
}

const elogiarProfessor = async (id: number): Promise<void> => {
  await api.put(`/usuarios/${id}/elogiar`)
}

const listarRanking = async (): Promise<UsuarioRankingResponse> => {
  const { data } = await api.get('/usuarios/ranking')
  return usuarioRankingResponseSchema.parse(data)
}

export const usuarioService = {
  cadastrarUsuario,
  loginUsuario,
  buscarUsuarioPorId,
  buscarUsuarioPorNome,
  atualizarUsuario,
  elogiarProfessor,
  listarRanking
} as const