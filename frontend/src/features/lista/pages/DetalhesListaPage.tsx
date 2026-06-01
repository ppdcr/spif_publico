import type { ListaProblemasResponse } from "../lista.types";
import { AlignLeft } from 'lucide-react';

export default function DetalhesListaPage({ lista }: { lista: ListaProblemasResponse }) {
    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <section className="glass-card p-8 md:p-10 border-spif-card-border/50">
                <div className="flex items-center gap-3 mb-6 border-b border-spif-card-border pb-4">
                    <AlignLeft className="w-5 h-5 text-spif-primary" />
                    <h2 className="text-xs font-black tracking-[0.2em] uppercase text-spif-text opacity-80">Descrição da Lista</h2>
                </div>
                <div className="text-spif-secondary text-sm leading-relaxed whitespace-pre-wrap font-medium">
                    {lista.descricao || "Nenhuma descrição fornecida para esta lista."}
                </div>
            </section>
        </div>
    )
}