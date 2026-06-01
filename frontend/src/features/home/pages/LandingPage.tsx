import { Link } from 'react-router-dom'
import { Terminal, Target, Trophy, Users, ChevronRight } from 'lucide-react'

const features = [
  {
    icon: <Terminal className="w-6 h-6" />,
    title: 'Problemas Reais',
    desc: 'Banco de questões criadas por professores, com casos de teste automáticos e feedback instantâneo.',
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Percursos Guiados',
    desc: 'Trilhas de aprendizado estruturadas por nível, do básico ao avançado.',
  },
  {
    icon: <Trophy className="w-6 h-6" />,
    title: 'Competições',
    desc: 'Problemas desafiadores para medir sua evolução contra outros alunos.',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Turmas & Listas',
    desc: 'Professores criam listas personalizadas e acompanham o progresso da turma.',
  },
]

const langs = ['Python', 'C', 'C++', 'Java', 'JavaScript']

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-spif-bg text-spif-text font-sans relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-spif-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-spif-primary/10 blur-[150px] rounded-full pointer-events-none" />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-32 pb-24 px-8 max-w-7xl mx-auto flex flex-col items-center text-center">

        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          Aprenda algoritmos.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-spif-primary to-emerald-300">
            Evolua de verdade.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-spif-secondary max-w-2xl mb-12 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-150">
          O ambiente ideal para aprender sobre programação. Resolva problemas,
          conclua percursos interativos e progrida mais rapido e com mais eficiência com o auxílio de professores e IA.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <Link
            to="/cadastro"
            className="group flex items-center gap-2 bg-spif-primary hover:bg-spif-primary-hover text-spif-bg px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-spif-primary/20"
          >
            Criar conta agora
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Langs Tags */}
        <div className="flex flex-wrap justify-center gap-3 mt-20 opacity-60">
          {langs.map((l) => (
            <span
              key={l}
              className="glass px-4 py-2 rounded-lg font-mono text-sm text-spif-secondary hover:text-spif-primary hover:border-spif-primary/50 transition-colors cursor-default"
            >
              {l}
            </span>
          ))}
        </div>
      </section>

      {/* ── Divisor ── */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-spif-card-border to-transparent my-12" />

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-24 px-8 max-w-7xl mx-auto">
        <header className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Tudo que você precisa <br />para <span className="text-spif-primary">aprender</span></h2>
          <p className="text-spif-secondary text-lg max-w-2xl mx-auto">
            Recursos projetados para ensinar alunos e facilitar a gestão para professores.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="glass-card p-8 group hover:-translate-y-2 hover:border-spif-primary/50 transition-all duration-300 relative overflow-hidden"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 text-spif-primary">
                {f.icon}
              </div>
              <div className="w-12 h-12 rounded-xl bg-spif-primary/10 flex items-center justify-center text-spif-primary mb-6 group-hover:scale-110 group-hover:bg-spif-primary group-hover:text-spif-bg transition-all">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{f.title}</h3>
              <p className="text-spif-secondary leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Final ────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-32 px-8 text-center mt-12">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-spif-primary/5 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-5xl font-black tracking-tight mb-6">
            Pronto para o <span className="text-spif-primary">próximo nível?</span>
          </h2>
          <p className="text-xl text-spif-secondary mb-10">
            Junte-se à plataforma e comece a resolver problemas instantaneamente.
          </p>
          <Link
            to="/cadastro"
            className="inline-flex items-center gap-2 bg-white text-spif-bg px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all hover:scale-105"
          >
            Acessar Plataforma
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="relative z-10 border-t border-spif-card-border px-8 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

          <p className="text-sm text-spif-secondary">
            Sistema de Aprendizado de Programação Do Instituto Federal
          </p>
        </div>
      </footer>
    </div>
  )
}