import { useNavigate, useParams } from 'react-router-dom'
import { MessageSquare, Loader2, AlertCircle } from 'lucide-react'
import { useListarConversas } from '../mensagem.hooks'
import ConversaCard from '../components/ConversaCard'
import ChatUsuarioPage from './ChatUsuarioPage'

export default function MensagemHome() {
  const navigate = useNavigate()
  const { id } = useParams()

  const { data: conversas, isLoading, isError } = useListarConversas()

  return (
    <div className="h-full bg-spif-bg text-spif-text overflow-hidden">
      <div className="h-full flex">

        {/* ── Lista de Conversas ── */}
        <div
          className={`
            flex flex-col border-r border-spif-card-border bg-spif-bg shrink-0
            ${id
              ? 'hidden md:flex md:w-[320px] lg:w-[380px]'
              : 'flex w-full md:w-[320px] lg:w-[380px]'
            }
          `}
        >
          {/* Espaçador — empurra a lista para baixo em todos os tamanhos */}
          <div className="h-18 shrink-0" />

          <main className="flex-1 overflow-y-auto">
            {isLoading || !conversas ? (
              <div className="flex flex-col items-center justify-center h-full text-spif-primary animate-pulse gap-3">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Sincronizando...</span>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center text-red-400 gap-4">
                <AlertCircle className="w-10 h-10 opacity-50" />
                <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">
                  Falha na conexão<br />com o servidor
                </p>
              </div>
            ) : conversas.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-12 text-center opacity-40 gap-4">
                <div className="w-16 h-16 rounded-full bg-spif-card flex items-center justify-center">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] leading-relaxed">
                  Nenhuma conversa<br />iniciada ainda.
                </p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-spif-card-border/50">
                {conversas.map((conversa) => (
                  <ConversaCard
                    key={conversa.id}
                    conversa={conversa}
                    isActive={id === conversa.id.toString()}
                    onClick={() => navigate(`/minhas-conversas/${conversa.id}`)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>

        {/* ── Painel de Chat ── */}
        <div
          className={`
            flex-1 h-full bg-spif-bg overflow-hidden
            ${id ? 'flex' : 'hidden md:flex'}
          `}
        >
          {id ? (
            <ChatUsuarioPage />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center h-full opacity-30 select-none">
              <div className="relative">
                <MessageSquare className="w-24 h-24 text-spif-primary/20" />
                <div className="absolute inset-0 blur-3xl bg-spif-primary/10 rounded-full" />
              </div>
              <p className="mt-8 text-xs font-black uppercase tracking-[0.4em] text-spif-secondary">
                Selecione um chat para começar
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}