import { useTranslation } from 'react-i18next'

export default () => {
  const { t } = useTranslation()

  return {
    OOPS: t('Common:Error:Oops! Something went wrong'),
    SIGN_IN: t('Auth:Menu:Select wallet'),
    CONNECT: t('Auth:Common:Connect'),
    WITH_AUTH: t('Auth:Common:Please connect with wallet or ledger to execute'),
    COPY: t('Common:Copy'),
    COPIED: t('Common:Copied'),
    VIEW_ADDRESS: t('Page:Bank:Verify this address on your Ledger'),
  }
}
