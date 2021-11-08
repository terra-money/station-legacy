import { isTnsName, NetworkName, TNS } from '@tns-money/tns.js'
import _ from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCurrentChainName } from '../data/chain'

export const useTns = () => {
  const currentChainName = useCurrentChainName()
  const { t } = useTranslation()

  const [address, setAddress] = useState('')
  const [isError, setIsError] = useState(false)

  const resolveDebounced = useMemo(
    () =>
      _.debounce(async (name: string) => {
        if (isTnsName(name)) {
          const tns = new TNS({ network: currentChainName as NetworkName })

          try {
            const terraAddress = await tns.name(name).getTerraAddress()

            if (terraAddress) {
              setAddress(terraAddress)
            } else {
              setIsError(true)
            }
          } catch {}
        }
      }, 350),
    [currentChainName]
  )

  return {
    address,
    resolve: useCallback(
      (name: string) => {
        setAddress('')
        setIsError(false)
        resolveDebounced(name)
      },
      [resolveDebounced]
    ),
    error: isError ? t('Common:TNS:This name has not yet been configured') : '',
  }
}
