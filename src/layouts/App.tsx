import { useState, useEffect, ReactNode } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { ToastContainer, Slide } from 'react-toastify'
import { ToastContainerProps } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import extension from 'extensionizer'
import axios from 'axios'
import c from 'classnames'

import { useCurrentChainName } from '../data/chain'
import { useCurrency } from '../data/currency'
import { useLang } from '../data/lang'
import { TERRA_ASSETS } from '../constants'

import { electron, report } from '../utils'
import { isElectron, isExtension } from '../utils/env'
import { useScrollToTop, useModal, AppProvider } from '../hooks'
import routes from './routes'

import ErrorBoundary from '../components/ErrorBoundary'
import ErrorComponent from '../components/ErrorComponent'
import ModalContent from '../components/ModalContent'
import Modal from '../components/Modal'
import UnderMaintenance from '../components/UnderMaintenance'
import AuthModal from '../auth/AuthModal'
import useMergeChains from '../pages/settings/useMergedChains'

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

  const currentLang = useLang()
  const currentCurrency = useCurrency()
  const currentChainName = useCurrentChainName()

  /* app state */
  const [appKey, setAppKey] = useState(0)
  const [goBack, setGoBack] = useState<string>()
  const refresh = () => setAppKey((k) => k + 1)

  /* ready on electron version check */
  const deprecatedUI = useCheckElectronVersion(modal, refresh)

  /* redirect on chain change */
  useOnChainChange({ goBack, chain: currentChainName })

  /* auth modal */
  const authModal = useAuthModal(modal)

  /* extension */
  const extension = useExtensionRequested()

  /* app */
  const [padding, setPadding] = useState<boolean>(true)
  const app = { setPadding, refresh, goBack, setGoBack, modal, authModal }

  /* render */
  const key = [currentLang, currentChainName, currentCurrency, appKey].join()
  const ready = !!(
    currentLang &&
    currentChainName &&
    currentCurrency &&
    appKey > 0
  )

  return deprecatedUI ?? !ready ? null : (
    <ExtensionProvider value={extension}>
      <AppProvider value={app} key={key}>
        <Nav />
        <section className={s.main}>
          <Header className={s.header} />
          <section
            className={c(
              isExtension ? s.extension : s.content,
              isExtension && padding && s.padding
            )}
          >
            <ErrorBoundary fallback={<ErrorComponent card />} key={pathname}>
              {isExtension ? <Extension /> : routes}
            </ErrorBoundary>
          </section>
        </section>

        <Modal config={modal.config}>{modal.content}</Modal>
        <ToastContainer {...ToastConfig} autoClose={false} />
        <UnderMaintenance />
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
        const url = `${TERRA_ASSETS}/station/version.json`
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

const useAuthModal = (modal: Modal) => ({
  open: () => modal.open(<AuthModal />),
  close: () => modal.close(),
})
