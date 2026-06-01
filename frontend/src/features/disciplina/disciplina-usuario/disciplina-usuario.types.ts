import { z } from 'zod'

export const matricularCursaSchema = z.object({
  usuarioId: z.number().int().positive(),
  dataFim: z.string().datetime({ offset: true }),
})

export type MatricularCursaRequest = z.infer<typeof matricularCursaSchema>

export const cursaResponseSchema = z.object({
  disciplinaId: z.number(),
  usuarioId: z.number(),
  dataInicio: z.string().datetime({ offset: true }).nullable().optional(),
  dataFim: z.string().datetime({ offset: true }).nullable().optional(),
  ativo: z.boolean(),
})

export type CursaResponse = z.infer<typeof cursaResponseSchema>