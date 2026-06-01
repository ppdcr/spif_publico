import { useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import ListaProblemasContainer from '../containers/ListaProblemasContainer'
import CriarProblemaForm from '../components/CriarProblemaForm'
import MeusProblemasPage from './MeusProblemasPage'

type Tab = 'TODOS' | 'CRIAR' | 'MEUS_PROBLEMAS'
  
export default function ProblemaHome() {
  const { role } = useAuth()

  const isProfessor = role === 'ROLE_PROFESSOR'
  const [activeTab, setActiveTab] = useState<Tab>('TODOS')

  const tabs = [
    { key: 'TODOS', label: 'Todos os Problemas', show: true },
    { key: 'MEUS_PROBLEMAS', label: 'Meus Problemas', show: isProfessor },
    { key: 'CRIAR', label: 'Novo Problema', show: isProfessor },
  ].filter(t => t.show)

  return (
    <div className="min-h-screen overflow-y-auto font-sans bg-spif-bg text-spif-text transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-8 md:px-12 py-12">
        
        {/* ── Cabeçalho Único ── */}
        {isProfessor &&
          <header className="mb-8 border-b border-spif-card-border pb-6">
            <div className="flex flex-col xl:flex-row xl:items-end justify-end gap-8">

              {/* Tabs Revitalizadas */}
              <nav className="flex flex-wrap items-center gap-2 bg-spif-card p-1.5 rounded-xl border border-spif-card-border shadow-inner">
                {tabs.map((item) => {
                  const isActive = activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setActiveTab(item.key as any)}
                      className={`
                        relative px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg
                        transition-all duration-300 ease-out
                        ${isActive 
                          ? 'bg-spif-primary text-spif-bg shadow-md shadow-spif-primary/20 scale-100' 
                          : 'text-spif-secondary hover:text-spif-text hover:bg-spif-bg/50 scale-95 hover:scale-100'
                        }
                      `}
                    >
                      <span className="relative z-10">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </header>
        }
        {/* ── Área de Conteúdo ── */}
        <main>
          {activeTab === 'TODOS' && <ListaProblemasContainer filtroAbertoInicial />}
          {activeTab === 'CRIAR' && 
            <div className="glass-card p-8">
              <CriarProblemaForm onSuccess={() => setActiveTab('TODOS')} />
            </div>
          }
          {activeTab === 'MEUS_PROBLEMAS' && <MeusProblemasPage />}
        </main>
      </div>
    </div>
  )
}