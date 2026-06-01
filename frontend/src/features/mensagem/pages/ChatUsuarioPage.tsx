// ============================================================================
// ChatUsuarioPage.tsx
// ============================================================================
// Mobile: exibe botão "← Voltar" no cabeçalho para retornar à lista.
// Desktop: botão oculto — a lista e o chat coexistem lado a lado.
// ============================================================================

import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useListarMensagensUsuario, useChatActions } from '../mensagem.hooks'
import { useUsuarioPorId } from '../../usuario/usuario.hooks'
import ChatHeader from '../components/ChatHeader'
import MessageList from '../components/MessageList'
import MessageInput from '../components/MessageInput'
import type { MensagemResponse } from '../mensagem.types'

export default function ChatUsuarioPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const destinatarioId = Number(id)

  const [respondendoMsg, setRespondendoMsg] = useState<MensagemResponse | null>(null)

  const { data: destinatario } = useUsuarioPorId(destinatarioId)
  const { data: mensagens, isLoading } = useListarMensagensUsuario(destinatarioId)

  const { enviarMensagemViaSocket, marcarComoLidaViaSocket } = useChatActions()

  const marcouAberturRef = useRef(false)

  // Reset ao trocar de conversa
  useEffect(() => {
    marcouAberturRef.current = false
  }, [destinatarioId])

  // Marca como lida ao abrir o chat (cobre mensagens pré-existentes não lidas)
  useEffect(() => {
    if (marcouAberturRef.current) return
    if (!destinatarioId || !mensagens?.length) return

    marcouAberturRef.current = true

    const temNaoLidas = mensagens.some(
      (m) => m.remetenteId === destinatarioId && !m.horarioLida
    )

    if (temNaoLidas) {
      marcarComoLidaViaSocket(destinatarioId)
    }
  }, [destinatarioId, mensagens, marcarComoLidaViaSocket])

  const handleEnviar = (texto: string) => {
    enviarMensagemViaSocket({
      destinatarioId,
      conteudo: texto,
      mensagemPaiId: respondendoMsg?.id,
    })
    setRespondendoMsg(null)
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden relative">

      {/* ── Cabeçalho com botão voltar (mobile) ── */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Botão voltar — visível apenas em mobile */}
        <button
          onClick={() => navigate('/minhas-conversas')}
          className="md:hidden flex items-center justify-center w-10 h-10 ml-2 rounded-xl text-spif-secondary hover:text-spif-text hover:bg-spif-card transition-all shrink-0"
          aria-label="Voltar para conversas"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* ChatHeader ocupa o restante da largura */}
        <div className="flex-1 min-w-0">
          <ChatHeader destinatario={destinatario} />
        </div>
      </div>

      {/* ── Mensagens ── */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <MessageList
          mensagens={mensagens}
          isLoading={isLoading}
          onResponder={setRespondendoMsg}
        />
      </div>

      {/* ── Input ── */}
      <MessageInput
        onEnviar={handleEnviar}
        mensagemResposta={respondendoMsg}
        onCancelarResposta={() => setRespondendoMsg(null)}
      />
    </div>
  )
}