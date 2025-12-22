import { RouterProvider } from 'react-router-dom'
import { router } from '@/app/router/router'
import { AppErrorBoundary } from './providers/AppErrorBoundary'

export function App() {
  return (
    <AppErrorBoundary>
      <RouterProvider router={router} />
    </AppErrorBoundary>
  )
}
