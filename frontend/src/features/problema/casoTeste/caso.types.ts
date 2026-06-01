import { z } from 'zod'

// ── Requests ──────────────────────────────────────────────────────────────────

export const criarCasoTesteSchema = z.object({
  entrada: z.string().min(1, 'Entrada obrigatória'),
  saida: z.string().min(1, 'Saída obrigatória'),
  visivel: z.boolean(),
  ordem: z.number().int().positive('Ordem deve ser positiva'),
})

export type CriarCasoTesteRequest = z.infer<typeof criarCasoTesteSchema>

export const atualizarCasoTesteSchema = z.object({
  entrada: z.string().min(1).optional(),
  saida: z.string().min(1).optional(),
  visivel: z.boolean().optional(),
  ordem: z.number().int().positive().optional(),
})

export type AtualizarCasoTesteRequest = z.infer<typeof atualizarCasoTesteSchema>

// ── Response ──────────────────────────────────────────────────────────────────

export const casoTesteResponseSchema = z.object({
  id: z.number(),
  entrada: z.string(),
  saida: z.string(),
  ordem: z.number().int(),
  visivel: z.boolean(),
})

export type CasoTesteResponse = z.infer<typeof casoTesteResponseSchema>