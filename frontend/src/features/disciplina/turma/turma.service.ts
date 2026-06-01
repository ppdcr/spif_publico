import api  from '../../../shared/api.service'
import { TurmaResponseSchema, type AtualizarTurmaRequest, type CriarTurmaRequest, type TurmaResponse } from './turma.types';

export const turmaService = {
  criar: async (disciplinaId: number, dados: CriarTurmaRequest): Promise<TurmaResponse> => {
    const { data } = await api.post(`/disciplinas/${disciplinaId}/turmas`, dados);
    return TurmaResponseSchema.parse(data);
  },
  
  deletar: async (disciplinaId: number, turmaId: number): Promise<void> => {
    await api.delete(`/disciplinas/${disciplinaId}/turmas/${turmaId}`);
  },

  atualizar: async (disciplinaId: number, turmaId: number, dados: AtualizarTurmaRequest): Promise<TurmaResponse> => {
    const { data } = await api.put(`/disciplinas/${disciplinaId}/turmas/${turmaId}`, dados)
    return TurmaResponseSchema.parse(data)
  },

  buscar: async (disciplinaId: number, turmaId: number): Promise<TurmaResponse> => {
    const { data } = await api.get(`/disciplinas/${disciplinaId}/turmas/${turmaId}`)
    return TurmaResponseSchema.parse(data)
  }
};