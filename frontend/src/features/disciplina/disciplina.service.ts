import api from '../../shared/api.service' // Ajuste o caminho se necessário
import {
  disciplinaResponseSchema,
  type AtualizarDisciplinaRequest,
  type CriarDisciplinaRequest,
  type DisciplinaResponse,
} from './disciplina.types'

// POST /disciplinas
const criarDisciplina = async (dados: CriarDisciplinaRequest): Promise<DisciplinaResponse> => {
  const { data } = await api.post('/disciplinas', dados)
  return disciplinaResponseSchema.parse(data)
}

// GET /disciplinas
const listarDisciplinas = async (): Promise<DisciplinaResponse[]> => {
  const { data } = await api.get('/disciplinas')
  return disciplinaResponseSchema.array().parse(data)
}

// GET /disciplinas/:id
const buscarDisciplina = async (id: number): Promise<DisciplinaResponse> => {
  const { data } = await api.get(`/disciplinas/${id}`)
  return disciplinaResponseSchema.parse(data)
}

// PUT /disciplinas/:id
const atualizarDisciplina = async (
  id: number,
  dados: AtualizarDisciplinaRequest
): Promise<DisciplinaResponse> => {
  const { data } = await api.put(`/disciplinas/${id}`, dados)
  return disciplinaResponseSchema.parse(data)
}

// DELETE /disciplinas/:id — retorna 204 sem body
const deletarDisciplina = async (id: number): Promise<void> => {
  await api.delete(`/disciplinas/${id}`)
}

export const disciplinaService = {
  criarDisciplina,
  listarDisciplinas,
  atualizarDisciplina,
  deletarDisciplina,
  buscarDisciplina,
} as const