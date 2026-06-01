import { z } from 'zod';

export const IngressaResponseSchema = z.object({
  turmaId: z.number(),
  usuarioId: z.number(),
  dataIngresso: z.string().nullable(),
  ativo: z.boolean(),
});

export type IngressaResponse = z.infer<typeof IngressaResponseSchema>;

export const MatricularUsuarioTurmaRequestSchema = z.object({
  usuarioId: z.number()
});

export type MatricularTurmaRequest = z.infer<typeof MatricularUsuarioTurmaRequestSchema>