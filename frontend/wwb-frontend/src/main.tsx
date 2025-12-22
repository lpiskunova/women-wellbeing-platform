import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from '@/app/App'
import { AppProviders } from '@/app/providers/AppProviders'
import '@/app/i18n/i18n'
import '@fontsource/geist-sans/400.css'
import '@fontsource/geist-sans/500.css'
import '@fontsource/geist-sans/600.css'
import '@fontsource/geist-sans/700.css'
import '@fontsource/geist-sans/800.css'
import '@fontsource/geist-mono/400.css'

import './styles/index.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>,
)
