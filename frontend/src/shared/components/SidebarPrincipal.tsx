import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'
import {
  Settings,
  LogOut,
  ChevronDown,
  Moon,
  Sun,
  User,
  Menu,
  CircleUserRound,
} from 'lucide-react'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface SidebarLink {
  to: string
  label: string
  badge?: number
}

// ─── Helper: formata a role para exibição ─────────────────────────────────────

function formatarRole(role: string | null): string {
  if (!role) return ''
  if (role === 'ROLE_PROFESSOR') return 'Professor'
  if (role === 'ROLE_ALUNO') return 'Aluno'
  return role.replace('ROLE_', '')
}

// ─── Conteúdo interno do Sidebar (reutilizado em desktop e mobile) ────────────

function SidebarContent({
  navLinks,
  logout,
  onNavClick,
}: {
  navLinks: SidebarLink[]
  logout: () => void
  onNavClick?: () => void
}) {
  const { theme, toggleTheme } = useTheme()
  const { usuario, role } = useAuth()
  const location = useLocation()

  return (
    <>
      {/* Navegação */}
      <nav className="flex flex-col gap-1.5 flex-1 overflow-y-auto">
        {navLinks.map((l) => {
          const isActive =
            l.to === '/home'
              ? location.pathname === '/home'
              : location.pathname.startsWith(l.to)

          return (
            <Link
              key={l.to}
              to={l.to}
              onClick={onNavClick}
              className={`
                group flex items-center justify-between px-3 py-3 text-sm font-medium
                tracking-wide rounded-lg transition-all
                ${isActive
                  ? 'bg-spif-primary/10 text-spif-primary border border-spif-primary/20'
                  : 'text-spif-secondary hover:text-spif-text hover:bg-spif-card border border-transparent'
                }
              `}
            >
              <span className={isActive ? 'font-bold' : ''}>{l.label}</span>

              {l.badge !== undefined && l.badge > 0 && (
                <span className="bg-spif-primary text-spif-bg font-bold text-xs px-2 py-0.5 min-w-[24px] text-center rounded-md leading-none animate-in fade-in zoom-in shadow-sm shadow-spif-primary/30">
                  {l.badge > 99 ? '99+' : l.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Rodapé */}
      <div className="flex flex-col gap-2 mt-auto shrink-0 pt-4">

        {/* Configurações */}
        <div className="group relative">
          <div className="flex items-center justify-between px-3 py-3 text-sm font-medium tracking-wide rounded-lg border border-spif-card-border bg-spif-card text-spif-secondary transition-all cursor-pointer hover:border-spif-primary/50 hover:text-spif-text">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span>Configurações</span>
            </div>
            <ChevronDown className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform" />
          </div>

          {/* Dropdown Configurações (sobe) */}
          <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute bottom-full left-0 w-full mb-2 flex flex-col gap-1 p-2 rounded-xl border border-spif-card-border bg-spif-card shadow-xl transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-left px-3 py-2.5 text-sm font-medium rounded-lg text-spif-secondary hover:text-spif-text hover:bg-spif-bg transition-colors w-full"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>{theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
            </button>
          </div>
        </div>

        {/* Antigo botão "Sair" isolado foi removido daqui para entrar dentro do novo menu do usuário abaixo */}

        {/* Novo Dropdown do Usuário */}
        <div className="group relative">
          {/* Gatilho visual do usuário */}
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl border border-spif-card-border bg-spif-card hover:border-spif-primary/30 hover:bg-spif-primary/5 transition-all cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-spif-primary/10 border border-spif-primary/20 flex items-center justify-center shrink-0">
              <CircleUserRound className="w-4 h-4 text-spif-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-spif-text truncate leading-tight">
                {usuario?.nickname}
              </p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-spif-secondary leading-tight">
                {formatarRole(role)}
              </p>
            </div>
            {/* Rotacionado para cima (0 graus) e inverte no hover (180 graus) */}
            <ChevronDown className="w-3.5 h-3.5 text-spif-secondary rotate-180 opacity-50 group-hover:rotate-0 transition-transform shrink-0" />
          </div>

          {/* Menu Suspenso do Usuário */}
          <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute bottom-full left-0 w-full mb-2 flex flex-col gap-1 p-2 rounded-xl border border-spif-card-border bg-spif-card shadow-xl transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
            
            {/* Opção 1: Ver Perfil */}
            <Link
              to={`/usuarios/${usuario?.id}`}
              onClick={onNavClick}
              className="flex items-center gap-2 text-left px-3 py-2.5 text-sm font-medium rounded-lg text-spif-secondary hover:text-spif-text hover:bg-spif-bg transition-colors"
            >
              <User className="w-4 h-4 text-spif-primary" />
              <span>Meu Perfil</span>
            </Link>

            {/* Opção 2: Sair da Conta */}
            <button
              onClick={() => { logout(); onNavClick?.() }}
              className="flex items-center gap-2 text-left px-3 py-2.5 text-sm font-medium rounded-lg text-spif-secondary hover:text-red-400 hover:bg-red-500/10 transition-colors w-full"
            >
              <LogOut className="w-4 h-4 text-red-400/80" />
              <span>Sair da conta</span>
            </button>
            
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function SidebarPrincipal({
  navLinks,
  logout,
}: {
  navLinks: SidebarLink[]
  logout: () => void
}) {
  const [mobileAberto, setMobileAberto] = useState(false)

  return (
    <>
      {/* ── Botão hambúrguer (mobile) ── */}
      <button
        onClick={() => setMobileAberto(true)}
        className="fixed top-4 left-4 z-40 w-10 h-10 flex items-center justify-center rounded-xl bg-spif-card border border-spif-card-border text-spif-secondary hover:text-spif-text hover:border-spif-primary/40 shadow-lg transition-all"
        aria-label="Abrir menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* ── Sidebar Desktop ── */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-spif-card-border px-6 py-8 sticky top-0 h-screen bg-spif-bg animate-in duration-300">
        <SidebarContent navLinks={navLinks} logout={logout} />
      </aside>

      {/* ── Overlay (mobile) ── */}
      {mobileAberto && (
        <div
          className=" fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileAberto(false)}
        />
      )}

      {/* ── Sidebar Mobile (drawer) ── */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-72 flex flex-col
          border-r border-spif-card-border px-6 py-8 bg-spif-bg
          transition-transform duration-300 fade-out shadow-2xl
          ${mobileAberto ? 'translate-x-0' : '-translate-x-full'}
        `}
      >

        <SidebarContent
          navLinks={navLinks}
          logout={logout}
          onNavClick={() => setMobileAberto(false)}
        />
      </aside>
    </>
  )
}