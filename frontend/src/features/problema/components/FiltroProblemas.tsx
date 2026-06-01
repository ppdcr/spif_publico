import { useState } from 'react'
import { getDificuldadeTexto, assuntos } from '../problema.utils'
import { Search, Filter, X, ChevronDown, ChevronUp, Tag } from 'lucide-react'

interface FiltroProblemasProps {
  tituloFiltro: string
  onTituloChange: (titulo: string) => void
  dificuldadeFiltro: number | undefined
  onDificuldadeChange: (dificuldade: number | undefined) => void
  assuntosFiltro: string[]
  onAssuntosChange: (assuntos: string[]) => void
  onBuscar: () => void
  onLimpar: () => void
}

export default function FiltroProblemas({
  tituloFiltro,
  onTituloChange,
  dificuldadeFiltro,
  onDificuldadeChange,
  assuntosFiltro,
  onAssuntosChange,
  onBuscar,
  onLimpar,
}: FiltroProblemasProps) {
  const [expandirAssuntos, setExpandirAssuntos] = useState(false)

  const handleToggleAssunto = (assunto: string) => {
    const novoArray = assuntosFiltro.includes(assunto)
      ? assuntosFiltro.filter((a) => a !== assunto)
      : [...assuntosFiltro, assunto]
    onAssuntosChange(novoArray)
  }

  return (
    <div className="glass-card p-8 space-y-5 transition-colors duration-300 border-spif-card-border/50">

      {/* ── Inputs Principais ── */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-spif-secondary">
            <Search className="w-3.5 h-3.5" /> Título
          </label>
          <div className="relative group">
            <input
              value={tituloFiltro}
              onChange={(e) => onTituloChange(e.target.value)}
              placeholder="Ex: Soma de Vetores..."
              className="w-full bg-spif-card border border-spif-card-border focus:border-spif-primary/50 text-spif-text outline-none p-4 rounded-xl text-sm transition-all shadow-inner shadow-black/5 placeholder:text-spif-secondary/30"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-spif-secondary">
            <Filter className="w-3.5 h-3.5" /> Dificuldade
          </label>
          <div className="relative">
            <select
              value={dificuldadeFiltro ?? ''}
              onChange={(e) => onDificuldadeChange(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full bg-spif-card border border-spif-card-border focus:border-spif-primary/50 text-spif-text outline-none p-4 rounded-xl text-sm transition-all cursor-pointer appearance-none shadow-inner shadow-black/5"
            >
              <option value="" className="bg-spif-bg">Todas as dificuldades</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <option key={value} value={value} className="bg-spif-bg">
                  {getDificuldadeTexto(value)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-spif-secondary pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── Assuntos (Tags) ── */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setExpandirAssuntos(!expandirAssuntos)}
          className={`flex items-center justify-between w-full p-4 rounded-xl border transition-all duration-300
            ${expandirAssuntos
              ? 'bg-spif-primary/5 border-spif-primary/30 text-spif-primary'
              : 'bg-spif-card border-spif-card-border text-spif-secondary hover:border-spif-primary/30 hover:text-spif-primary'}`}
        >
          <div className="flex items-center gap-3">
            <Tag className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Filtrar por tópicos</span>
            {assuntosFiltro.length > 0 && (
              <span className="bg-spif-primary text-spif-bg px-2 py-0.5 text-[9px] font-black rounded-md">
                {assuntosFiltro.length}
              </span>
            )}
          </div>
          {expandirAssuntos ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expandirAssuntos && (
          <div className="flex flex-wrap gap-2 p-6 rounded-2xl bg-black/20 border border-spif-card-border animate-in slide-in-from-top-2 duration-300">
            {assuntos.map((assunto) => {
              const isSelected = assuntosFiltro.includes(assunto)
              return (
                <button
                  key={assunto}
                  type="button"
                  onClick={() => handleToggleAssunto(assunto)}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg border transition-all duration-200
                    ${isSelected
                      ? 'bg-spif-primary text-spif-bg border-spif-primary shadow-lg shadow-spif-primary/20'
                      : 'bg-spif-card border-spif-card-border text-spif-secondary hover:text-spif-text hover:border-spif-secondary'}`}
                >
                  {assunto}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Barra de Ações ── */}
      <div className="flex flex-col sm:flex-row items-center justify-end">
        <button
          onClick={onLimpar}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 text-[10px] font-black uppercase tracking-widest text-spif-secondary hover:text-spif-text transition-all"
        >
          <X className="w-4 h-4" /> Limpar
        </button>

        <button
          onClick={onBuscar}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 text-[10px] font-black uppercase tracking-widest text-spif-secondary hover:text-spif-text transition-all"
        >
          <Search className="w-4 h-4" /> Aplicar
        </button>
      </div>
    </div>
  )
}