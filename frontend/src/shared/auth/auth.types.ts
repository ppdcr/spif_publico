export type Role = 'ROLE_ALUNO' | 'ROLE_PROFESSOR'

export interface Usuario {
  id: string
  prontuario: string
  role: Role
}

export interface Tokens {
  accessToken: string
  refreshToken: string
}