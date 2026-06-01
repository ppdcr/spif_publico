import { useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import CriarCompeticaoForm from '../components/CriarCompeticaoForm'
import ListaCompeticoesAtivasPage from './ListaCompeticoesAtivasPage'
import ListaCompeticoesInativasPage from './ListaCompeticoesInativasPage'

type Tab = 'ATIVAS' | 'INATIVAS' | 'CRIAR'

export default function CompeticaoHome() {
  const { role } = useAuth()
  const isProfessor = role === 'ROLE_PROFESSOR'

  const [activeTab, setActiveTab] = useState<Tab>('ATIVAS')

  const tabs = [
    { key: 'ATIVAS', label: 'Ativas' },
    { key: 'INATIVAS', label: 'Inativas' },
    { key: 'CRIAR', label: 'Nova Competição'}
  ]
  
  return (
    <div className="min-h-[calc(100vh-80px)] bg-spif-bg text-spif-text fade-out duration-300">
      <div className="max-w-[1600px] mx-auto px-8 md:px-12 py-12">

        {isProfessor &&
          <header className="mb-6 flex flex-col md:flex-row md:items-end justify-end gap-8 border-b border-spif-card-border pb-6">
            <div className="flex flex-col xl:flex-row xl:items-end justify-end gap-8">

              {/* Tabs Revitalizadas */}
              <nav className="flex flex-wrap items-center gap-2 bg-spif-card p-1.5 rounded-xl border border-spif-card-border shadow-inner">
                {tabs.map((item) => {
                  const isActive = activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setActiveTab(item.key as Tab)}
                      className={`
                        relative px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg
                        transition-all duration-300 fade-out
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
        <main className="animate-in fade-out slide-in-from-bottom-2 duration-300">
          <div className="mt-4">
            {activeTab === 'ATIVAS' && <ListaCompeticoesAtivasPage onAtualizar={() => setActiveTab('INATIVAS')} />}
            {activeTab === 'INATIVAS' && isProfessor && <ListaCompeticoesInativasPage onAtualizar={() => setActiveTab('ATIVAS')} />}
            {activeTab === 'CRIAR' && isProfessor && (
              <div className="glass-card p-8">
                <CriarCompeticaoForm onSuccess={() => setActiveTab('ATIVAS')}  />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
