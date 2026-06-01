import { format, isToday, isYesterday } from "date-fns"
import type { ConversaResponse } from "../mensagem.types";
import { Check, CheckCheck, User } from "lucide-react";

interface ConversaCardProps {
  conversa: ConversaResponse;
  onClick: () => void;
  isActive?: boolean;
}

export default function ConversaCard({ conversa, onClick, isActive }: ConversaCardProps) {
  function formatarTempo(dataString: string) {
    const data = new Date(dataString)
    if (isToday(data)) return format(data, "HH:mm")
    if (isYesterday(data)) return "Ontem"
    return format(data, "dd/MM/yyyy")
  }

  return (
    <div 
      onClick={onClick}
      className={`group relative p-5 transition-all duration-300 cursor-pointer overflow-hidden border-l-4
        ${isActive 
          ? 'bg-spif-primary/10 border-spif-primary shadow-inner shadow-spif-primary/5' 
          : 'bg-transparent border-transparent hover:bg-spif-card/50 hover:border-spif-primary/30'}
      `}
    >
      <div className="flex gap-4 items-center">
        {/* Avatar Placeholder */}
        <div className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm
            ${isActive ? 'bg-spif-primary text-spif-bg' : 'bg-spif-card border border-spif-card-border text-spif-secondary group-hover:border-spif-primary/30 group-hover:text-spif-primary'}
        `}>
          <User className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div className="flex justify-between items-center gap-2">
            <h3 className={`text-sm font-bold tracking-tight truncate transition-colors duration-300
                ${isActive ? 'text-spif-primary' : 'text-spif-text group-hover:text-spif-primary'}
            `}>
              {conversa.nickname}
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-spif-secondary opacity-60 shrink-0">
              {formatarTempo(conversa.horarioEnviada)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
             <div className="flex items-center gap-1.5 min-w-0">
                {conversa.enviadaPorVoce && (
                    <span className="shrink-0">
                    {conversa.horarioLida 
                        ? <CheckCheck size={14} className="text-spif-primary" /> 
                        : <Check size={14} className="text-spif-secondary opacity-60" />
                    }
                    </span>
                )}
                <p className={`text-xs truncate font-medium transition-all duration-300
                    ${isActive ? 'text-spif-text' : 'text-spif-secondary'}
                `}>
                    {conversa.ultimaMensagem}
                </p>
            </div>

            {conversa.qtdNaoLidas > 0 && !conversa.enviadaPorVoce && (
                <span className="shrink-0 flex items-center justify-center min-w-[18px] h-[18px] text-[9px] bg-spif-primary text-spif-bg rounded-full font-black shadow-md shadow-spif-primary/30 animate-in zoom-in duration-300">
                    {conversa.qtdNaoLidas}
                </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}