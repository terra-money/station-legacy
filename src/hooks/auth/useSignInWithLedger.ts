import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ConfirmLedger } from '../../types'
import { useAuth } from '../../data/auth'

export default (getAddress: () => Promise<string>): ConfirmLedger => {
  const { t } = useTranslation()
  const { signIn } = useAuth()
  const [error, setError] = useState<Error>()

  const request = useCallback(async () => {
    try {
      setError(undefined)
      const address = await getAddress()
      signIn({ address, ledger: true })
    } catch (error) {
      setError(error)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    request()
  }, [request])

  return {
    card: {
      title: t('Auth:Menu:Select wallet'),
      content: t('Auth:SignIn:Please plug in your\nLedger Wallet'),
    },
    retry: error
      ? {
          attrs: { onClick: request, children: t('Common:Form:Retry') },
          message: error.message,
        }
      : undefined,
  }
}
