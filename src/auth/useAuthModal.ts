import { createContext } from '../lib'

interface AuthModal {
  modalActions: {
    close: () => void
    goBack?: () => void
  }

  actions: {
    glance: () => void
    download: () => void
  }
}

export const [useAuthModal, AuthModalProvider] = createContext<AuthModal>()
