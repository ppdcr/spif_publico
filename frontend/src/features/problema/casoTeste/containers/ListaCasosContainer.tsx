import { useDeletarCasoTeste, useListarCasos, useCriarCasoTeste } from "../caso.hooks"
import { AlertTriangle, Loader2, Upload, CheckCircle2, X } from "lucide-react"
import CasoTesteCard from "../components/CasoTesteCard"
import CriarCasoTesteForm from "../components/CriarCasoTesteForm"
import { useState, useRef } from "react"

type Aba = 'CASOS' | 'CRIAR'

interface ListaCasosContainerProps {
    problemaId: number
}

// ─── Aba: Casos ───────────────────────────────────────────────────────

function AbaCasosTeste({ problemaId }: ListaCasosContainerProps) {
    const { data: casos, isLoading, isError } = useListarCasos(problemaId)

    const { mutate: deletar } = useDeletarCasoTeste(problemaId)
  
    if (isLoading || !casos) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-spif-primary animate-pulse gap-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-sm font-bold tracking-widest uppercase">Sincronizando Casos de Teste...</span>
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
            <p className="font-bold text-lg text-spif-text">Falha ao carregar Casos de Teste</p>
            <p className="text-sm text-spif-secondary">Tente novamente mais tarde.</p>
          </div>
        </div>
      )
    }
  
    if (casos.length === 0) {
      return (
        <div className="glass-card border-dashed flex flex-col items-center justify-center py-20 text-center gap-4">
          <p className="text-lg font-bold text-spif-text">Nenhum Caso de Teste encontrado</p>
          <p className="text-sm text-spif-secondary">
            Esse problema ainda não possui Casos de teste.
          </p>
        </div>
      )
    }
  
    return (
        <div className="grid gap-4">
            {casos.map((caso, i) => (
                <CasoTesteCard
                    key={caso.id}
                    caso={caso}
                    index={i}
                    problemaId={problemaId}
                    onDeletar={deletar}
                />
            ))}
        </div>
    )
  }
  
  
  // ─── Aba: Criar Caso ─────────────────────────────────────────────────────────
  
  function AbaCriarCaso({ 
    problemaId, 
    onSuccess 
  }: { 
    problemaId: number
    onSuccess: () => void 
  }) {
  
    return (
      <div className="glass-card p-8">
          <CriarCasoTesteForm
            problemaId={problemaId}
            onSuccess={onSuccess}
          />
      </div>
    )
  }
  
  export default function ListaCasosContainer({ 
    problemaId,
  }: ListaCasosContainerProps) {
    const [abaAtiva, setAbaAtiva] = useState<Aba>('CASOS')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { mutateAsync: criarCaso } = useCriarCasoTeste(problemaId)

    const [importStatus, setImportStatus] = useState<{
      status: 'idle' | 'loading' | 'success' | 'error'
      mensagem: string
      detalhes?: string[]
    }>({ status: 'idle', mensagem: '' })
  
    const ABAS = [
      { key: 'CASOS' as const, label: 'Casos de Teste'},
      { key: 'CRIAR' as const, label: 'Novo Caso'},
    ]

    const lerArquivo = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve((e.target?.result as string) || '')
        reader.onerror = (err) => reject(err)
        reader.readAsText(file)
      })
    }

    const handleImportarArquivos = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (!files || files.length === 0) return

      // 1. O número total de arquivos deve ser par
      if (files.length % 2 !== 0) {
        setImportStatus({
          status: 'error',
          mensagem: 'Quantidade de arquivos inválida',
          detalhes: [`Você selecionou ${files.length} arquivos. O total deve ser par (cada entrada .in precisa de uma saída .out correspondente).`]
        })
        e.target.value = ''
        return
      }

      const erros: string[] = []
      const filesByPrefix: Record<string, { in?: File; out?: File }> = {}

      // 2. Verificar nomenclatura dos arquivos
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const match = file.name.match(/^(.+)\.(in|out)$/i)
        if (!match) {
          erros.push(`O arquivo "${file.name}" não segue exatamente o modelo ORDEM_DO_CASO.in ou ORDEM_DO_CASO.out.`)
          continue
        }

        const prefix = match[1]
        const extension = match[2].toLowerCase()

        // Validar se o prefixo é um número inteiro válido
        const ordemNum = parseInt(prefix, 10)
        if (isNaN(ordemNum) || ordemNum <= 0) {
          erros.push(`O arquivo "${file.name}" possui a ordem "${prefix}" inválida. Deve ser um número inteiro positivo.`)
          continue
        }

        if (!filesByPrefix[prefix]) {
          filesByPrefix[prefix] = {}
        }

        if (extension === 'in') {
          if (filesByPrefix[prefix].in) {
            erros.push(`Arquivo de entrada (.in) duplicado para o caso "${prefix}".`)
          }
          filesByPrefix[prefix].in = file
        } else {
          if (filesByPrefix[prefix].out) {
            erros.push(`Arquivo de saída (.out) duplicado para o caso "${prefix}".`)
          }
          filesByPrefix[prefix].out = file
        }
      }

      if (erros.length > 0) {
        setImportStatus({
          status: 'error',
          mensagem: 'Erros na nomenclatura dos arquivos',
          detalhes: erros
        })
        e.target.value = ''
        return
      }

      // 3. Verificar correspondência dos pares .in e .out
      const casosParaCriar: { ordem: number; entrada: string; saida: string; visivel: boolean }[] = []

      for (const [prefix, filesPair] of Object.entries(filesByPrefix)) {
        if (!filesPair.in || !filesPair.out) {
          erros.push(`falta a entrada / saida do caso de teste "${prefix}" (encontrado apenas .${filesPair.in ? 'in' : 'out'}).`)
        }
      }

      if (erros.length > 0) {
        setImportStatus({
          status: 'error',
          mensagem: 'Pares de arquivos incompletos',
          detalhes: erros
        })
        e.target.value = ''
        return
      }

      // Se passou na validação, lê os conteúdos dos arquivos e envia
      setImportStatus({
        status: 'loading',
        mensagem: 'Processando conteúdo dos arquivos...'
      })

      try {
        for (const [prefix, filesPair] of Object.entries(filesByPrefix)) {
          const ordem = parseInt(prefix, 10)
          const entradaText = await lerArquivo(filesPair.in!)
          const saidaText = await lerArquivo(filesPair.out!)

          casosParaCriar.push({
            ordem,
            entrada: entradaText,
            saida: saidaText,
            visivel: false
          })
        }

        // Criar no backend
        for (let i = 0; i < casosParaCriar.length; i++) {
          setImportStatus({
            status: 'loading',
            mensagem: `Importando caso de teste ${i + 1} de ${casosParaCriar.length}...`
          })
          await criarCaso(casosParaCriar[i])
        }

        setImportStatus({
          status: 'success',
          mensagem: `Importação concluída! ${casosParaCriar.length} casos de teste foram adicionados.`
        })
        setAbaAtiva('CASOS')
      } catch (err: any) {
        setImportStatus({
          status: 'error',
          mensagem: 'Falha ao salvar casos no servidor',
          detalhes: [err?.message || 'Erro inesperado durante a comunicação com a API.']
        })
      }

      e.target.value = ''
    }
  
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <nav className="flex items-center gap-1.5 bg-spif-card p-1.5 rounded-xl border border-spif-card-border shadow-inner w-fit">
            {ABAS.map((aba) => {
              const isActive = abaAtiva === aba.key
              return (
                <button
                  key={aba.key}
                  onClick={() => setAbaAtiva(aba.key as Aba)}
                  className={`
                    flex items-center gap-2 px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all duration-200
                    ${isActive
                      ? 'bg-spif-primary text-spif-bg shadow-md shadow-spif-primary/20'
                      : 'text-spif-secondary hover:text-spif-text hover:bg-spif-bg/50'
                    }
                  `}
                >
                  {aba.label}
                </button>
              )
            })}
          </nav>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportarArquivos}
              multiple
              accept=".in,.out"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg border border-spif-primary/30 text-spif-primary hover:bg-spif-primary/10 transition-all duration-200"
            >
              <Upload className="w-3.5 h-3.5" />
              Importar Casos
            </button>
          </div>
        </div>

        {/* ── Status de Importação ── */}
        {importStatus.status !== 'idle' && (
          <div className={`p-6 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 relative ${
            importStatus.status === 'loading' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
            importStatus.status === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
            'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            <button 
              onClick={() => setImportStatus({ status: 'idle', mensagem: '' })}
              className="absolute top-4 right-4 text-spif-secondary hover:text-spif-text transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-start gap-4">
              {importStatus.status === 'loading' && <Loader2 className="w-5 h-5 animate-spin mt-0.5" />}
              {importStatus.status === 'success' && <CheckCircle2 className="w-5 h-5 mt-0.5" />}
              {importStatus.status === 'error' && <AlertTriangle className="w-5 h-5 mt-0.5" />}
              <div>
                <h4 className="font-bold text-sm text-spif-text mb-1">{importStatus.mensagem}</h4>
                {importStatus.detalhes && importStatus.detalhes.length > 0 && (
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-spif-secondary">
                    {importStatus.detalhes.map((det, idx) => (
                      <li key={idx}>{det}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
  
        {/* ── Conteúdo ── */}
        {abaAtiva === 'CASOS' && (
          <AbaCasosTeste problemaId={problemaId} />
        )}
        {abaAtiva === 'CRIAR' && (
          <AbaCriarCaso problemaId={problemaId} onSuccess={() => setAbaAtiva('CASOS')} />
        )}
      </div>
    )
  }
  