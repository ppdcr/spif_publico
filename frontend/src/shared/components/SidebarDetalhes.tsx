import { Info } from 'lucide-react'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type DetalheItem = {
  label: string
  value: React.ReactNode
  destaque?: boolean
}

type Props = {
  isOpen: boolean
  onToggle: () => void
  titulo?: string
  itens: DetalheItem[]
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function DetalhesSidebar({ isOpen, onToggle, titulo = 'Detalhes', itens }: Props) {

  const vazia = itens.length === 0

  if (vazia) return null

  return (
    <>
      {/* ── Overlay mobile (sem blur, fecha ao clicar fora) ──
          z-[35] — abaixo do painel (z-40) mas acima do conteúdo da página.
          Só renderiza em mobile (lg:hidden) pois no desktop o painel
          empurra o layout e não precisa de overlay. */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[35] bg-black/40"
          onClick={onToggle}
        />
      )}

      {/* ── Container — ocupa espaço no layout em desktop ── */}
      <div
        className={`
          relative shrink-0 transition-all duration-300 ease-in-out
          ${isOpen ? 'w-72' : 'w-10'}
        `}
      >
        {/* Botão de abrir (visível apenas quando fechado) */}
        {!isOpen && (
          <button
            onClick={onToggle}
            className="
              absolute top-6 -right-0 z-20
              w-7 h-16 rounded-l-xl
              flex items-center justify-center
              border border-r-0 border-spif-card-border bg-spif-card
              text-spif-secondary hover:text-spif-primary hover:border-spif-primary/40
              transition-all duration-200 shadow-md
            "
            aria-label="Abrir detalhes"
          >
            <Info className="w-3 h-3 opacity-60" />
          </button>
        )}

        {/* ── Painel ──
            z-40 em mobile para ficar acima do overlay (z-[35]).
            Em desktop não precisa de z-index pois está no fluxo normal. */}
        <div
          className={`
            fixed top-0 right-0 h-full w-72 z-40
            border-l border-spif-card-border bg-spif-card
            overflow-hidden transition-all duration-300 ease-in-out
            ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}
          `}
        >
          <div className="w-72 h-full flex flex-col">
            {/* Cabeçalho */}
            <header className="flex items-center justify-center px-5 py-5 border-b border-spif-card-border shrink-0">
              <h3 className="text-xs font-black uppercase tracking-widest text-spif-text">
                {titulo}
              </h3>
            </header>

            {/* Itens */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {itens.map((item, i) => (
                <div key={i} className="space-y-1.5">
                  <p className="text-[10px] uppercase tracking-widest font-black text-spif-secondary">
                    {item.label}
                  </p>
                  {item.destaque ? (
                    <p className="text-2xl font-black text-spif-primary leading-tight">
                      {item.value}
                    </p>
                  ) : (
                    <div className="text-sm text-spif-text leading-relaxed font-medium">
                      {item.value}
                    </div>
                  )}
                  {i < itens.length - 1 && (
                    <div className="pt-3 border-b border-spif-card-border/50" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}