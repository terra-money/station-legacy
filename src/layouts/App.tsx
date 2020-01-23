import React, { useState, useEffect, createContext, ReactNode } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { ToastContainer, toast, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { isElectron } from '../helpers/env'
import electron from '../helpers/electron'
import { changeChain, ChainList } from '../api/api'
import { report } from '../utils'
import { localSettings } from '../utils/localStorage'
import { useModal } from '../hooks'
import routes from '../routes'
import { Languages } from '../lang/list'
import Modal from '../components/Modal'
import ModalContent from '../components/ModalContent'
import ErrorBoundary from '../components/ErrorBoundary'
import Version from '../pages/Version'
import Auth from '../pages/auth/Auth'
import Nav from './Nav'
import Header from './Header'
import AuthContext, { useAuthContext } from './AuthContext'
import s from './App.module.scss'
import './App.scss'
import { useTranslation } from 'react-i18next'

type AppContext = {
  key: number
  isReady: boolean
  refresh: () => void
  authModal: { open: () => void; close: () => void }

  lang: string
  selectLang: (lang: string) => void

  chain: string
  selectChain: (chain: string) => void

  goBack: string
  setGoBack: (path: string) => void
}

const initial = {
  key: 0,
  isReady: false,
  refresh: () => {},
  authModal: { open: () => {}, close: () => {} },

  lang: Languages.en.key,
  selectLang: () => {},

  chain: ChainList[0],
  selectChain: () => {},

  goBack: '',
  setGoBack: () => {}
}

export const AppContext = createContext<AppContext>(initial)

const App = ({ location, history }: RouteComponentProps) => {
  const getInitialChain = () => {
    const { chain: local } = localSettings.get()
    const defaultChain = ChainList[0]
    const chain = local && ChainList.includes(local) ? local : defaultChain
    localSettings.set({ chain })
    return chain
  }

  const getInitialLang = () => {
    const { lang: local } = localSettings.get()
    const d = Object.keys(Languages).find(key => i18n.languages.includes(key))
    const init = local ?? d
    return init && Languages[init] ? init : initial.lang
  }

  const { i18n } = useTranslation()

  /* context: modal */
  const modal = useModal()

  /* context: auth */
  const auth = useAuthContext({
    onSignIn: () => modal.close(),
    onSignOut: () => {}
  })

  /* effect: app */
  const [lang, setLang] = useState<string>(getInitialLang)
  const [chain, setChain] = useState<string>(getInitialChain)
  const [key, setKey] = useState<number>(initial.key) // refresh
  const [disabled, setDisabled] = useState<ReactNode>()
  const refresh = () => setKey(k => k + 1)

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const onDeprecated = (data: Version) => {
          const content = <Version {...data} />
          data.forceUpdate
            ? setDisabled(content)
            : modal.open(
                <ModalContent close={modal.close}>{content}</ModalContent>
              )
        }

        const url = 'https://terra.money/station/version.json'
        const { data } = await axios.get<Version>(url)
        const version = electron<string>('version')
        version !== data.version && onDeprecated(data)
      } catch (error) {
        report(error)
      }
    }

    const ready = async () => {
      localSettings.migrate()

      const { address, withLedger } = localSettings.get()
      address && auth.signin({ address, withLedger })
      changeChain(chain)
      isElectron && (await checkVersion())
      setKey(1)
    }

    ready()
    // eslint-disable-next-line
  }, [])

  /* provider: auth */
  const authModal = {
    open: () => modal.open(<Auth onClose={modal.close} />),
    close: modal.close
  }

  /* provider: app */
  const [goBack, setGoBack] = useState(initial.goBack) // Header

  const selectLang = (lang: string) => {
    localSettings.set({ lang })
    i18n.changeLanguage(lang)
    setLang(lang)
    refresh()
  }

  const selectChain = (chain: string) => {
    localSettings.set({ chain })
    changeChain(chain)
    setChain(chain)
    location.pathname.includes('/validator') && history.push('/staking')
    location.pathname.includes('/proposal') && history.push('/governance')
    refresh()
  }

  const isReady = !!key
  const app = Object.assign(
    { key, isReady, refresh, authModal },
    { lang, selectLang, chain, selectChain, goBack, setGoBack }
  )

  return disabled ? (
    <>{disabled}</>
  ) : isReady ? (
    <AppContext.Provider value={app}>
      <AuthContext.Provider value={auth}>
        <Nav pathname={location.pathname} key={key} />
        <section className={s.main}>
          <Header className={s.header} />
          <section className={s.content} key={key}>
            <ErrorBoundary key={location.pathname}>{routes}</ErrorBoundary>
          </section>
        </section>
        <Modal config={modal.config}>{modal.content}</Modal>
        <ToastContainer {...ToastConfig} autoClose={false} />
      </AuthContext.Provider>
    </AppContext.Provider>
  ) : null
}

export default withRouter(App)

/* Toast */
const ToastConfig = {
  position: toast.POSITION.TOP_RIGHT,
  transition: Slide,
  draggable: false,
  closeButton: false,
  closeOnClick: false
}
