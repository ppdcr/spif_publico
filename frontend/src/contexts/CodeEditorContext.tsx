import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'
import type { Linguagem } from '../features/submissao/submissao.types'

// ─── Tipos ────────────────────────────────────────────────────────────────────

type EditorState = {
    linguagem: Linguagem
    codigo: string
}

type EditorContextValue = EditorState & {
    setLinguagem: (l: Linguagem) => void
    setCodigo: (c: string) => void
    resetar: () => void
}

// ─── Helpers de persistência ──────────────────────────────────────────────────

// Chave inclui userId — garante que trocar de conta limpa o editor
const storageKey = (userId: number, problemaId: number) =>
    `spif_editor_${userId}_${problemaId}`

const ESTADO_PADRAO: EditorState = {
    linguagem: 'PYTHON',
    codigo: '',
}

function carregar(userId: number, problemaId: number): EditorState {
    try {
        const raw = localStorage.getItem(storageKey(userId, problemaId))
        if (!raw) return ESTADO_PADRAO
        return JSON.parse(raw) as EditorState
    } catch {
        return ESTADO_PADRAO
    }
}

function salvar(userId: number, problemaId: number, state: EditorState) {
    localStorage.setItem(storageKey(userId, problemaId), JSON.stringify(state))
}

// ─── Context ──────────────────────────────────────────────────────────────────

const EditorContext = createContext<EditorContextValue | null>(null)

export function EditorProvider({
    userId,
    problemaId,
    children,
}: {
    userId: number
    problemaId: number
    children: React.ReactNode
}) {
    // Inicializa já com os dados corretos do usuário atual
    const [state, setState] = useState<EditorState>(() =>
        carregar(userId, problemaId)
    )

    // Quando o userId muda (troca de conta), recarrega o estado do novo usuário
    // sem aguardar o próximo render — reseta imediatamente
    useEffect(() => {
        setState(carregar(userId, problemaId))
    }, [userId, problemaId])

    // Persiste no localStorage sempre que o estado muda
    useEffect(() => {
        salvar(userId, problemaId, state)
    }, [userId, problemaId, state])

    const setLinguagem = useCallback((linguagem: Linguagem) => {
        setState((prev) => ({ ...prev, linguagem }))
    }, [])

    const setCodigo = useCallback((codigo: string) => {
        setState((prev) => ({ ...prev, codigo }))
    }, [])

    const resetar = useCallback(() => {
        setState(ESTADO_PADRAO)
        localStorage.removeItem(storageKey(userId, problemaId))
    }, [userId, problemaId])

    return (
        <EditorContext.Provider value={{ ...state, setLinguagem, setCodigo, resetar }}>
            {children}
        </EditorContext.Provider>
    )
}

export function useCodeEditor(): EditorContextValue {
    const ctx = useContext(EditorContext)
    if (!ctx) throw new Error('useCodeEditor deve ser usado dentro de <EditorProvider>')
    return ctx
}