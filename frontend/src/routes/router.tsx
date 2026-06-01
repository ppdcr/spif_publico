import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { PrivateRoute, PublicRoute, ProfessorRoute, DisciplinaRoute, TurmaRoute } from '../shared/components/Routes'
import { RootLayout } from '../shared/components/RootLayout'

// ── Páginas públicas ────────────────────────────────────────────────────────
const LandingPage  = lazy(() => import('../features/home/pages/LandingPage'))
const LoginPage    = lazy(() => import('../features/usuario/pages/LoginPage'))
const CadastroPage = lazy(() => import('../features/usuario/pages/CadastroPage'))

// ── Dispatcher de role ───────────────────────────────────────────────────────
const HomePage = lazy(() => import('../features/home/pages/HomePage'))
const ProblemaHome = lazy(() => import('../features/problema/pages/ProblemaHome'))
const ProblemaPage = lazy(() => import('../features/problema/pages/ProblemaPage'))
const EditarProblemaPage = lazy(() => import('../features/problema/pages/EditarProblemaPage'))
const PerfilPage = lazy(() => import('../features/usuario/pages/PerfilPage'))

const DisciplinaHome = lazy(() => import('../features/disciplina/pages/DisciplinaHome'))
const DisciplinaPage = lazy(() => import('../features/disciplina/pages/DisciplinaPage'))

const TurmaPage = lazy(() => import('../features/disciplina/turma/pages/TurmaPage'))

const ListaHome = lazy(() => import('../features/lista/pages/ListaHome'))
const ListaPage = lazy(() => import('../features/lista/pages/ListaPage'))

const MensagemHome = lazy(() => import('../features/mensagem/pages/MensagemHome'))

const PercursoHome = lazy(() => import('../features/percurso/pages/PercursoHome'))
const PercursoPage = lazy(() => import('../features/percurso/pages/PercursoPage'))
const NivelPage = lazy(() => import('../features/percurso/nivel/pages/NivelPage'))

const CompeticaoHome = lazy(() => import('../features/competicao/pages/CompeticaoHome'))
const CompeticaoPage = lazy(() => import('../features/competicao/pages/CompeticaoPage'))

const AceitarConviteQrCode = lazy(() => import('../features/disciplina/turma/pages/AceitarConviteQrCode'))

const Loading = () => (
  <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center">
    <span className="text-[#5a6075] font-mono text-sm tracking-widest animate-pulse">
      carregando...
    </span>
  </div>
)

export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            // ── Públicas ───────────────────────────────────────────────────────────────
            {
                element: <PublicRoute />,
                children: [
                    {
                        path: '/',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <LandingPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: '/login',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <LoginPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: '/cadastro',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <CadastroPage />
                            </Suspense>
                        ),
                    },
                ]
            },
            
            // ── Protegidas ─────────────────────────────────────────────────────────────
            {
                element: <PrivateRoute />,
                children: [
                // Dispatcher — redireciona para a home correta com base no role
                    {
                        path: '/home',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <HomePage />
                            </Suspense>
                        ),
                    },
                    {
                        path: '/problemas',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <ProblemaHome />
                            </Suspense>
                        ),
                    },
                    {
                        path: '/problemas/:id',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <ProblemaPage />
                            </Suspense>
                        ),
                    },
                    {
                        element: <DisciplinaRoute />,
                        children: [
                            {
                                path: '/minhas-disciplinas/:id',
                                element: (
                                    <Suspense fallback={<Loading />}>
                                        <DisciplinaPage />
                                    </Suspense>
                                ),
                            },
                            {
                                path: '/minhas-disciplinas/:disciplinaIdParam/aceitar-convite-turma',
                                element: (
                                    <Suspense fallback={<Loading />}>
                                        <AceitarConviteQrCode />
                                    </Suspense>
                                ),
                            },
                            {
                                element: <TurmaRoute />,
                                children: [
                                    {
                                        path: '/minhas-disciplinas/:disciplinaIdParam/minhas-turmas/:turmaIdParam',
                                        element: (
                                            <Suspense fallback={<Loading />}>
                                                <TurmaPage />
                                            </Suspense>
                                        ),
                                    },
                                    {
                                        path: '/minhas-disciplinas/:disciplinaId/minhas-turmas/:turmaId/listas/:id',
                                        element: (
                                          <Suspense fallback={<Loading />}>
                                            <ListaPage />
                                          </Suspense>
                                        )
                                    },
                                    {
                                        path: '/minhas-disciplinas/:disciplinaId/minhas-turmas/:turmaId/listas/:listaId/problemas/:id',
                                        element: (
                                            <Suspense fallback={<Loading />}>
                                                <ProblemaPage />
                                            </Suspense>
                                        ),
                                    },
                                ]
                            }
                        ]
                    },
                    {
                        path: '/minhas-listas/:listaId/problemas/:id',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <ProblemaPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: '/percursos/:percursoId/niveis/:nivelId/problemas/:id',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <ProblemaPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: '/competicoes/:competicaoId/problemas/:id',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <ProblemaPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: '/problemas/:id/editar',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <EditarProblemaPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: '/usuarios/:id',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <PerfilPage />
                            </Suspense>
                        ),
                    },
                    {
                        path: '/minhas-disciplinas',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <DisciplinaHome />
                            </Suspense>
                        ),
                    },

                    {
                        path: '/minhas-disciplinas/:disciplinaIdParam/aceitar-convite-turma',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <AceitarConviteQrCode />
                            </Suspense>
                        ),
                    },
                    { 
                        element: <ProfessorRoute />,
                        children: [
                            {
                                path: '/minhas-listas',
                                element: (
                                    <Suspense fallback={<Loading />}>
                                        <ListaHome />
                                    </Suspense>
                                )
                            }
                        ]
                    },
                    {
                        path: '/minhas-listas/:id',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <ListaPage />
                            </Suspense>
                        )
                    },

                    {
                        path: '/percursos',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <PercursoHome />
                            </Suspense>
                        )
                    },
                    {
                        path: '/percursos/:id',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <PercursoPage />
                            </Suspense>
                        )
                    },
                    {
                        path: '/percursos/:id/niveis/:nivelId',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <NivelPage />
                            </Suspense>
                        )
                    },
                    {
                        path: '/minhas-conversas',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <MensagemHome />
                            </Suspense>
                        )
                    },
                    {
                        path: '/minhas-conversas/:id',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <MensagemHome />
                            </Suspense>
                        )
                    },
                    {
                        path: '/competicoes',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <CompeticaoHome />
                            </Suspense>
                        )
                    },
                    {
                        path: '/competicoes/:id',
                        element: (
                            <Suspense fallback={<Loading />}>
                                <CompeticaoPage />
                            </Suspense>
                        )
                    },
                ],
            },

            // ── Fallback ───────────────────────────────────────────────────────────────
            {
                path: '*',
                element: <Navigate to="/" replace />,
            },
        ],
    },
])