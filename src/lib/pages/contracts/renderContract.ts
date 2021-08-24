import { TFunction } from 'i18next'
import { Contract, ContractUI, FinderFunction } from '../../types'
import { format } from '../../utils'

export default (
  contract: Contract,
  getLink: FinderFunction | undefined,
  t: TFunction
): ContractUI => ({
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
})
