import api from '../../../shared/api.service'
import {
  casoTesteResponseSchema,
  type AtualizarCasoTesteRequest,
  type CasoTesteResponse,
  type CriarCasoTesteRequest,
} from './caso.types'

const base = (problemaId: number) => `/problemas/${problemaId}/casos`

// POST /problemas/:problemaId/casos
const criarCasoTeste = async (
  problemaId: number,
  dados: CriarCasoTesteRequest
): Promise<CasoTesteResponse> => {
  const { data } = await api.post(base(problemaId), dados)
  return casoTesteResponseSchema.parse(data)
}

// GET /problemas/:problemaId/casos
const listarCasos = async (problemaId: number): Promise<CasoTesteResponse[]> => {
  const { data } = await api.get(base(problemaId))
  return casoTesteResponseSchema.array().parse(data)
}

// PUT /problemas/:problemaId/casos/:casoId
const atualizarCasoTeste = async (
  problemaId: number,
  casoId: number,
  dados: AtualizarCasoTesteRequest
): Promise<CasoTesteResponse> => {
  const { data } = await api.put(`${base(problemaId)}/${casoId}`, dados)
  return casoTesteResponseSchema.parse(data)
}

// DELETE /problemas/:problemaId/casos/:casoId — retorna 204 sem body
const deletarCasoTeste = async (problemaId: number, casoId: number): Promise<void> => {
  await api.delete(`${base(problemaId)}/${casoId}`)
}

export const casoTesteService = {
  criarCasoTeste,
  listarCasos,
  atualizarCasoTeste,
  deletarCasoTeste,
} as const