import { z } from 'zod';

// === Schemas de Resposta ===
export const TurmaListaResponseSchema = z.object({
  listaId: z.number(),
  turmaId: z.number(),
  dataInicio: z.string(), // ISO String
  dataFim: z.string().nullable(),
  ativo: z.boolean(),
});

// === Schemas de Requisição ===
export const AdicionarListaATurmaRequestSchema = z.object({
  listaId: z.number().min(0),
  dataInicio: z.string().min(1, "Data de início é obrigatória"),
  dataFim: z.string().optional().nullable(),
});

export const AtualizarListaTurmaRequestSchema = z.object({
  dataInicio: z.string().optional(),
  dataFim: z.string().optional().nullable(),
  ativo: z.boolean().optional(),
});

// === Tipagem Inferida ===
export type TurmaListaResponse = z.infer<typeof TurmaListaResponseSchema>;
export type AdicionarListaATurmaRequest = z.infer<typeof AdicionarListaATurmaRequestSchema>;
export type AtualizarListaTurmaRequest = z.infer<typeof AtualizarListaTurmaRequestSchema>;