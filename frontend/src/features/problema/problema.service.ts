import api from '../../shared/api.service'
import {
  problemaResponseSchema,
  problemaResumoResponseSchema,
  paginaProblemaSchema,
  type AtualizarProblemaRequest,
  type CriarProblemaRequest,
  type PaginaProblema,
  type ProblemaFiltroRequest,
  type ProblemaResponse,
  type ProblemaResumoResponse,
} from './problema.types'

// POST /problemas
const criarProblema = async (dados: CriarProblemaRequest): Promise<ProblemaResponse> => {
  const { data } = await api.post('/problemas', dados)
  return problemaResponseSchema.parse(data)
}

// GET /problemas/:id
const buscarProblema = async (id: number): Promise<ProblemaResponse> => {
  const { data } = await api.get(`/problemas/${id}`)
  return problemaResponseSchema.parse(data)
}

// GET /problemas — com filtros e paginação
const listarProblemas = async (filtro?: ProblemaFiltroRequest): Promise<PaginaProblema> => {
  const { data } = await api.get('/problemas', { params: filtro })
  return paginaProblemaSchema.parse(data)
}

// GET /problemas/me — problemas ativos do professor autenticado
const listarMeusProblemasAtivos = async (): Promise<ProblemaResumoResponse[]> => {
  const { data } = await api.get('/problemas/me')
  return problemaResumoResponseSchema.array().parse(data)
}

// GET /problemas/me/inativos — problemas inativos do professor autenticado
const listarMeusProblemasInativos = async (): Promise<ProblemaResumoResponse[]> => {
  const { data } = await api.get('/problemas/me/inativos')
  return problemaResumoResponseSchema.array().parse(data)
}

// PUT /problemas/:id
const atualizarProblema = async (
  id: number,
  dados: AtualizarProblemaRequest
): Promise<ProblemaResponse> => {
  const { data } = await api.put(`/problemas/${id}`, dados)
  return problemaResponseSchema.parse(data)
}

// DELETE /problemas/:id — retorna 204 sem body
const deletarProblema = async (id: number): Promise<void> => {
  await api.delete(`/problemas/${id}`)
}

export const problemaService = {
  criarProblema,
  buscarProblema,
  listarProblemas,
  listarMeusProblemasAtivos,
  listarMeusProblemasInativos,
  atualizarProblema,
  deletarProblema,
} as const