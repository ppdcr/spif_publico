import api  from '../../../../shared/api.service'
import { usuarioResumoResponseSchema, type UsuarioResumoResponse } from '../../../usuario/usuario.types';
import { TurmaResponseSchema, type TurmaResponse } from '../turma.types';
import { IngressaResponseSchema, type IngressaResponse, type MatricularTurmaRequest } from './turma-usuario.types';


export const turmaUsuarioService = {
    listarMinhasTurmas: async (disciplinaId: number): Promise<TurmaResponse[]> => {
        const { data } = await api.get(`/disciplinas/${disciplinaId}/turmas/my`);
        return TurmaResponseSchema.array().parse(data);
    },

    listarMeusConvites: async (disciplinaId: number): Promise<TurmaResponse[]> => {
        const { data } = await api.get(`/disciplinas/${disciplinaId}/turmas/my/convites`);
        return TurmaResponseSchema.array().parse(data);
    },

    listarUsuariosMatriculados: async (disciplinaId: number, turmaId: number): Promise<UsuarioResumoResponse[]> => {
        const { data } = await api.get(`/disciplinas/${disciplinaId}/turmas/${turmaId}/usuarios`)
        return usuarioResumoResponseSchema.array().parse(data)
    },

    listarUsuariosConvidados: async (disciplinaId: number, turmaId: number): Promise<UsuarioResumoResponse[]> => {
        const { data } = await api.get(`/disciplinas/${disciplinaId}/turmas/${turmaId}/convidados`)
        return usuarioResumoResponseSchema.array().parse(data)
    },

    aceitarConvite: async (disciplinaId: number, turmaId: number): Promise<void> => {
        await api.put(`/disciplinas/${disciplinaId}/turmas/${turmaId}/aceitar-convite`);
    },

    desmatricular: async (disciplinaId: number, turmaId: number): Promise<void> => {
        await api.delete(`/disciplinas/${disciplinaId}/turmas/${turmaId}/usuarios/sair`);
    },

    convidar: async (disciplinaId: number, turmaId: number, dados: MatricularTurmaRequest): Promise<IngressaResponse> => {
        const { data } = await api.post(`/disciplinas/${disciplinaId}/turmas/${turmaId}/usuarios`, dados)
        return IngressaResponseSchema.parse(data)
    },

    aceitarConviteQrCode: async (disciplinaId: number, codigoConvite: string): Promise<IngressaResponse> => {
        const { data } = await api.post(`/disciplinas/${disciplinaId}/turmas/aceitar-convite-qrcode`, null, {
            params: { codigoConvite }
        })
        return IngressaResponseSchema.parse(data)
    }
}
