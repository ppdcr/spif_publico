import { AlertTriangle, Loader2 } from "lucide-react"
import { useMeusProblemasAtivos, useMeusProblemasInativos } from "../problema.hooks"
import ProblemaCardWithToggle from "../components/ProblemaCardWithToggle"

export default function MeusProblemasPage() {
  const { data: problemasAtivos, isLoading: loadingAtivos, isError: errorAtivos } = useMeusProblemasAtivos()
  const { data: problemasInativos, isLoading: loadingInativos, isError: errorInativos } = useMeusProblemasInativos()

  const problemas = [...(problemasAtivos ?? []), ...(problemasInativos ?? [])]
  const isLoading = loadingAtivos || loadingInativos
  const isError = errorAtivos || errorInativos

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-spif-primary animate-pulse gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-sm font-bold tracking-widest uppercase">Sincronizando problemas...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="glass-card flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <p className="font-bold text-lg text-spif-text">Falha ao carregar problemas</p>
          <p className="text-sm text-spif-secondary">Tente novamente mais tarde.</p>
        </div>
      </div>
    )
  }

  if (problemas.length === 0) {
    return (
      <div className="glass-card border-dashed flex flex-col items-center justify-center py-20 text-center gap-4">
        <p className="text-lg font-bold text-spif-text">Nenhum problema encontrado</p>
        <p className="text-sm text-spif-secondary">Você ainda não criou nenhum problema.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {problemas.map((problema) => (
        <ProblemaCardWithToggle
          key={problema.id}
          problema={problema}
        />
      ))}
    </div>
  )
}
