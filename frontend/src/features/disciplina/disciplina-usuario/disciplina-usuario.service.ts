import api from '../../../shared/api.service'
import { type DisciplinaResponse } from '../disciplina.types'
import {
  cursaResponseSchema,
  type CursaResponse,
  type MatricularCursaRequest,
} from './disciplina-usuario.types'

import { usuarioResumoResponseSchema, type UsuarioResumoResponse } from '../../usuario/usuario.types'

// -- Relacionados a Minhas Disciplinas e Convites (Logado) --
const listarMinhasDisciplinasAtivas = async (): Promise<DisciplinaResponse[]> => {
  const { data } = await api.get('/disciplinas/my')
  return data
}

const listarMeusConvites = async (): Promise<DisciplinaResponse[]> => {
  const { data } = await api.get('/disciplinas/my/convites')
  return data
}

const aceitarConvite = async (disciplinaId: number): Promise<void> => {
  await api.put(`/disciplinas/${disciplinaId}/aceitar-convite`)
}

// -- Relacionados à Gestão da Disciplina --
const convidarAluno = async (disciplinaId: number, request: MatricularCursaRequest): Promise<CursaResponse> => {
  const { data } = await api.post(`/disciplinas/${disciplinaId}/alunos`, request)
  return cursaResponseSchema.parse(data)
}

const adicionarProfessor = async (disciplinaId: number): Promise<CursaResponse> => {
  const { data } = await api.post(`/disciplinas/${disciplinaId}/ministrar`)
  return cursaResponseSchema.parse(data)
}

const desmatricular = async (disciplinaId: number): Promise<void> => {
  await api.delete(`/disciplinas/${disciplinaId}/usuarios/sair`)
}

const listarUsuariosAtivos = async (disciplinaId: number): Promise<UsuarioResumoResponse[]> => {
  const { data } = await api.get(`/disciplinas/${disciplinaId}/usuarios`)
  return usuarioResumoResponseSchema.array().parse(data)
}

const listarConvidados = async (disciplinaId: number): Promise<UsuarioResumoResponse[]> => {
  const { data } = await api.get(`/disciplinas/${disciplinaId}/convidados`)
  return usuarioResumoResponseSchema.array().parse(data)
}

export const disciplinaUsuarioService = {
  listarMinhasDisciplinasAtivas,
  listarMeusConvites,
  aceitarConvite,
  convidarAluno,
  adicionarProfessor,
  desmatricular,
  listarUsuariosAtivos,
  listarConvidados,
} as const