import React, { useState, useEffect, ReactNode } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { ToastContainer, Slide } from 'react-toastify'
import { ToastContainerProps } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import extension from 'extensionizer'
import { without } from 'ramda'
import axios from 'axios'
import c from 'classnames'

import { useConfigState, ConfigProvider, User } from '@terra-money/use-station'
import { useAuthState, AuthProvider } from '@terra-money/use-station'
import { LangKey } from '@terra-money/use-station'

import { Chains } from '../chains'
import { electron, report } from '../utils'
import { isElectron, isExtension } from '../utils/env'
import { localSettings } from '../utils/localStorage'
import { useScrollToTop, useModal, AppProvider } from '../hooks'
import routes from './routes'

import ErrorBoundary from '../components/ErrorBoundary'
import ErrorComponent from '../components/ErrorComponent'
import ModalContent from '../components/ModalContent'
import Modal from '../components/Modal'
import AuthModal from '../auth/AuthModal'
import useMergeChains from '../pages/settings/useMergeChains'

import Extension from '../extension/Extension'
import { useExtensionRequested } from '../extension/useExtension'
import { ExtensionProvider } from '../extension/useExtension'

import Nav from './Nav'
import Header from './Header'
import UpdateElectron from './UpdateElectron'
import s from './App.module.scss'

const App = () => {
  useScrollToTop()
  const { pathname } = useLocation()
  const modal = useModal()

  /* init app */
  const { lang, currency, chain, user: initialUser } = localSettings.get()
  const chains = useMergeChains()

  const initialState = {
    lang: lang as LangKey,
    currency,
    chain: chains[chain!] ?? Chains['mainnet'],
  }

  /* app state */
  const [appKey, setAppKey] = useState(0)
  const [goBack, setGoBack] = useState<string>()
  const refresh = () => setAppKey((k) => k + 1)

  /* ready on electron version check */
  const deprecatedUI = useCheckElectronVersion(modal, refresh)

  /* redirect on chain change */
  useOnChainChange({ goBack, chain })

  /* provider */
  const config = useConfigState(initialState)
  const auth = useAuthState(initialUser)
  const { current: currentLang = '' } = config.lang
  const { current: currentCurrencyItem } = config.currency
  const { current: currentChainOptions } = config.chain
  const { key: currentCurrency = '' } = currentCurrencyItem || {}
  const { name: currentChain = '' } = currentChainOptions
  const { user } = auth

  /* auth modal */
  const authModal = useAuthModal(modal, user)

  /* extension */
  const extension = useExtensionRequested()

  /* render */
  const [padding, setPadding] = useState<boolean>(true)
  const key = [currentLang, currentChain, currentCurrency, appKey].join()
  const ready = !!(currentLang && currentChain && currentCurrency && appKey > 0)
  const value = { setPadding, refresh, goBack, setGoBack, modal, authModal }

  return deprecatedUI ?? !ready ? null : (
    <ExtensionProvider value={extension}>
      <AppProvider value={value} key={key}>
        <ConfigProvider value={config}>
          <AuthProvider value={auth}>
            <Nav />
            <section className={s.main}>
              <Header className={s.header} />
              <section
                className={c(
                  isExtension ? s.extension : s.content,
                  isExtension && padding && s.padding
                )}
              >
                <ErrorBoundary
                  fallback={<ErrorComponent card />}
                  key={pathname}
                >
                  {isExtension ? <Extension /> : routes}
                </ErrorBoundary>
              </section>
            </section>

            <Modal config={modal.config}>{modal.content}</Modal>
            <ToastContainer {...ToastConfig} autoClose={false} />
          </AuthProvider>
        </ConfigProvider>
      </AppProvider>
    </ExtensionProvider>
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
  hideProgressBar: true,
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

const useOnChainChange = ({
  goBack,
  chain,
}: {
  goBack?: string
  chain?: string
}) => {
  const { push } = useHistory()
  const chains = useMergeChains()
  useEffect(() => {
    goBack && push(goBack)
    extension.storage?.local.set({ network: chains[chain ?? 'mainnet'] })
    // eslint-disable-next-line
  }, [chain])
}

const useAuthModal = (modal: Modal, user?: User) => {
  const authModal = {
    open: () => modal.open(<AuthModal />),
    close: () => modal.close(),
  }

  useEffect(() => {
    const onSignIn = (user: User) => {
      const { address } = user
      const { recentAddresses = [] } = localSettings.get()
      const next = [address, ...without([address], recentAddresses)]
      localSettings.set({ user, recentAddresses: next })
      extension.storage?.local.set({ wallet: { address } })
    }

    const onSignOut = () => {
      localSettings.delete(['user'])
      extension.storage?.local.remove(['wallet'])
    }

    user ? onSignIn(user) : onSignOut()
    authModal.close()
    // eslint-disable-next-line
  }, [user])

  return authModal
}
