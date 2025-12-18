import { createBrowserRouter, Navigate } from 'react-router-dom'
import { HomePage } from '@/pages/Home/HomePage'
import { Header } from '@/widgets/Header/Header'
import { Outlet } from 'react-router-dom'
import { DiscoverPage } from '@/pages/Discover/DiscoverPage'
import { IndicatorPage } from '@/pages/Indicator/IndicatorPage'
import { ResearchPage } from '@/pages/Research/ResearchPage'
import { DocsPage } from '@/pages/Docs/DocsPage'
import { CountriesPage } from '@/pages/Countries/CountriesPage'
import ComparePage from '../../pages/Compare/ComparePage'
import NotFoundPage from '@/pages/NotFound/NotFoundPage'
import { ReferencesPage } from '@/pages/References/ReferencesPage'

// eslint-disable-next-line react-refresh/only-export-components
function RootLayout() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
    </>
  )
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/discover', element: <DiscoverPage /> },
      { path: '/indicators/:code', element: <IndicatorPage /> },
      { path: '/countries', element: <CountriesPage /> },
      { path: '/compare', element: <ComparePage /> },
      { path: '/research', element: <ResearchPage /> },
      { path: '/docs', element: <DocsPage /> },
      { path: '/indicators', element: <Navigate to="/discover" replace /> },
      { path: '/references', element: <ReferencesPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
