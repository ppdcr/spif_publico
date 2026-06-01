import api from '../../shared/api.service'
import {
  type ListaProblemasResponse,
  type CriarListaProblemasRequest,
  type AtualizarListaProblemasRequest,
  type AdicionarProblemaAListaRequest,
  ListaProblemasResponseSchema,
} from './lista.types'

export const listaService = {
  
  listarMinhas: async (titulo?: string): Promise<ListaProblemasResponse[]> => {
    // Envia o parâmetro titulo apenas se ele for fornecido
    const params = titulo ? { titulo } : {}
    const { data } = await api.get('/listas/me', { params })
    return ListaProblemasResponseSchema.array().parse(data)
  },

  criar: async (request: CriarListaProblemasRequest): Promise<ListaProblemasResponse> => {
    const { data } = await api.post('/listas', request)
    return ListaProblemasResponseSchema.parse(data)
  },

  atualizar: async (listaId: number, request: AtualizarListaProblemasRequest): Promise<ListaProblemasResponse> => {
    const { data } = await api.put(`/listas/${listaId}`, request)
    return ListaProblemasResponseSchema.parse(data)
  },

  deletar: async (listaId: number): Promise<void> => {
    await api.delete(`/listas/${listaId}`)
  },

  buscar: async (listaId: number, turmaId: number | undefined): Promise<ListaProblemasResponse> => {
    const { data } = await api.get(`/listas/${listaId}`, { params: { turmaId } })
    return ListaProblemasResponseSchema.parse(data)
  },

  adicionarProblema: async (listaId: number, request: AdicionarProblemaAListaRequest): Promise<void> => {
    await api.post(`/listas/${listaId}/problemas`, request);
  },

  deletarProblema: async (listaId: number, problemaId: number): Promise<void> => {
    await api.delete(`/listas/${listaId}/problemas/${problemaId}`);
  },
}