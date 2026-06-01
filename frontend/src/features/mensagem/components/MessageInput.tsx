import { X, Reply as ReplyIcon, Send } from 'lucide-react'
import { useState } from 'react'
import type { MensagemResponse } from '../mensagem.types'

interface MessageInputProps {
  onEnviar: (texto: string) => void
  mensagemResposta: MensagemResponse | null
  onCancelarResposta: () => void
}

export default function MessageInput({ onEnviar, mensagemResposta, onCancelarResposta }: MessageInputProps) {
  const [texto, setTexto] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!texto.trim()) return
    onEnviar(texto.trim())
    setTexto('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 768) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <footer className="p-6 pt-2 flex flex-col bg-spif-bg">
      {/* Preview da Resposta */}
      {mensagemResposta && (
        <div className="flex items-center gap-3 bg-spif-card border-x border-t border-spif-card-border p-4 rounded-t-2xl animate-in slide-in-from-bottom-2 duration-300">
          <ReplyIcon size={16} className="text-spif-primary opacity-70" />
          <div className="flex-1 border-l-4 border-spif-primary pl-4 overflow-hidden">
            <span className="block text-[10px] font-black uppercase text-spif-primary tracking-[0.2em] mb-1">Respondendo</span>
            <p className="text-xs text-spif-secondary truncate font-medium">{mensagemResposta.conteudo}</p>
          </div>
          <button 
            onClick={onCancelarResposta} 
            className="p-2 rounded-xl hover:bg-spif-bg text-spif-secondary hover:text-red-400 transition-all active:scale-95"
          >
            <X size={18} />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1 relative group">
            <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Mande uma mensagem..."
            className={`w-full bg-spif-card border border-spif-card-border focus:border-spif-primary/50 text-spif-text outline-none p-4 rounded-2xl max-h-[150px] resize-none text-sm transition-all shadow-inner shadow-black/5 placeholder:text-spif-secondary/50
                ${mensagemResposta ? 'rounded-t-none border-t-transparent' : ''}`}
            rows={1}
            />
        </div>

        <button 
          type="submit" 
          disabled={!texto.trim()} 
          className="flex items-center justify-center h-[54px] w-[54px] rounded-2xl bg-spif-primary text-spif-bg shadow-lg shadow-spif-primary/20 hover:bg-spif-primary-hover disabled:bg-spif-card disabled:text-spif-secondary disabled:shadow-none disabled:border-spif-card-border disabled:opacity-50 transition-all active:scale-95"
        >
          <Send size={20} className={texto.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} />
        </button>
      </form>
    </footer>
  )
}