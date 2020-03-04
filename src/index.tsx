import 'core-js'
import 'react-app-polyfill/ie11'

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import * as Sentry from '@sentry/browser'

import './index.scss'
import { isLocal } from './utils/env'
import ErrorBoundary from './components/ErrorBoundary'
import Disconnected from './components/Disconnected'
import App from './layouts/App'
import './customize.scss'

const dsn = ''
const environment = process.env.REACT_APP_ENV
!isLocal && !!dsn && Sentry.init({ dsn, environment })

ReactDOM.render(
  <ErrorBoundary>
    <Router>
      <App />
    </Router>
    <Disconnected />
  </ErrorBoundary>,
  document.getElementById('root')
)
