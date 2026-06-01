import { Check, CheckCheck, CornerUpLeft } from "lucide-react"
import type { MensagemResponse } from "../mensagem.types"
import { format } from "date-fns"

interface MessageBubbleProps {
  mensagem: MensagemResponse
  enviadaPorMim: boolean
  onResponder: (msg: MensagemResponse) => void
}

export default function MessageBubble({ mensagem, enviadaPorMim, onResponder }: MessageBubbleProps) {
  const handleScrollToPai = () => {
    if (!mensagem.mensagemPaiId) return
    const elementoPai = document.getElementById(`msg-${mensagem.mensagemPaiId}`)
    
    if (elementoPai) {
      elementoPai.scrollIntoView({ behavior: 'smooth', block: 'center' })
      const bubble = elementoPai.querySelector('.bubble-content')
      if (bubble) {
        bubble.classList.add('ring-2', 'ring-spif-primary', 'scale-[1.02]')
        setTimeout(() => {
          bubble.classList.remove('ring-2', 'ring-spif-primary', 'scale-[1.02]')
        }, 1000)
      }
    }
  }

  return (
    <div id={`msg-${mensagem.id}`} className={`group flex w-full ${enviadaPorMim ? 'justify-end' : 'justify-start'} mb-2 px-6`}>
      <div className="relative max-w-[85%] md:max-w-[70%] lg:max-w-[60%] flex items-center">
        
        {/* BOTÃO RESPONDER */}
        <button 
          onClick={() => onResponder(mensagem)}
          className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 hover:bg-spif-card rounded-xl text-spif-secondary hover:text-spif-primary
            ${enviadaPorMim ? '-left-12' : '-right-12'}`}
        >
          <CornerUpLeft size={18} />
        </button>

        <div className={`bubble-content relative px-4 py-3 shadow-sm transition-all duration-500
          ${enviadaPorMim 
            ? 'bg-spif-primary text-spif-bg rounded-2xl rounded-tr-none' 
            : 'bg-spif-card border border-spif-card-border text-spif-text rounded-2xl rounded-tl-none'}
        `}>
          {/* VISUALIZAÇÃO DA MENSAGEM PAI */}
          {mensagem.conteudoMensagemPai && (
            <div 
              onClick={handleScrollToPai}
              className={`mb-2 p-2 rounded-lg text-[11px] font-bold border-l-4 truncate cursor-pointer transition-all duration-300
                ${enviadaPorMim 
                    ? 'bg-black/10 border-white/30 text-white/70 hover:bg-black/20' 
                    : 'bg-spif-bg/50 border-spif-primary/50 text-spif-secondary hover:bg-spif-bg hover:text-spif-text'}`}
            >
              {mensagem.conteudoMensagemPai}
            </div>
          )}

          <div className="flex flex-col gap-1">
             <p className="text-[14px] leading-relaxed font-medium break-words">
                {mensagem.conteudo}
             </p>
             
             <div className={`flex items-center gap-1.5 self-end transition-opacity duration-300 ${enviadaPorMim ? 'opacity-70' : 'opacity-40'}`}> 
                <span className="text-[9px] font-black uppercase tracking-widest">
                  {format(new Date(mensagem.horarioEnviada), "HH:mm")}
                </span>
                {enviadaPorMim && (
                  <span className="shrink-0 flex items-center">
                    {mensagem.horarioLida ? <CheckCheck size={12} className="text-white" /> : <Check size={12} className="text-white/60" />}
                  </span>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}