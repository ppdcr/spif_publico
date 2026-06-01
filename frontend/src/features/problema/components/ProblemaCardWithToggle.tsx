import { useAtualizarProblema } from '../problema.hooks'
import type { ProblemaResumoResponse } from '../problema.types'
import ProblemaCard from './ProblemaCard'

interface ProblemaCardWithToggleProps {
  problema: ProblemaResumoResponse
}

export default function ProblemaCardWithToggle({
  problema
}: ProblemaCardWithToggleProps) {
  const { mutateAsync } = useAtualizarProblema(problema.id)

  const handleAtualizarVisivel = async (visivel: boolean) => {
    await mutateAsync({ visivel })
  }
  
  return (
    <ProblemaCard
      problema={problema}
      isOwnProblem={true}
      onAtualizarVisivel={handleAtualizarVisivel}
      
    />
  )
}
