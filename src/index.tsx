import 'core-js'
import 'react-app-polyfill/ie11'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import * as Sentry from '@sentry/browser'
import { isLocal } from './helpers/env'
import './index.scss'
import ErrorBoundary from './components/ErrorBoundary'
import Disconnected from './components/Disconnected'
import App from './layouts/App'
import ScrollToTop from './helpers/ScrollToTop'
import s from './index.module.scss'

const dsn = ''
const environment = process.env.REACT_APP_ENV
!isLocal && !!dsn && Sentry.init({ dsn, environment })

ReactDOM.render(
  <ErrorBoundary fallback={<p className={s.p}>Station ran into an error</p>}>
    <Router>
      <ScrollToTop>
        <App />
      </ScrollToTop>
    </Router>
    <Disconnected />
  </ErrorBoundary>,
  document.getElementById('root')
)
