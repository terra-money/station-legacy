import { ContractInfo } from '@terra-money/terra.js'
import { useTranslation } from 'react-i18next'
import useFinder from '../../../hooks/useFinder'
import { Contract } from '../../../types'
import { format } from '../../../utils'

const useRenderContract = () => {
  const { t } = useTranslation()
  const getLink = useFinder()

  return (contract: Contract | ContractInfo) => {
    if ('contract_address' in contract) {
      return {
        address: contract?.contract_address,
        link: getLink?.({
          q: 'account',
          v: contract?.contract_address,
        }),
        date: format.date(contract?.timestamp, { toLocale: true }),
        code: {
          label: t('Post:Contracts:Code'),
          value: contract?.code?.info.name,
        },
        contract: {
          label: t('Page:Contracts:Contract'),
          value: contract?.info?.name,
        },
        interact: t('Page:Contracts:Interact'),
        query: t('Page:Contracts:Query'),
      }
    } else {
      return {
        address: contract?.address,
        link: getLink?.({
          q: 'account',
          v: contract?.address,
        }),
        code: {
          label: t('Post:Contracts:Code'),
          value: String(contract?.code_id),
        },
        interact: t('Page:Contracts:Interact'),
        query: t('Page:Contracts:Query'),
      }
    }
  }
}

export default useRenderContract
