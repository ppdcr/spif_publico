import { useState } from "react"
import MinhasListasPage from "./MinhasListasPage"
import CriarListaForm from "../components/CriarListaForm"
import { FileText, PlusCircle } from 'lucide-react'

type Tab = 'MINHAS_LISTAS' | 'ADD_LISTA'

export default function ListaHome() {
    const tabs = [
        { key: 'MINHAS_LISTAS', label: 'Minhas Listas', icon: FileText },
        { key: 'ADD_LISTA', label: 'Nova Lista', icon: PlusCircle }
    ]

    const [activeTab, setActiveTab] = useState<Tab>('MINHAS_LISTAS')

    return (
        <div className="min-h-[calc(100vh-80px)] bg-spif-bg text-spif-text fade-out duration-300">
            <div className="max-w-[1600px] mx-auto px-8 md:px-12 py-12">
                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-end gap-8 border-b border-spif-card-border pb-6">
                    <div className="flex flex-col items-end gap-6 mt-0 w-full">

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

                <main className="fade-out duration-300">
                    <div className="mt-4">
                        {activeTab === 'MINHAS_LISTAS' && <MinhasListasPage />}
                        {activeTab === 'ADD_LISTA' && (
                            <div className="glass-card p-8">
                                <CriarListaForm onSuccess={() => setActiveTab('MINHAS_LISTAS')}  />
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}