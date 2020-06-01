import React, { useState, useEffect, ReactNode } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { ToastContainer, Slide } from 'react-toastify'
import { ToastContainerProps } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { without } from 'ramda'
import axios from 'axios'

import { useConfigState, ConfigProvider, User } from '@terra-money/use-station'
import { useAuthState, AuthProvider } from '@terra-money/use-station'
import { LangKey } from '@terra-money/use-station'

import { Chains } from '../chains'
import { electron, report } from '../utils'
import { isElectron } from '../utils/env'
import { localSettings, findName } from '../utils/localStorage'
import { useScrollToTop, useModal, AppProvider } from '../hooks'
import routes from './routes'

import ErrorBoundary from '../components/ErrorBoundary'
import ErrorComponent from '../components/ErrorComponent'
import ModalContent from '../components/ModalContent'
import Modal from '../components/Modal'
import Auth from '../auth/Auth'

import Nav from './Nav'
import Header from './Header'
import UpdateElectron from './UpdateElectron'
import s from './App.module.scss'

const App = () => {
  useScrollToTop()
  const { pathname } = useLocation()
  const modal = useModal()

  /* init app */
  const { lang, chain, address, ledger } = localSettings.get()

  const initialState = {
    lang: lang as LangKey,
    chain: Chains[chain!] ?? Chains['columbus']
  }

  const initialUser = address
    ? { name: findName(address), address, ledger }
    : undefined

  /* app state */
  const [appKey, setAppKey] = useState(0)
  const [goBack, setGoBack] = useState<string>()
  const refresh = () => setAppKey(k => k + 1)

  /* ready on electron version check */
  const deprecatedUI = useCheckElectronVersion(modal, refresh)

  /* redirect on chain change */
  useRedirectOnChainChange({ goBack, chain })

  /* provider */
  const config = useConfigState(initialState)
  const auth = useAuthState(initialUser)
  const { current: currentLang = '' } = config.lang
  const { current: currentChainOptions } = config.chain
  const { key: currentChain = '' } = currentChainOptions
  const { user } = auth

  /* auth modal */
  const authModal = useAuthModal(modal, user)

  /* render */
  const key = [currentLang, currentChain, appKey].join()
  const ready = !!(currentLang && currentChain && appKey > 0)
  const value = { refresh, goBack, setGoBack, modal, authModal }

  return deprecatedUI ?? !ready ? null : (
    <AppProvider value={value} key={key}>
      <ConfigProvider value={config}>
        <AuthProvider value={auth}>
          <Nav />
          <section className={s.main}>
            <Header className={s.header} />
            <section className={s.content}>
              <ErrorBoundary fallback={<ErrorComponent card />} key={pathname}>
                {routes}
              </ErrorBoundary>
            </section>
          </section>

          <Modal config={modal.config}>{modal.content}</Modal>
          <ToastContainer {...ToastConfig} autoClose={false} />
        </AuthProvider>
      </ConfigProvider>
    </AppProvider>
  )
}

export default App

/* toast */
const ToastConfig: ToastContainerProps = {
  position: 'top-right' as const,
  transition: Slide,
  draggable: false,
  closeButton: false,
  closeOnClick: false,
  hideProgressBar: true
}

/* hooks */
const useCheckElectronVersion = (modal: Modal, onCheck: () => void) => {
  const [deprecatedUI, setDeprecatedUI] = useState<ReactNode>()

  useEffect(() => {
    const checkVersion = async () => {
      const onDeprecatedUI = (data: Version) => {
        const inner = <UpdateElectron {...data} />
        const content = <ModalContent close={modal.close}>{inner}</ModalContent>
        data.forceUpdate ? setDeprecatedUI(inner) : modal.open(content)
      }

      try {
        const url = 'https://terra.money/station/version.json'
        const { data } = await axios.get<Version>(url)
        const version = electron<string>('version')
        version !== data.version && onDeprecatedUI(data)
      } catch (error) {
        report(error)
      }
    }

    const ready = async () => {
      isElectron && (await checkVersion())
      onCheck()
    }

    ready()
    // eslint-disable-next-line
  }, [])

  return deprecatedUI
}

const useRedirectOnChainChange = ({
  goBack,
  chain
}: {
  goBack?: string
  chain?: string
}) => {
  const { push } = useHistory()
  useEffect(() => {
    goBack && push(goBack)
    // eslint-disable-next-line
  }, [chain])
}

const useAuthModal = (modal: Modal, user?: User) => {
  const authModal = {
    open: () => modal.open(<Auth />),
    close: () => modal.close()
  }

  useEffect(() => {
    const onSignIn = ({ address, ledger }: User) => {
      const { recentAddresses = [] } = localSettings.get()
      const next = [address, ...without([address], recentAddresses)]
      localSettings.set({ address, ledger: !!ledger, recentAddresses: next })
    }

    const onSignOut = () => {
      localSettings.delete(['address', 'ledger'])
    }

    user ? onSignIn(user) : onSignOut()
    authModal.close()
    // eslint-disable-next-line
  }, [user])

  return authModal
}
