import api from "../../../../shared/api.service";
import { TurmaListaResponseSchema, type AdicionarListaATurmaRequest, type AtualizarListaTurmaRequest, type TurmaListaResponse } from "./turma-lista.types";
import { ListaProblemasResponseSchema, type ListaProblemasResponse } from "../../../lista/lista.types";

export const turmaListaService = {

  listarAtivas: async (disciplinaId: number, turmaId: number): Promise<ListaProblemasResponse[]> => {
    const { data } = await api.get(`/disciplinas/${disciplinaId}/turmas/${turmaId}/listas`);
    return ListaProblemasResponseSchema.array().parse(data);
  },

  listarInativas: async (disciplinaId: number, turmaId: number): Promise<ListaProblemasResponse[]> => {
    const { data } = await api.get(`/disciplinas/${disciplinaId}/turmas/${turmaId}/listas/inativas`);
    return ListaProblemasResponseSchema.array().parse(data);
  },

  adicionar: async (disciplinaId: number, turmaId: number, request: AdicionarListaATurmaRequest): Promise<TurmaListaResponse> => {
    const { data } = await api.post(`/disciplinas/${disciplinaId}/turmas/${turmaId}/listas`, request);
    return TurmaListaResponseSchema.parse(data);
  },

  atualizar: async (disciplinaId: number, turmaId: number, listaId: number, request: AtualizarListaTurmaRequest): Promise<TurmaListaResponse> => {
    const { data } = await api.put(`/disciplinas/${disciplinaId}/turmas/${turmaId}/listas/${listaId}`, request);
    return TurmaListaResponseSchema.parse(data);
  },

  deletar: async (disciplinaId: number, turmaId: number, listaId: number): Promise<void> => {
    await api.delete(`/disciplinas/${disciplinaId}/turmas/${turmaId}/listas/${listaId}`);
  },

};