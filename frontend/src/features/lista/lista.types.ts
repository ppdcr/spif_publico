import { z } from 'zod';

// === Schemas de Resposta ===
export const ListaProblemasResponseSchema = z.object({
  id: z.number(),
  titulo: z.string(),
  descricao: z.string(),
  professorId: z.number(),
  dataCriacao: z.string().datetime({ offset: true }),
  porcentagemConclusao: z.number().nullable(),
  dataInicio: z.string().datetime({ offset: true }).optional().nullable(),
  dataFim: z.string().datetime({ offset: true }).optional().nullable(),
});

// === Schemas de Requisição ===
export const CriarListaProblemasRequestSchema = z.object({
  titulo: z.string().min(1, "O título é obrigatório"),
  descricao: z.string().min(1, "A descrição é obrigatória"),
});

export const AtualizarListaProblemasRequestSchema = z.object({
  titulo: z.string().optional(),
  descricao: z.string().optional(),
});

export const AdicionarProblemaAListaRequestSchema = z.object({
  problemaId: z.number().min(0),
});

// === Tipagem Inferida (TypeScript) ===
export type ListaProblemasResponse = z.infer<typeof ListaProblemasResponseSchema>;
export type CriarListaProblemasRequest = z.infer<typeof CriarListaProblemasRequestSchema>;
export type AtualizarListaProblemasRequest = z.infer<typeof AtualizarListaProblemasRequestSchema>;
export type AdicionarProblemaAListaRequest = z.infer<typeof AdicionarProblemaAListaRequestSchema>;