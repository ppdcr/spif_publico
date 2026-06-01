import api from '../../../shared/api.service'
import {
  nivelResponseSchema,
  contemResponseSchema,
  type AtualizarNivelRequest,
  type CriarNivelRequest,
  type NivelResponse,
  type ContemResponse,
  type AdicionarProblemasAoNivelRequest,
} from './nivel.types'

// POST /percursos/:percursoId/niveis
const criarNivel = async (percursoId: number, dados: CriarNivelRequest): Promise<NivelResponse> => {
  const { data } = await api.post(`/percursos/${percursoId}/niveis`, dados)
  return nivelResponseSchema.parse(data)
}

// GET /percursos/:percursoId/niveis
const listarNiveis = async (percursoId: number): Promise<NivelResponse[]> => {
  const { data } = await api.get(`/percursos/${percursoId}/niveis`)
  return nivelResponseSchema.array().parse(data)
}

// PUT /percursos/:percursoId/niveis/:nivelId
const atualizarNivel = async (
  percursoId: number,
  nivelId: number,
  dados: AtualizarNivelRequest
): Promise<NivelResponse> => {
  const { data } = await api.put(`/percursos/${percursoId}/niveis/${nivelId}`, dados)
  return nivelResponseSchema.parse(data)
}

// DELETE /percursos/:percursoId/niveis/:nivelId — retorna 204 sem body
const deletarNivel = async (percursoId: number, nivelId: number): Promise<void> => {
  await api.delete(`/percursos/${percursoId}/niveis/${nivelId}`)
}

// POST /percursos/:percursoId/niveis/:nivelId/problemas
const adicionarProblemas = async (
  percursoId: number,
  nivelId: number,
  dados: AdicionarProblemasAoNivelRequest
): Promise<ContemResponse> => {
  const { data } = await api.post(`/percursos/${percursoId}/niveis/${nivelId}/problemas`, dados)
  return contemResponseSchema.parse(data)
}

// DELETE /percursos/:percursoId/niveis/:nivelId/problemas/:problemaId
const removerProblema = async (
  percursoId: number,
  nivelId: number,
  problemaId: number
): Promise<void> => {
  await api.delete(`/percursos/${percursoId}/niveis/${nivelId}/problemas/${problemaId}`)
}

export const nivelService = {
  criarNivel,
  listarNiveis,
  atualizarNivel,
  deletarNivel,
  adicionarProblemas,
  removerProblema,
} as const
