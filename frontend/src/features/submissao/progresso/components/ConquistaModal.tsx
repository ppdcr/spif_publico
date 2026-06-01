import { Trophy, Sparkles, X } from 'lucide-react'
import type { ConquistaItem } from '../progresso.hooks'

// ─── Partícula de confete ─────────────────────────────────────────────────────

type Particula = {
    id: number
    x: number
    delay: number
    duracao: number
    cor: string
    tamanho: number
    rotacao: number
}

const CORES = [
    '#10b981', // verde esmeralda (primary)
    '#34d399',
    '#6ee7b7',
    '#fbbf24', // âmbar
    '#f59e0b',
    '#60a5fa', // azul
    '#a78bfa', // violeta
    '#f472b6', // rosa
]

function gerarParticulas(n: number): Particula[] {
    return Array.from({ length: n }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.8,
        duracao: 1.2 + Math.random() * 1.2,
        cor: CORES[Math.floor(Math.random() * CORES.length)],
        tamanho: 4 + Math.random() * 6,
        rotacao: Math.random() * 360,
    }))
}

const PARTICULAS = gerarParticulas(40)

// ─── Anel de estrelas decorativo ─────────────────────────────────────────────

function AnelEstrelas() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            {Array.from({ length: 8 }, (_, i) => {
                const angulo = (i / 8) * 360
                const rad = (angulo * Math.PI) / 180
                const cx = 50 + Math.cos(rad) * 40
                const cy = 50 + Math.sin(rad) * 40
                return (
                    <div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full bg-spif-primary/40"
                        style={{
                            left: `${cx}%`,
                            top: `${cy}%`,
                            transform: 'translate(-50%, -50%)',
                            animation: `pulse 2s ease-in-out ${i * 0.25}s infinite`,
                        }}
                    />
                )
            })}
        </div>
    )
}

// ─── Componente Principal ─────────────────────────────────────────────────────

type Props = {
    conquista: ConquistaItem | null
    onFechar: () => void
}

export default function ConquistaModal({ conquista, onFechar }: Props) {

    if (!conquista) return null

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
            {/* Backdrop suave — não bloqueia o modal de submissão abaixo */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={onFechar} />

            {/* Modal */}
            <div
                className="relative z-10 w-full max-w-3xl pointer-events-auto overflow-hidden rounded-2xl border border-spif-primary/30 bg-spif-card shadow-2xl shadow-spif-primary/20"
                style={{ animation: 'conquista-entrada 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
            >
                {/* ── Confetes ── */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {PARTICULAS.map((p) => (
                        <div
                            key={p.id}
                            className="absolute rounded-sm opacity-0"
                            style={{
                                left: `${p.x}%`,
                                top: '-10px',
                                width: p.tamanho,
                                height: p.tamanho * 0.6,
                                backgroundColor: p.cor,
                                transform: `rotate(${p.rotacao}deg)`,
                                animation: `cair ${p.duracao}s ease-in ${p.delay}s forwards`,
                            }}
                        />
                    ))}
                </div>

                <AnelEstrelas />

                {/* Barra de progresso de auto-close */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-spif-card-border overflow-hidden">
                    <div
                        className="h-full bg-spif-primary origin-left"
                        style={{ animation: 'encolher 6s linear forwards' }}
                    />
                </div>

                {/* Botão fechar */}
                <button
                    onClick={onFechar}
                    className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center text-spif-secondary hover:text-spif-text hover:bg-spif-card-border/50 transition-all z-10"
                >
                    <X className="w-3.5 h-3.5" />
                </button>

                {/* Conteúdo */}
                <div className="flex flex-col items-center text-center px-8 py-10 gap-6">
                    {/* Ícone central */}
                    <div className="relative">
                        {/* Halo pulsante */}
                        <div className="absolute inset-0 rounded-full bg-spif-primary/20 scale-150 animate-ping" />
                        <div className="absolute inset-0 rounded-full bg-spif-primary/10 scale-125" />
                        <div
                            className="relative w-20 h-20 rounded-full bg-gradient-to-br from-spif-primary to-spif-primary-hover flex items-center justify-center shadow-xl shadow-spif-primary/40"
                            style={{ animation: 'girar-suave 4s ease-in-out infinite' }}
                        >
                            <Trophy className="w-9 h-9 text-white drop-shadow-lg" />
                        </div>

                        {/* Faíscas nos cantos */}
                        <Sparkles
                            className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400"
                            style={{ animation: 'faísca 1.5s ease-in-out 0.3s infinite' }}
                        />
                        <Sparkles
                            className="absolute -bottom-1 -left-2 w-4 h-4 text-yellow-300"
                            style={{ animation: 'faísca 1.5s ease-in-out 0.8s infinite' }}
                        />
                    </div>

                    {/* Texto */}
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-spif-primary">
                            Conquista Desbloqueada
                        </p>
                        <h2 className="text-xl font-black tracking-tight text-spif-text leading-tight">
                            {conquista.titulo}
                        </h2>
                        <h3 className="text-lg font-bold tracking-tight text-spif-text leading-tight">
                            {conquista.nomeObjeto}
                        </h3>
                        <p className="text-sm text-spif-secondary leading-relaxed">
                            {conquista.mensagem}
                        </p>
                    </div>

                    {/* Botão */}
                    <button
                        onClick={onFechar}
                        className="px-8 py-3 text-xs font-black uppercase tracking-widest rounded-xl bg-spif-primary hover:bg-spif-primary-hover text-spif-bg shadow-lg shadow-spif-primary/30 hover:scale-105 active:scale-100 transition-all"
                    >
                        Incrível! 🎉
                    </button>
                </div>

                {/* Keyframes injetados inline */}
                <style>{`
          @keyframes conquista-entrada {
            from { opacity: 0; transform: scale(0.7) translateY(40px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes cair {
            0%   { opacity: 1; transform: rotate(var(--r, 0deg)) translateY(0); }
            100% { opacity: 0; transform: rotate(calc(var(--r, 0deg) + 180deg)) translateY(500px); }
          }
          @keyframes encolher {
            from { transform: scaleX(1); }
            to   { transform: scaleX(0); }
          }
          @keyframes girar-suave {
            0%, 100% { transform: rotate(-6deg) scale(1); }
            50%      { transform: rotate(6deg) scale(1.05); }
          }
          @keyframes faísca {
            0%, 100% { opacity: 0.3; transform: scale(0.8); }
            50%      { opacity: 1;   transform: scale(1.2); }
          }
        `}</style>
            </div>
        </div>
    )
}