import { z } from 'zod'

// ── Enums ────────────────────────────────────────────────────────────────────

export const roleSchema = z.enum(['ROLE_PROFESSOR', 'ROLE_ALUNO'])
export type Role = z.infer<typeof roleSchema>

// ── Requests ─────────────────────────────────────────────────────────────────

export const criarUsuarioSchema = z.object({
  prontuario: z.string().min(1, 'Prontuário obrigatório'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  nickname: z.string().min(1, 'Nickname obrigatório'),
  email: z.email('E-mail inválido'),
  role: roleSchema
})

export type CriarUsuarioRequest = z.infer<typeof criarUsuarioSchema>

export const editarPerfilSchema = z.object({
  nickname: z.string().optional(),
  email: z.email().optional(),
  senha: z.string().optional(),
})

export type EditarPerfilRequest = z.infer<typeof editarPerfilSchema>

export const authRequestSchema = z.object({
  prontuario: z.string().min(1, 'Prontuário obrigatório'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export type AuthRequest = z.infer<typeof authRequestSchema>

// ── Responses ────────────────────────────────────────────────────────────────

export const authResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  tokenType: z.string().default('Bearer'),
})

export type AuthResponse = z.infer<typeof authResponseSchema>

export const usuarioResponseSchema = z.object({
  id: z.number(),
  prontuario: z.string(),
  nickname: z.string(),
  email: z.email(),
  role: roleSchema,
  dataCriacao: z.iso.datetime().optional(),
  pontos: z.number().nullable().optional(),
  elogios: z.number().nullable().optional(),
})

export type UsuarioResponse = z.infer<typeof usuarioResponseSchema>

export const usuarioResumoResponseSchema = z.object({
  id: z.number(),
  prontuario: z.string(),
  nickname: z.string(),
  role: roleSchema
})

export type UsuarioResumoResponse = z.infer<typeof usuarioResumoResponseSchema>

export const usuarioRankingResponseSchema = z.object({
  rankingProfessores: z.array(usuarioResponseSchema).optional().default([]),
  rankingAlunos: z.array(usuarioResponseSchema).optional().default([])
})

export type UsuarioRankingResponse = z.infer<typeof usuarioRankingResponseSchema>

// ── Payload do JWT (campos esperados no token decodificado) ──────────────────

export const jwtPayloadSchema = z.object({
  sub: z.string(),
  prontuario: z.string(),
  nickname: z.string(),
  email: z.email(),
  role: roleSchema,
  iat: z.number(),
  exp: z.number(),
})

export type JwtPayload = z.infer<typeof jwtPayloadSchema>