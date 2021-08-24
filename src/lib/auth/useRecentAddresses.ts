import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { RecentAddresses } from '../types'

export default (recentAddresses: string[]): RecentAddresses => {
  const { t } = useTranslation()
  const { signIn } = useAuth()

  return {
    title: t('Auth:Manage:Recent addresses'),
    deleteAll: t('Auth:Manage:Delete all'),
    buttons: recentAddresses.map((address) => ({
      onClick: () => signIn({ address }),
      children: address,
    })),
  }
}
