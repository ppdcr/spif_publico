import { useParams, useNavigate } from 'react-router-dom'
import { useBuscarProblema } from '../problema.hooks'
import EditarProblemaForm from '../components/EditarProblemaForm'
import { Loader2, AlertTriangle, ArrowLeft } from 'lucide-react'

export default function EditarProblemaPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const problemaId = id ? parseInt(id) : 0
  const { data: problema, isLoading, isError } = useBuscarProblema(problemaId)

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-80px)] items-center justify-center bg-spif-bg text-spif-primary animate-pulse gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="tracking-widest uppercase text-sm font-bold">Sincronizando dados...</span>
      </div>
    )
  }

  if (isError || !problema) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-80px)] items-center justify-center gap-6 bg-spif-bg text-spif-text p-8">
        <div className="glass-card p-10 flex flex-col items-center max-w-sm w-full text-center gap-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <p className="font-bold text-lg">Problema não localizado.</p>
          <button
            onClick={() => navigate('/problemas')}
            className="flex items-center gap-2 text-spif-primary hover:text-spif-primary-hover font-bold uppercase tracking-widest text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            Retornar ao Repositório
          </button>
        </div>
      </div>
    )
  }

  return <EditarProblemaForm problema={problema} />
}