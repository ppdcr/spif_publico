import { useState } from 'react'
import { AlertTriangle, X, Loader2 } from 'lucide-react'

interface ConfirmarDeletarModalProps {
  isOpen: boolean
  titulo: string
  textoConfirmacao: string
  mensagem: string
  onConfirmar: () => void
  onCancelar: () => void
  isPending: boolean
}

export default function ConfirmarDeletarModal({
  isOpen,
  titulo,
  textoConfirmacao,
  mensagem,
  onConfirmar,
  onCancelar,
  isPending,
}: ConfirmarDeletarModalProps) {
  const [confirmText, setConfirmText] = useState('')

  if (!isOpen) return null

  const isConfirmed = confirmText.toLowerCase() === textoConfirmacao.toLowerCase()

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancelar} />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-spif-bg border border-spif-card-border rounded-3xl shadow-2xl shadow-black/50 overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Banner de Perigo */}
        <div className="h-2 w-full bg-red-500" />

        <div className="p-8 md:p-10">
            {/* Header */}
            <header className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-6">
                <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h2 className="text-2xl font-black tracking-tight text-spif-text mb-3">
                {titulo}
            </h2>
            <p className="text-sm text-spif-secondary leading-relaxed font-medium">
                {mensagem}
            </p>
            </header>

            {/* Campo de Autorização */}
            <div className="mb-8">
            <div className="flex flex-col gap-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-spif-secondary opacity-80">
                    Digite <span className="text-red-500 underline underline-offset-4 decoration-2">{textoConfirmacao}</span> para confirmar:
                </label>
                <div className="relative group">
                    <input
                        type="text"
                        autoFocus
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="Confirme a ação..."
                        className="w-full bg-spif-card border border-spif-card-border focus:border-red-500/50 text-spif-text outline-none p-4 rounded-xl text-sm transition-all shadow-inner shadow-black/5 placeholder:text-spif-secondary/30"
                    />
                </div>
            </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col gap-3">
            <button
                onClick={onConfirmar}
                disabled={isPending || !isConfirmed}
                className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                ${isConfirmed 
                    ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 active:scale-[0.98]' 
                    : 'bg-spif-card text-spif-secondary border border-spif-card-border cursor-not-allowed'}`}
            >
                {isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processando...</>
                ) : (
                    <>Confirmar Exclusão</>
                )}
            </button>
            
            <button
                onClick={onCancelar}
                disabled={isPending}
                className="flex items-center justify-center gap-2 w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest text-spif-secondary hover:text-spif-text hover:bg-spif-card transition-all active:scale-[0.98]"
            >
                <X className="w-4 h-4" /> Cancelar Operação
            </button>
            </div>
        </div>
      </div>
    </div>
  )
}