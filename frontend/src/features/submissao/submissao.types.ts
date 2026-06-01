import { z } from 'zod'

// ─── Enums ────────────────────────────────────────────────────────────────────

export const LinguagemEnum = z.enum(['PYTHON', 'CPP', 'JAVA', 'C', 'JAVASCRIPT'])
export type Linguagem = z.infer<typeof LinguagemEnum>

export const StatusSubmissaoEnum = z.enum([
    'PENDENTE',
    'PROCESSANDO',
    'ACEITO',
    'REJEITADO',
    'COMPILATION_ERROR',
])
export type StatusSubmissao = z.infer<typeof StatusSubmissaoEnum>

export const ErroResultadoEnum = z.enum([
    'WRONG_ANSWER',
    'TIME_LIMIT_EXCEEDED',
    'MEMORY_LIMIT_EXCEEDED',
    'RUNTIME_ERROR',
])
export type ErroResultado = z.infer<typeof ErroResultadoEnum>

// ─── Schemas de Resposta ──────────────────────────────────────────────────────

export const ResultadoCasoTesteSchema = z.object({
    casoTesteId: z.number(),
    saida: z.string().nullable(),
    erro: ErroResultadoEnum.nullable(),
    tempoGasto: z.number().nullable(),
})
export type ResultadoCasoTeste = z.infer<typeof ResultadoCasoTesteSchema>

export const SubmissaoResumoSchema = z.object({
    id: z.number(),
    linguagem: LinguagemEnum,
    status: StatusSubmissaoEnum,
    horaSubmissao: z.string(),
    tempoExecucao: z.number(),
})
export type SubmissaoResumo = z.infer<typeof SubmissaoResumoSchema>

export const SubmissaoDetalheSchema = SubmissaoResumoSchema.extend({
    codigo: z.string(),
    resultados: z.array(ResultadoCasoTesteSchema).optional().nullable(),
})
export type SubmissaoDetalhe = z.infer<typeof SubmissaoDetalheSchema>

// ─── Schemas de Requisição ────────────────────────────────────────────────────

export const CriarSubmissaoSchema = z.object({
    linguagem: LinguagemEnum,
    codigo: z.string().min(1, 'O código não pode estar vazio.'),
})
export type CriarSubmissaoPayload = z.infer<typeof CriarSubmissaoSchema>

// ─── Payloads WebSocket ───────────────────────────────────────────────────────

export type WsSubmissaoSucesso = SubmissaoDetalhe

export type WsSubmissaoErroCompilacao = {
    submissao: SubmissaoDetalhe
    erro: string
}

export type WsPayload = WsSubmissaoSucesso | WsSubmissaoErroCompilacao

export function isErroCompilacao(payload: WsPayload): payload is WsSubmissaoErroCompilacao {
    return 'erro' in payload && 'submissao' in payload
}

// ─── Estado de Progresso em Tempo Real ───────────────────────────────────────

export type ProgressoSubmissao = {
    status: StatusSubmissao
    resultados: ResultadoCasoTeste[]
    erroCompilacao: string | null
    submissaoId: number | null
}