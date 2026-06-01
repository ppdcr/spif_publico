import { z } from 'zod'

// ── Requests ─────────────────────────────────────────────────────────────────

export const criarDisciplinaSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatório'),
  ano: z.number().int().positive('O ano deve ser positivo'),
})

export type CriarDisciplinaRequest = z.infer<typeof criarDisciplinaSchema>

export const atualizarDisciplinaSchema = z.object({
  nome: z.string().min(1, 'Nome não pode ser vazio').optional(),
  ano: z.number().int().positive('O ano deve ser positivo').optional(),
})

export type AtualizarDisciplinaRequest = z.infer<typeof atualizarDisciplinaSchema>

// ── Responses ─────────────────────────────────────────────────────────────────

export const disciplinaResponseSchema = z.object({
  id: z.number(),
  nome: z.string(),
  ano: z.number().int(),
  ministra: z.boolean().nullable().optional()
})

export type DisciplinaResponse = z.infer<typeof disciplinaResponseSchema>