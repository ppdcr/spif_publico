import { z } from 'zod'
import { casoTesteResponseSchema } from './casoTeste/caso.types'

// ── Requests ─────────────────────────────────────────────────────────────────

export const criarProblemaSchema = z.object({
  titulo: z.string().min(1, 'Título obrigatório'),
  enunciado: z.string().min(1, 'Enunciado obrigatório'),
  entrada: z.string().min(1, 'Descrição de entrada obrigatória'),
  saida: z.string().min(1, 'Descrição de saída obrigatória'),
  dificuldade: z.number().int().positive('Dificuldade deve ser positiva').max(10, 'Dificuldade deve ser no máximo 10'),
  tempoLimite: z.number().positive('Tempo limite deve ser positivo'),
  memoriaLimiteMb: z.number().int().default(256),
  assuntos: z.array(z.string()).min(1, 'Pelo menos um assunto obrigatório'),
})

export type CriarProblemaRequest = z.infer<typeof criarProblemaSchema>

export const atualizarProblemaSchema = z.object({
  titulo: z.string().min(1).optional(),
  enunciado: z.string().min(1).optional(),
  entrada: z.string().min(1).optional(),
  saida: z.string().min(1).optional(),
  dificuldade: z.number().int().positive().optional(),
  tempoLimite: z.number().positive().optional(),
  memoriaLimiteMb: z.number().int().optional(),
  visivel: z.boolean().optional(),
  assuntos: z.array(z.string()).optional(),
})

export type AtualizarProblemaRequest = z.infer<typeof atualizarProblemaSchema>

export const problemaFiltroSchema = z.object({
  titulo: z.string().optional(),
  dificuldade: z.number().int().optional(),
  assuntos: z.array(z.string()).optional(),
  nivelId: z.number().optional(),
  competicaoId: z.number().optional(),
  listaId: z.number().optional(),
  pagina: z.number().int().min(0).default(0),
  tamanho: z.number().int().min(1).default(20),
})

export type ProblemaFiltroRequest = z.infer<typeof problemaFiltroSchema>

// ── Responses ─────────────────────────────────────────────────────────────────

export const problemaResumoResponseSchema = z.object({
  id: z.number(),
  titulo: z.string(),
  dificuldade: z.number().int(),
  acertou: z.boolean().nullable(),
  visivel: z.boolean(),
  assuntos: z.array(z.string()),
})

export type ProblemaResumoResponse = z.infer<typeof problemaResumoResponseSchema>

export const problemaResponseSchema = z.object({
  id: z.number(),
  titulo: z.string(),
  enunciado: z.string(),
  entrada: z.string(),
  saida: z.string(),
  dificuldade: z.number().int(),
  tempoLimite: z.number(),
  memoriaLimiteMb: z.number().int(),
  professorId: z.number(),
  dataCriacao: z.string().datetime({ offset: true }).optional(),
  visivel: z.boolean().optional(),
  assuntos: z.array(z.string()),
  casosVisiveis: z.array(casoTesteResponseSchema).nullable().default([]),
})

export type ProblemaResponse = z.infer<typeof problemaResponseSchema>

// ── Paginação ─────────────────────────────────────────────────────────────────

export const paginaProblemaSchema = z.object({
  content: z.array(problemaResumoResponseSchema),
  totalElements: z.number(),
  totalPages: z.number(),
  number: z.number(),   // página atual (0-indexed)
  size: z.number(),
  first: z.boolean(),
  last: z.boolean(),
})

export type PaginaProblema = z.infer<typeof paginaProblemaSchema>