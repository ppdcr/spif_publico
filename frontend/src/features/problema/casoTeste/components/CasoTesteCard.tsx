import { useState } from 'react'
import EditarCasoTesteForm from './EditarCasoTesteForm'
import {
  Eye,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  EyeOff,
} from 'lucide-react'
import type { CasoTesteResponse } from '../caso.types'
import { useAtualizarCasoTeste } from '../caso.hooks'

interface CasoTesteCardProps {
  caso: CasoTesteResponse
  index: number
  problemaId: number
  onDeletar: (casoId: number) => void
}

export default function CasoTesteCard({
  caso,
  problemaId,
  onDeletar,
}: CasoTesteCardProps) {
  const [editando, setEditando] = useState(false)
  const [expandido, setExpandido] = useState(false)

  const [isUpdatingVisivel, setIsUpdatingVisivel] = useState(false)

  const { mutateAsync } = useAtualizarCasoTeste(problemaId, caso.id)

  const handleToggleVisivel = async (e: React.MouseEvent) => {
    e.stopPropagation()

    setIsUpdatingVisivel(true)
    try {
      await mutateAsync({visivel: !caso.visivel})
    } finally {
      setIsUpdatingVisivel(false)
    }
  }

  const handleSair = () => {
    setEditando(false)
    setExpandido(false)
  }

  return (
    <>
      <div
        className={`
          glass-card overflow-hidden transition-all duration-300
          ${expandido
            ? 'ring-2 ring-spif-primary/50 bg-spif-primary/5'
            : 'hover:bg-spif-card/80'
          }
        `}
      >
        {/* ── Header do Card ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-6 gap-4">
          <div
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => setExpandido(!expandido)}
          >
            <button className="p-1.5 rounded-lg hover:bg-spif-bg text-spif-secondary hover:text-spif-text transition-colors">
              {expandido ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </button>

            <div className="flex flex-col">
              <p className="text-sm font-bold uppercase tracking-widest text-spif-text">
                Caso {caso.ordem}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleVisivel}
              disabled={isUpdatingVisivel}
              className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all text-spif-secondary ${caso.visivel
                ? 'hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30'
                : 'hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30'
                } ${isUpdatingVisivel ? 'opacity-50 cursor-wait' : ''}`}
            >
              {caso.visivel ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{caso.visivel ? 'Visível' : 'Privado'}</span>
            </button>

            <button
              onClick={() => {
                setEditando(true)
              }}
              className="
                flex items-center gap-2 px-3 py-1.5 rounded-lg
                text-xs font-bold uppercase tracking-widest
                text-spif-secondary hover:text-spif-primary
                hover:bg-spif-primary/10 transition-all
              "
            >
              <Edit2 className="w-3.5 h-3.5" />
              Editar
            </button>

            <button
              onClick={() => onDeletar(caso.id)}
              className="
                flex items-center gap-2 px-3 py-1.5 rounded-lg
                text-xs font-bold uppercase tracking-widest
                text-spif-secondary hover:text-red-500
                hover:bg-red-500/10 transition-all
              "
            >
              <Trash2 className="w-3.5 h-3.5" />
              Deletar
            </button>
          </div>
        </div>

        {/* ── Conteúdo Expandido (Inspector) ── */}
        {expandido && (
          <div className="p-6 border-t border-spif-card-border/50 animate-in slide-in-from-top-2 duration-300">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-widest font-bold text-spif-secondary">
                  Entrada
                </p>

                <pre className="p-4 rounded-xl border border-spif-card-border bg-black/40 text-sm font-mono text-spif-text overflow-x-auto whitespace-pre-wrap">
                  {caso.entrada || '(vazio)'}
                </pre>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] uppercase tracking-widest font-bold text-spif-secondary">
                  Saída Esperada
                </p>

                <pre className="p-4 rounded-xl border border-spif-card-border bg-black/40 text-sm font-mono text-spif-text overflow-x-auto whitespace-pre-wrap">
                  {caso.saida || '(vazio)'}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Modal de edição ── */}
      {editando && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleSair}
          />

          {/* Modal */}
          <div className="relative w-full max-w-4xl bg-spif-bg border border-spif-card-border rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
            <div className="p-8 md:p-10">
              <EditarCasoTesteForm
                problemaId={problemaId}
                casoId={caso.id}
                defaultValues={caso}
                onCancel={handleSair}
                onSuccess={handleSair}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
