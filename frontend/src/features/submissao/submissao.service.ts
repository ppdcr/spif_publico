import api from '../../shared/api.service'
import type { CriarSubmissaoPayload, SubmissaoDetalhe, SubmissaoResumo } from './submissao.types'

const base = (problemaId: number) => `/problemas/${problemaId}/submissoes`

export const submissaoService = {
    criar: async (
        problemaId: number,
        payload: CriarSubmissaoPayload,
    ): Promise<SubmissaoResumo> => {
        const { data } = await api.post<SubmissaoResumo>(base(problemaId), payload)
        return data
    },

    listar: async (problemaId: number): Promise<SubmissaoResumo[]> => {
        const { data } = await api.get<SubmissaoResumo[]>(base(problemaId))
        return data
    },

    buscarDetalhe: async (
        problemaId: number,
        submissaoId: number,
    ): Promise<SubmissaoDetalhe> => {
        const { data } = await api.get<SubmissaoDetalhe>(
            `${base(problemaId)}/${submissaoId}`,
        )
        return data
    },
}