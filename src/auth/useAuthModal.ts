import { createContext } from '@terra-money/use-station'

interface ModalActions {
  close: () => void
  goBack: () => void
}

export const [useAuthModal, AuthModalProvider] = createContext<ModalActions>()
