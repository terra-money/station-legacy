import { useApp } from '../hooks'

export const useAuthModal = () => {
  const { authModal } = useApp()
  return authModal
}
