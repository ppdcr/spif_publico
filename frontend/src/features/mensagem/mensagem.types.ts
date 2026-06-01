import { z } from 'zod';

// === Enums e Sub-tipos ===
export const MensagemRoleSchema = z.enum(['USER', 'PROBLEM']);
export const RemetenteResumoSchema = z.enum(['USER', 'MODEL'])

// === Schemas de Resposta ===
export const MensagemResponseSchema = z.object({
  id: z.number(),
  conteudo: z.string(),
  horarioEnviada: z.iso.datetime({ offset: true }),
  remetenteId: z.number(),
  role: MensagemRoleSchema,

  destinatarioId: z.number().nullish(),
  mensagemPaiId: z.number().nullish(),
  conteudoMensagemPai: z.string().nullish(),
  horarioLida: z.iso.datetime({ offset: true }).nullish(),

  problemaId: z.number().nullish(),
  remetente: RemetenteResumoSchema.optional(),
})

export const ConversaResponseSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  ultimaMensagem: z.string(),
  horarioEnviada: z.iso.datetime({ offset: true }),
  horarioLida: z.iso.datetime({ offset: true }).nullable(),
  enviadaPorVoce: z.boolean(),
  qtdNaoLidas: z.number(),
});

// === Schemas de Requisição ===
export const MandarMensagemProblemaRequestSchema = z.object({
  conteudo: z.string().min(1, "A mensagem não pode estar vazia"),
  codigo: z.string().optional(),
});

export const MandarMensagemUsuarioRequestSchema = z.object({
  destinatarioId: z.number(),
  conteudo: z.string().min(1, "A mensagem não pode estar vazia"),
  mensagemPaiId: z.number().optional(),
});

// === Tipagem Inferida (TypeScript) ===
export type MensagemRole = z.infer<typeof MensagemRoleSchema>;
export type MensagemResponse = z.infer<typeof MensagemResponseSchema>;
export type ConversaResponse = z.infer<typeof ConversaResponseSchema>;
export type MandarMensagemProblemaRequest = z.infer<typeof MandarMensagemProblemaRequestSchema>;
export type MandarMensagemUsuarioRequest = z.infer<typeof MandarMensagemUsuarioRequestSchema>;