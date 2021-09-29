import 'core-js'
import 'react-app-polyfill/ie11'

import { ReactNode } from 'react'
import { render } from 'react-dom'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { RecoilRoot } from 'recoil'
import * as Sentry from '@sentry/browser'

import './lang'
import './index.scss'
import { isLocal, isExtension } from './utils/env'
import WithChains from './WithChains'
import ErrorBoundary from './components/ErrorBoundary'
import Disconnected from './components/Disconnected'
import App from './layouts/App'
import './customize.scss'

const dsn = ''
const environment = process.env.REACT_APP_ENV
!isLocal && !!dsn && Sentry.init({ dsn, environment })

const route = (children: ReactNode) =>
  isExtension ? (
    <HashRouter>{children}</HashRouter>
  ) : (
    <BrowserRouter>{children}</BrowserRouter>
  )

const queryClient = new QueryClient()

render(
  <ErrorBoundary>
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <WithChains>{route(<App />)}</WithChains>
        <Disconnected />
      </QueryClientProvider>
    </RecoilRoot>
  </ErrorBoundary>,
  document.getElementById('root')
)
