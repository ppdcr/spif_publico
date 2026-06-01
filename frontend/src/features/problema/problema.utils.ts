// Mapear dificuldade numérica para texto descritivo
export const dificuldadeMap: Record<number, string> = {
  1: 'Muito fácil',
  2: 'Muito fácil',
  3: 'Fácil',
  4: 'Fácil',
  5: 'Médio',
  6: 'Médio',
  7: 'Difícil',
  8: 'Difícil',
  9: 'Muito difícil',
  10: 'Muito difícil',
}

export const assuntos: string[] = [
  'algoritmos gulosos',
  'aritmética modular',
  'arrays',
  'árvore geradora mínima (MST)',
  'árvores',
  'árvores binárias',
  'árvores binárias de busca',
  'backtracking',
  'bipartição de grafos',
  'bitmask',
  'branch and bound',
  'busca',
  'busca binária',
  'busca em largura (BFS)',
  'busca em profundidade (DFS)',
  'busca ternária',
  'combinatória',
  'componentes conectados',
  'compressão de coordenadas',
  'convex hull',
  'crivo de eratóstenes',
  'deque',
  'design de algoritmos',
  'detecção de ciclo',
  'difference array',
  'distância entre pontos',
  'dividir e conquistar',
  'exponenciação rápida',
  'fenwick tree (árvore binária indexada)',
  'filas',
  'fluxo máximo',
  'força bruta',
  'grafos',
  'geometria',
  'heaps (fila de prioridade)',
  'interseção de segmentos',
  'intervalos',
  'janela deslizante',
  'kmp',
  'lazy propagation',
  'listas duplamente ligadas',
  'listas ligadas',
  'manipulação de bits',
  'matching de strings',
  'matemática',
  'matrizes',
  'mdc (gcd)',
  'menor caminho (dijkstra, bellman-ford)',
  'mmc (lcm)',
  'números primos',
  'ordenação',
  'ordenação topológica',
  'otimização',
  'parsing',
  'pilhas',
  'prefix sum',
  'probabilidade',
  'problemas interativos',
  'problemas online (streaming)',
  'programação dinâmica',
  'programação dinâmica bottom-up',
  'programação dinâmica com memoização',
  'range queries',
  'rabin-karp',
  'recursão',
  'segment tree',
  'simulação',
  'strings',
  'suffix array',
  'suffix tree',
  'tabelas hash',
  'teoria dos números',
  'trie (árvore de prefixos)',
  'two pointers',
  'union-find (disjoint set)',
]

export const getDificuldadeTexto = (dificuldade: number): string => {
  return dificuldadeMap[dificuldade] || 'Desconhecido'
}

// Cores por dificuldade
export const dificuldadeColors: Record<string, string> = {
  'Muito fácil': '#4ade80',  // verde
  'Fácil': '#60a5fa',        // azul
  'Médio': '#fbbf24',        // amarelo
  'Difícil': '#f97316',      // laranja
  'Muito difícil': '#ef4444', // vermelho
}

export const getDificuldadeCor = (dificuldadeTexto: string): string => {
  return dificuldadeColors[dificuldadeTexto] || '#6b7280'
}
