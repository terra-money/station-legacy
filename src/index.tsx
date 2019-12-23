import 'core-js'
import 'react-app-polyfill/ie11'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as Sentry from '@sentry/browser'
import ko from './lang/ko.json'
import zh from './lang/zh.json'
import { localSettings } from './utils/localStorage'
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

i18n.use(initReactI18next).init({
  lng: localSettings.get().lang,
  resources: { ko: { translation: ko }, zh: { translation: zh } },
  keySeparator: false
})

ReactDOM.render(
  <ErrorBoundary
    fallback={<p className={s.p}>{i18n.t('Station ran into an error')}</p>}
  >
    <Router>
      <ScrollToTop>
        <App />
      </ScrollToTop>
    </Router>
    <Disconnected />
  </ErrorBoundary>,
  document.getElementById('root')
)
