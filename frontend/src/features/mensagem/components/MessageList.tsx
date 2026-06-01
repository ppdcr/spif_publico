import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import type { MensagemResponse } from '../mensagem.types'
import MessageBubble from './MessageBubble'
import { Loader2 } from 'lucide-react'

interface MessageListProps {
  mensagens: MensagemResponse[] | undefined
  isLoading: boolean
  onResponder: (msg: MensagemResponse) => void
}

export default function MessageList({ mensagens, isLoading, onResponder }: MessageListProps) {
  const { id } = useParams()
  const { usuario } = useAuth()
  const bottomRef = useRef<HTMLDivElement>(null)
  const separatorRef = useRef<HTMLDivElement>(null)

  // ID da primeira mensagem não lida no momento em que o chat foi aberto.
  // Calculado UMA VEZ por abertura de chat e nunca reatualizado.
  const [primeiraNaoLidaId, setPrimeiraNaoLidaId] = useState<number | null>(null)

  // Ref para garantir que o cálculo inicial só ocorra uma vez por chat aberto.
  const calculadoRef = useRef(false)

  // Reset completo ao trocar de conversa
  useEffect(() => {
    setPrimeiraNaoLidaId(null)
    calculadoRef.current = false
  }, [id])

  // Calcula a posição do divisor na PRIMEIRA carga das mensagens.
  // Só executa uma vez por abertura de chat (graças ao calculadoRef).
  // FIX "lugar errado": usa mensagens com horarioLida já atualizado no cache
  // (após marcarComoLidaViaSocket atualizar o cache individual),
  // então ao re-abrir um chat que já foi lido, não encontra nenhuma mensagem
  // não lida e o divisor não reaparece.
  useEffect(() => {
    if (!mensagens || mensagens.length === 0) return
    if (calculadoRef.current) return // Já calculou — não recalcula ao receber novas mensagens

    calculadoRef.current = true

    // Se a última mensagem foi enviada pelo usuário atual,
    // não há nada "não lido" para mostrar
    const ultima = mensagens[mensagens.length - 1]
    if (ultima.remetenteId === usuario?.id) {
      setPrimeiraNaoLidaId(null)
      return
    }

    // Encontra a primeira mensagem recebida sem leitura confirmada
    const primeiraNaoLida = mensagens.find(
      (m) => m.remetenteId !== usuario?.id && !m.horarioLida
    )
    setPrimeiraNaoLidaId(primeiraNaoLida?.id ?? null)
  }, [mensagens, usuario?.id])

  // Remove o divisor quando o usuário envia uma mensagem
  // (sinalizando que ele já viu tudo que estava antes)
  useEffect(() => {
    if (!primeiraNaoLidaId || !mensagens || mensagens.length === 0) return
    const ultima = mensagens[mensagens.length - 1]
    if (ultima.remetenteId === usuario?.id) {
      setPrimeiraNaoLidaId(null)
    }
  }, [mensagens, primeiraNaoLidaId, usuario?.id])

  // Scroll: vai ao divisor na carga inicial se houver não lidas,
  // caso contrário vai ao final. Novas mensagens scrollam suavemente.
  const tamanhoCarregadoRef = useRef(0)
  useEffect(() => {
    if (!mensagens || mensagens.length === 0) return

    const ehCargaInicial = tamanhoCarregadoRef.current === 0
    tamanhoCarregadoRef.current = mensagens.length

    if (ehCargaInicial && primeiraNaoLidaId && separatorRef.current) {
      separatorRef.current.scrollIntoView({ behavior: 'auto', block: 'start' })
    } else {
      bottomRef.current?.scrollIntoView({
        behavior: ehCargaInicial ? 'auto' : 'smooth',
      })
    }
  }, [mensagens?.length, primeiraNaoLidaId])

  // Reset do scroll ref ao trocar de chat
  useEffect(() => {
    tamanhoCarregadoRef.current = 0
  }, [id])

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-spif-primary animate-pulse gap-3">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Sincronizando Mensagens...</span>
      </div>
    )
  }

  if (!mensagens || mensagens.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-30 gap-4">
         <div className="w-16 h-16 rounded-full bg-spif-card flex items-center justify-center">
            <span className="text-2xl">💬</span>
         </div>
         <p className="text-xs font-bold uppercase tracking-[0.2em] leading-relaxed">
            Inicie a conversa mandando<br />a primeira mensagem.
         </p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto pt-6 pb-2 flex flex-col custom-scrollbar">
      {mensagens.map((msg) => (
        <div key={msg.id} className="flex flex-col">
          {msg.id === primeiraNaoLidaId && (
            <div
              ref={separatorRef}
              className="flex items-center gap-4 my-10 px-8 scroll-mt-24 animate-in fade-in zoom-in duration-700"
            >
              <div className="h-px flex-1 bg-spif-primary/20" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-spif-primary bg-spif-primary/10 px-6 py-2 rounded-xl border border-spif-primary/20 shadow-sm">
                Novas Mensagens
              </span>
              <div className="h-px flex-1 bg-spif-primary/20" />
            </div>
          )}
          <MessageBubble
            mensagem={msg}
            enviadaPorMim={msg.remetenteId === usuario?.id}
            onResponder={onResponder}
          />
        </div>
      ))}
      <div ref={bottomRef} className="h-6 shrink-0" />
    </div>
  )
}