import { z } from 'zod'

// ── Requests ─────────────────────────────────────────────────────────────────

export const criarNivelSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatório'),
  ordem: z.number().int().positive('Ordem deve ser positiva'),
  descricao: z.string().min(1, 'Descrição obrigatória'),
})

export type CriarNivelRequest = z.infer<typeof criarNivelSchema>

export const atualizarNivelSchema = z.object({
  nome: z.string().min(1, 'Nome não pode ser vazio').optional(),
  ordem: z.number().int().positive('Ordem deve ser positiva').optional(),
  descricao: z.string().min(1, 'Descrição não pode ser vazia').optional(),
})

export type AtualizarNivelRequest = z.infer<typeof atualizarNivelSchema>

export const adicionarProblemasAoNivelSchema = z.object({
  problemaIds: z.array(z.number()).min(1, 'Selecione ao menos um problema'),
})

export type AdicionarProblemasAoNivelRequest = z.infer<typeof adicionarProblemasAoNivelSchema>

// ── Responses ─────────────────────────────────────────────────────────────────

export const nivelResponseSchema = z.object({
  id: z.number(),
  nome: z.string(),
  ordem: z.number().int(),
  descricao: z.string(),
  porcentagemConclusao: z.number().nullable(),
})

export type NivelResponse = z.infer<typeof nivelResponseSchema>

export const contemResponseSchema = z.object({
  problemaIds: z.array(z.number()),
})

export type ContemResponse = z.infer<typeof contemResponseSchema>
