import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  bgColor: string
  textColor: string
  borderColor: string
  secondaryTextColor: string
  cardBgColor: string
  cardBorderColor: string
  surfaceColor: string
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// ─── Aplicação síncrona do tema ───────────────────────────────────────────────
// Executado IMEDIATAMENTE ao importar o módulo — antes de qualquer render React.
// Isso evita o flash branco: o <html> já tem a classe correta quando o
// Tailwind começa a pintar os estilos.
function aplicarTemaInicial(): Theme {
  const saved = localStorage.getItem('theme') as Theme | null
  const tema: Theme = saved === 'light' || saved === 'dark' ? saved : 'dark'
  document.documentElement.classList.toggle('dark', tema === 'dark')
  return tema
}

const TEMA_INICIAL = aplicarTemaInicial()

// ─── Cores por tema ───────────────────────────────────────────────────────────

const CORES = {
  dark: {
    bgColor: '#0a0c10',
    textColor: '#f4f4f5',
    borderColor: '#1e232d',
    secondaryTextColor: '#a1a1aa',
    cardBgColor: '#11141a',
    cardBorderColor: '#1e232d',
    surfaceColor: '#11141a',
  },
  light: {
    bgColor: '#f8fafc',
    textColor: '#0f172a',
    borderColor: '#e2e8f0',
    secondaryTextColor: '#64748b',
    cardBgColor: '#ffffff',
    cardBorderColor: '#e2e8f0',
    surfaceColor: '#ffffff',
  },
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(TEMA_INICIAL)

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, ...CORES[theme] }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}