import { useTranslation } from 'react-i18next'
import { ManageAccounts } from '../types'

export default (): ManageAccounts => {
  const { t } = useTranslation()

  return {
    title: t('Auth:Manage:Manage wallets'),
    delete: {
      title: t('Auth:Manage:Delete wallet'),
      content: t(
        'Auth:Manage:Are you sure you want to delete this wallet? Your wallet cannot be recovered without seed phrase.'
      ),
      button: t('Auth:Manage:Delete'),
      cancel: t('Common:Form:Cancel'),
    },
    password: {
      title: t('Auth:Manage:Password changed'),
      content: t('Auth:Manage:You can now connect with your new password'),
      tooltip: t('Auth:Manage:Change password'),
    },
  }
}
