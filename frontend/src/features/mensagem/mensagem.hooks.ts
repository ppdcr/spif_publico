import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { mensagemService } from './mensagem.service'
import {
  type ConversaResponse,
  type MandarMensagemProblemaRequest,
  type MandarMensagemUsuarioRequest,
  type MensagemResponse,
  MensagemResponseSchema,
} from './mensagem.types'
import { useAuth } from '../../contexts/AuthContext'
import { useWebSocket } from '../../contexts/WebSockerContext'

// ── Query keys ────────────────────────────────────────────────────────────────

export const mensagemKeys = {
  all: ['mensagens'] as const,
  problema: (problemaId: number) => [...mensagemKeys.all, 'problema', problemaId] as const,
  conversasPainel: () => [...mensagemKeys.all, 'conversas-painel'] as const,
  chatUsuario: (destinatarioId: number) => [...mensagemKeys.all, 'chat-usuario', destinatarioId] as const,
}

// ── Queries (REST) ────────────────────────────────────────────────────────────

export function useListarMensagensProblema(problemaId: number) {
  return useQuery({
    queryKey: mensagemKeys.problema(problemaId),
    queryFn: () => mensagemService.listarMensagensProblema(problemaId),
  })
}

export function useListarConversas() {
  return useQuery({
    queryKey: mensagemKeys.conversasPainel(),
    queryFn: () => mensagemService.listarConversas(),
  })
}

export function useListarMensagensUsuario(destinatarioId: number) {
  return useQuery({
    queryKey: mensagemKeys.chatUsuario(destinatarioId),
    queryFn: () => mensagemService.listarMensagensUsuario(destinatarioId),
    enabled: destinatarioId > 0,
  })
}

// ── Mutations (REST) ──────────────────────────────────────────────────────────

export function useEnviarMensagemProblema(problemaId: number) {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (request: MandarMensagemProblemaRequest) =>
      mensagemService.enviarMensagemProblema(problemaId, request),
    
    // Executado ANTES da mutation rodar no servidor
    onMutate: async (novaMensagem) => {
      // Cancela refetches de mensagens do problema para não sobrescrever nosso estado temporário
      await queryClient.cancelQueries({ queryKey: mensagemKeys.problema(problemaId) })

      // Pega o snapshot do cache atual
      const mensagensAnteriores = queryClient.getQueryData<MensagemResponse[]>(
        mensagemKeys.problema(problemaId)
      )

      // Cria um objeto temporário simulando a mensagem do usuário
      const mensagemOtimista: MensagemResponse = {
        id: Math.random(),
        remetenteId: Math.random(),
        conteudo: novaMensagem.conteudo,
        remetente: 'USER',
        role: 'PROBLEM',
        horarioEnviada: new Date().toISOString(),
      }

      // Atualiza o cache de forma otimista
      queryClient.setQueryData<MensagemResponse[]>(
        mensagemKeys.problema(problemaId),
        (old) => old ? [...old, mensagemOtimista] : [mensagemOtimista]
      )

      // Retorna o contexto com os dados antigos para caso dê erro podermos dar rollback
      return { mensagensAnteriores }
    },
    
    // Se der erro, desfaz a alteração otimista
    onError: (err, novaMensagem, context) => {
      if (context?.mensagensAnteriores) {
        queryClient.setQueryData(
          mensagemKeys.problema(problemaId),
          context.mensagensAnteriores
        )
      }
    },
    
    // Sempre invalida ao final (sucesso ou erro) para garantir sincronia com o banco
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: mensagemKeys.problema(problemaId) })
    },
  })
}

// ── Hook de Ações (sem subscriptions) ────────────────────────────────────────

export function useChatActions() {
  const client = useWebSocket()
  const queryClient = useQueryClient()

  const marcarComoLidaViaSocket = (contatoId: number) => {
    if (client?.connected) {
      client.publish({
        destination: '/app/chat.ler',
        body: JSON.stringify(contatoId),
      })

      queryClient.setQueryData<ConversaResponse[]>(
        mensagemKeys.conversasPainel(),
        (old) => old?.map((c) => c.id === contatoId ? { ...c, qtdNaoLidas: 0 } : c)
      )

      queryClient.setQueryData<MensagemResponse[]>(
        mensagemKeys.chatUsuario(contatoId),
        (old) => old?.map((m) =>
          m.remetenteId === contatoId && !m.horarioLida
            ? { ...m, horarioLida: new Date().toISOString() }
            : m
        )
      )
    }
  }

  const enviarMensagemViaSocket = (request: MandarMensagemUsuarioRequest) => {
    if (client?.connected) {
      client.publish({
        destination: '/app/chat.enviar',
        body: JSON.stringify(request),
      })
    }
  }

  const isConnected = client?.connected ?? false

  return { enviarMensagemViaSocket, marcarComoLidaViaSocket, isConnected }
}

// ── Hook de Subscriptions WebSocket ──────────────────────────────────────────
/**
 * Deve ser chamado UMA ÚNICA VEZ, em PrivateRouteContent (Routes.tsx).
 *
 * CORREÇÃO 1: O useEffect agora depende de `client?.connected` em vez de
 * apenas `client`. O objeto Client é o mesmo antes e depois do onConnect —
 * o que muda é a propriedade `connected`. Usando um efeito separado para
 * observar a conexão, garantimos que as subscriptions são criadas assim que
 * o WebSocket estiver pronto, independente de quando o componente montou.
 *
 * CORREÇÃO 2: Conversas novas (nunca vistas antes) são inseridas no cache
 * do painel em vez de apenas atualizadas. Isso resolve o caso onde o usuário
 * inicia uma conversa com alguém novo e ela não aparece na lista.
 */
export function useChatWebSocket(activeChatId: number | null = null) {
  const client = useWebSocket()
  const queryClient = useQueryClient()
  const { usuario } = useAuth()

  const activeChatIdRef = useRef<number | null>(activeChatId)
  activeChatIdRef.current = activeChatId

  // ── CORREÇÃO 1: observar connected, não apenas client ─────────────────────
  // O WebSocketContext retorna o mesmo objeto Client antes e após o onConnect.
  // React compara por referência — se o objeto não muda, o useEffect não
  // re-executa. Ao incluir client?.connected na dependência, forçamos a
  // re-execução no momento exato em que a conexão fica disponível.
  const isConnected = client?.connected ?? false

  useEffect(() => {
    if (!client || !isConnected || !usuario) return

    const atualizarCacheMensagens = (chatId: number, novaMsg: MensagemResponse) => {
      // Atualiza mensagens do chat
      queryClient.setQueryData<MensagemResponse[]>(
        mensagemKeys.chatUsuario(chatId),
        (old) => {
          if (!old) return [novaMsg]
          if (old.some((m) => m.id === novaMsg.id)) return old
          return [...old, novaMsg]
        }
      )

      // ── CORREÇÃO 2: inserir conversa nova se ainda não existir no cache ───
      queryClient.setQueryData<ConversaResponse[]>(
        mensagemKeys.conversasPainel(),
        (old) => {
          const souEuOAutor = novaMsg.remetenteId === usuario.id
          const estaNoChatAgora = activeChatIdRef.current === chatId

          // Se o painel ainda não foi carregado, invalida para buscar do servidor
          if (!old) {
            queryClient.invalidateQueries({ queryKey: mensagemKeys.conversasPainel() })
            return old
          }

          const jaExiste = old.some((c) => c.id === chatId)

          if (!jaExiste) {
            // Conversa nova — busca do servidor para obter dados completos
            // (nickname, avatar, etc.) e insere na lista
            queryClient.invalidateQueries({ queryKey: mensagemKeys.conversasPainel() })
            return old
          }

          // Conversa existente — atualiza otimisticamente
          const atualizadas = old.map((conversa) => {
            if (conversa.id !== chatId) return conversa
            return {
              ...conversa,
              ultimaMensagem: novaMsg.conteudo,
              horarioEnviada: novaMsg.horarioEnviada,
              horarioLida: novaMsg.horarioLida ?? null,
              qtdNaoLidas:
                !souEuOAutor && !estaNoChatAgora
                  ? conversa.qtdNaoLidas + 1
                  : conversa.qtdNaoLidas,
              enviadaPorVoce: souEuOAutor,
            }
          })

          return [...atualizadas].sort(
            (a, b) =>
              new Date(b.horarioEnviada).getTime() -
              new Date(a.horarioEnviada).getTime()
          )
        }
      )
    }

    const subMensagens = client.subscribe('/user/queue/mensagens', (message) => {
      const novaMensagem = MensagemResponseSchema.parse(JSON.parse(message.body))
      const chatId =
        novaMensagem.remetenteId === usuario.id
          ? (novaMensagem.destinatarioId as number)
          : (novaMensagem.remetenteId as number)

      atualizarCacheMensagens(chatId, novaMensagem)

      const souEuOAutor = novaMensagem.remetenteId === usuario.id
      const estaNoChatAgora = activeChatIdRef.current === chatId

      if (!souEuOAutor && estaNoChatAgora) {
        client.publish({
          destination: '/app/chat.ler',
          body: JSON.stringify(chatId),
        })
        queryClient.setQueryData<MensagemResponse[]>(
          mensagemKeys.chatUsuario(chatId),
          (old) => old?.map((m) =>
            m.remetenteId === chatId && !m.horarioLida
              ? { ...m, horarioLida: new Date().toISOString() }
              : m
          )
        )
      }
    })

    const subConfirmacoes = client.subscribe('/user/queue/confirmacoes', (message) => {
      const minhaMensagem = MensagemResponseSchema.parse(JSON.parse(message.body))
      if (minhaMensagem.destinatarioId) {
        atualizarCacheMensagens(minhaMensagem.destinatarioId, minhaMensagem)
      }
    })

    const subLeitura = client.subscribe('/user/queue/notificacoes-leitura', (message) => {
      const data = JSON.parse(message.body) as { lidoPor: number }

      queryClient.setQueryData<MensagemResponse[]>(
        mensagemKeys.chatUsuario(data.lidoPor),
        (old) =>
          old?.map((m) =>
            m.remetenteId === usuario.id && !m.horarioLida
              ? { ...m, horarioLida: new Date().toISOString() }
              : m
          )
      )

      queryClient.setQueryData<ConversaResponse[]>(
        mensagemKeys.conversasPainel(),
        (old) =>
          old?.map((c) =>
            c.id === data.lidoPor
              ? { ...c, qtdNaoLidas: 0, horarioLida: new Date().toISOString() }
              : c
          )
      )
    })

    return () => {
      subMensagens.unsubscribe()
      subConfirmacoes.unsubscribe()
      subLeitura.unsubscribe()
    }
    // isConnected é derivado de client?.connected — muda de false para true
    // quando o WebSocket conecta, garantindo que as subscriptions sejam criadas
    // mesmo que o componente tenha montado antes da conexão estar pronta.
  }, [client, isConnected, queryClient, usuario])

  return useChatActions()
}