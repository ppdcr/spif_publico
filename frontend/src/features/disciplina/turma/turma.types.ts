import { z } from 'zod';

export const TurmaResponseSchema = z.object({
  id: z.number(),
  nome: z.string(),
  codigoConvite: z.string(),
  porcentagemConclusao: z.number().nullable().optional(),
});

export type TurmaResponse = z.infer<typeof TurmaResponseSchema>;

export const atualizarTurmaSchema = z.object({
  nome: z.string().min(1, 'Nome não pode ser vazio').optional()
})

export type AtualizarTurmaRequest = z.infer<typeof atualizarTurmaSchema>

export const criarTurmaSchema = z.object({
  nome: z.string().min(1, 'Nome obrigatório')
})

export type CriarTurmaRequest = z.infer<typeof criarTurmaSchema>
