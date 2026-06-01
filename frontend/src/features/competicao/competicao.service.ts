import api from '../../shared/api.service'
import {
  type CriarCompeticaoRequest,
  type AtualizarCompeticaoRequest,
  type CompeticaoResponse,
  type AdicionarProblemaEmCompeticaoRequest,
  type ParticipacaoResponse,
  competicaoResponseSchema,
  participacaoResponseSchema,
} from './competicao.types'
import { z } from 'zod'

/**
 * Converte uma string no formato datetime-local ("YYYY-MM-DDTHH:mm")
 * para ISO 8601 com offset do navegador ("YYYY-MM-DDTHH:mm:ss+HH:00").
 * O backend Java (OffsetDateTime) rejeita strings sem offset.
 */
function toOffsetDateTime(localDateTimeStr: string | undefined): string | undefined {
  if (!localDateTimeStr) return undefined
  const date = new Date(localDateTimeStr)
  // Offset do browser em minutos (ex: Brasilia = -180)
  const tzOffset = -date.getTimezoneOffset()
  const sign = tzOffset >= 0 ? '+' : '-'
  const absOffset = Math.abs(tzOffset)
  const hh = String(Math.floor(absOffset / 60)).padStart(2, '0')
  const mm = String(absOffset % 60).padStart(2, '0')
  // Formata: YYYY-MM-DDTHH:mm:ss+HH:mm
  const iso = date.toISOString().slice(0, 19)
  return `${localDateTimeStr.length === 16 ? localDateTimeStr : iso}:00${sign}${hh}:${mm}`
}

const listarAtivas = async (): Promise<CompeticaoResponse[]> => {
  const { data } = await api.get('/competicoes')
  console.log(data)
  return z.array(competicaoResponseSchema).parse(data)
}

const listarInativas = async (): Promise<CompeticaoResponse[]> => {
  const { data } = await api.get('/competicoes/inativas')
  return z.array(competicaoResponseSchema).parse(data)
}

const criar = async (dados: CriarCompeticaoRequest): Promise<CompeticaoResponse> => {
  const payload = {
    ...dados,
    dataInicio: toOffsetDateTime(dados.dataInicio),
    dataFim: dados.dataFim ? toOffsetDateTime(dados.dataFim) : null,
  }
  console.log(payload)
  const { data } = await api.post('/competicoes', payload)
  console.log(data)
  return competicaoResponseSchema.parse(data)
}

const atualizar = async (id: number, dados: AtualizarCompeticaoRequest): Promise<CompeticaoResponse> => {
  const payload = {
    ...dados,
    dataInicio: toOffsetDateTime(dados.dataInicio),
    dataFim: toOffsetDateTime(dados.dataFim),
  }
  const { data } = await api.put(`/competicoes/${id}`, payload)
  return competicaoResponseSchema.parse(data)
}

const deletar = async (id: number): Promise<void> => {
  await api.delete(`/competicoes/${id}`)
}

const adicionarProblemas = async (
  id: number,
  dados: AdicionarProblemaEmCompeticaoRequest
): Promise<ParticipacaoResponse> => {
  const { data } = await api.post(`/competicoes/${id}/problemas`, dados)
  return participacaoResponseSchema.parse(data)
}

const removerProblema = async (id: number, problemaId: number): Promise<void> => {
  await api.delete(`/competicoes/${id}/problemas/${problemaId}`)
}

export const competicaoService = {
  listarAtivas,
  listarInativas,
  criar,
  atualizar,
  deletar,
  adicionarProblemas,
  removerProblema,
} as const
