import { z } from 'zod'

// ── Requests ─────────────────────────────────────────────────────────────────

export const criarPercursoSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatório'),
  descricao: z.string().min(1, 'Descrição obrigatória'),
})

export type CriarPercursoRequest = z.infer<typeof criarPercursoSchema>

export const atualizarPercursoSchema = z.object({
  nome: z.string().min(1, 'Nome não pode ser vazio').optional(),
  descricao: z.string().min(1, 'Descrição não pode ser vazia').optional(),
})

export type AtualizarPercursoRequest = z.infer<typeof atualizarPercursoSchema>

// ── Responses ─────────────────────────────────────────────────────────────────

export const percursoResponseSchema = z.object({
  id: z.number(),
  nome: z.string(),
  descricao: z.string(),
  porcentagemConclusao: z.number().nullable(),
})

export type PercursoResponse = z.infer<typeof percursoResponseSchema>
