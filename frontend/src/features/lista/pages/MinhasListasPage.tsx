import { useNavigate } from 'react-router-dom';
import { useListarMinhasListas } from '../lista.hooks';
import ListaCard from '../components/ListaCard';
import { Loader2, Search } from 'lucide-react';

export default function MinhasListasPage() {
  const { data: listas, isLoading, isError } = useListarMinhasListas();
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-spif-primary animate-pulse gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm font-bold tracking-widest uppercase">Sincronizando listas...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="glass-card flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
          <Search className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold text-lg text-spif-text">Falha ao carregar listas</p>
          <p className="text-sm text-spif-secondary">Não foi possível recuperar seus registros.</p>
        </div>
      </div>
    )
  }

  if (!listas || listas.length === 0) {
    return (
      <div className="glass-card border-dashed flex flex-col items-center justify-center py-20 text-center gap-4">
          <p className="text-lg font-bold text-spif-text">Nenhuma lista encontrada</p>
          <p className="text-sm text-spif-secondary">Você ainda não criou nenhuma lista de problemas.</p>
      </div>
    )
  }

  return (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {listas.map((lista) => (
          <ListaCard
            key={lista.id}
            lista={lista}
            onClick={() => navigate(`/minhas-listas/${lista.id}`)}
          />
        ))
      }
    </div>
  );
}