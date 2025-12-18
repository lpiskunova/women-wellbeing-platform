import { Provider } from 'react-redux'
import { store } from '@/app/store/store'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>
}
