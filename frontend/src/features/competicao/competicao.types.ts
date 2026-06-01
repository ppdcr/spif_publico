import { z } from 'zod'

// ── Requests ─────────────────────────────────────────────────────────────────

export const criarCompeticaoSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatório'),
  descricao: z.string().min(1, 'Descrição obrigatória'),
  dataInicio: z.string().min(1, 'Data de início obrigatória'),
  dataFim: z.string().nullable().optional()
})

export type CriarCompeticaoRequest = z.infer<typeof criarCompeticaoSchema>

export const atualizarCompeticaoSchema = z.object({
  nome: z.string().min(1, 'Nome não pode ser vazio').optional(),
  descricao: z.string().min(1, 'Descrição não pode ser vazia').optional(),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
  ativa: z.boolean().optional(),
})

export type AtualizarCompeticaoRequest = z.infer<typeof atualizarCompeticaoSchema>

export const adicionarProblemaEmCompeticaoSchema = z.object({
  problemaIds: z.array(z.number()).min(1, 'Selecione ao menos um problema'),
})

export type AdicionarProblemaEmCompeticaoRequest = z.infer<typeof adicionarProblemaEmCompeticaoSchema>

// ── Responses ─────────────────────────────────────────────────────────────────

export const competicaoResponseSchema = z.object({
  id: z.number(),
  nome: z.string(),
  descricao: z.string(),
  dataInicio: z.string(),
  dataFim: z.string().nullable().optional(),
  ativa: z.boolean(),
  porcentagemConclusao: z.number().nullable().optional(),
})

export type CompeticaoResponse = z.infer<typeof competicaoResponseSchema>

export const participacaoResponseSchema = z.object({
  problemaIds: z.array(z.number()),
})

export type ParticipacaoResponse = z.infer<typeof participacaoResponseSchema>
