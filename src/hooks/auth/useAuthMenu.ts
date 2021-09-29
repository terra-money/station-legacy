import { useTranslation } from 'react-i18next'
import { AuthMenu, AuthMenuKey } from '../../types'

export default (keys: AuthMenuKey[] = []): AuthMenu => {
  const { t } = useTranslation()

  const label: { [key in AuthMenuKey]: string } = {
    recover: t('Auth:Menu:Recover existing wallet'),
    importKey: 'Import private key',
    signUp: t('Auth:Menu:New wallet'),
    signIn: t('Auth:Menu:Select wallet'),
    signInWithAddress: t('Auth:Menu:Browse with address'),
    signInWithLedger: t('Auth:Menu:Access with ledger'),
    download: t('Auth:Menu:Download Terra Station'),
  }

  return {
    ui: {
      mobile: {
        title: t('Auth:Common:Welcome'),
        content: keys.includes('signIn')
          ? t(
              'Auth:Common:Connect to your wallet, create a new wallet or recover an existing wallet using a seed phrase'
            )
          : t(
              'Auth:Common:Create a new wallet or recover an existing wallet using a seed phrase'
            ),
      },
      web: {
        signInWithLedger: [
          t('Auth:Common:Just browsing?'),
          t('Auth:Common:Quickly glance through your address'),
        ],
        tooltip: {
          label: t('Auth:Common:How can I create an wallet?'),
          link: 'https://terra.money/protocol',
          i18nKey:
            "Auth:Common:If you want to create an wallet, please download <0>Terra Station for Windows/MacOS</0>. We don't support creating an wallet for Terra Station web due to the security reasons.",
        },
      },
    },
    list: keys
      .filter((key) => label[key])
      .map((key) => ({ label: label[key], key })),
  }
}
