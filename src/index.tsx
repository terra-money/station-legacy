import 'core-js'
import 'react-app-polyfill/ie11'

import React, { ReactNode } from 'react'
import { render } from 'react-dom'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import * as Sentry from '@sentry/browser'

import './index.scss'
import { isLocal, isExtension } from './utils/env'
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

render(
  <ErrorBoundary>
    {route(<App />)}
    <Disconnected />
  </ErrorBoundary>,
  document.getElementById('root')
)
