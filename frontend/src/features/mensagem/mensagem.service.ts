import api from '../../shared/api.service'; // Ajuste o path conforme sua estrutura
import {
  type MensagemResponse,
  type ConversaResponse,
  type MandarMensagemProblemaRequest,
  MensagemResponseSchema,
  ConversaResponseSchema,
} from './mensagem.types';

export const mensagemService = {
  // === MENSAGENS DE PROBLEMAS ===
  listarMensagensProblema: async (problemaId: number): Promise<MensagemResponse[]> => {
    const { data } = await api.get(`/problemas/${problemaId}/mensagens`);
    console.log(data)
    return MensagemResponseSchema.array().parse(data);
  },

  enviarMensagemProblema: async (problemaId: number, request: MandarMensagemProblemaRequest): Promise<MensagemResponse> => {
    const { data } = await api.post(`/problemas/${problemaId}/mensagens`, request);
    return MensagemResponseSchema.parse(data);
  },

  // === MENSAGENS DE USUÁRIO (REST) ===
  listarConversas: async (): Promise<ConversaResponse[]> => {
    const { data } = await api.get(`/me/conversas`);
    return ConversaResponseSchema.array().parse(data);
  },

  listarMensagensUsuario: async (destinatarioId: number): Promise<MensagemResponse[]> => {
    const { data } = await api.get(`/usuarios/${destinatarioId}/mensagens`);
    return MensagemResponseSchema.array().parse(data);
  }
};