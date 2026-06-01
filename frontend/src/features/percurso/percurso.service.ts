import api from '../../shared/api.service'
import {
  percursoResponseSchema,
  type AtualizarPercursoRequest,
  type CriarPercursoRequest,
  type PercursoResponse,
} from './percurso.types'

// POST /percursos
const criarPercurso = async (dados: CriarPercursoRequest): Promise<PercursoResponse> => {
  const { data } = await api.post('/percursos', dados)
  return percursoResponseSchema.parse(data)
}

// GET /percursos
const listarPercursos = async (): Promise<PercursoResponse[]> => {
  const { data } = await api.get('/percursos')
  return percursoResponseSchema.array().parse(data)
}

// PUT /percursos/:id
const atualizarPercurso = async (
  id: number,
  dados: AtualizarPercursoRequest
): Promise<PercursoResponse> => {
  const { data } = await api.put(`/percursos/${id}`, dados)
  return percursoResponseSchema.parse(data)
}

// DELETE /percursos/:id — retorna 204 sem body
const deletarPercurso = async (id: number): Promise<void> => {
  await api.delete(`/percursos/${id}`)
}

export const percursoService = {
  criarPercurso,
  listarPercursos,
  atualizarPercurso,
  deletarPercurso,
} as const
