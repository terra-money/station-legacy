import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ContractsPage, Contract } from '../../types'
import useFCD from '../../api/useFCD'
import useFinder from '../../hooks/useFinder'
import { LIMIT } from '../constants'
import renderContract from './renderContract'

interface Params {
  owner?: string
  search?: string
}

export default (props: Params): ContractsPage => {
  const { t } = useTranslation()
  const getLink = useFinder()

  /* api */
  const [contracts, setContracts] = useState<Contract[]>([])
  const [offset, setOffset] = useState<number>()
  const [done, setDone] = useState(false)

  const url = '/v1/wasm/contracts'
  const params = { ...props, limit: LIMIT, offset }
  const response = useFCD<{ contracts: Contract[] }>({ url, params })
  const { data } = response

  useEffect(() => {
    if (data) {
      setContracts((contracts) => [...contracts, ...data.contracts])
      setDone(data.contracts.length < LIMIT)
    }
  }, [data])

  const more =
    contracts.length && !done
      ? () => setOffset(Number(contracts[contracts.length - 1].id))
      : undefined

  /* render */
  const ui =
    !response.loading && !contracts.length
      ? {
          card: {
            title: t('Page:Contracts:No contracts'),
            content: t('Page:Contracts:No contracts yet'),
          },
        }
      : {
          more,
          search: { placeholder: t('Page:Contracts:Search') },
          list: contracts.map((contract) =>
            renderContract(contract, getLink, t)
          ),
        }

  return {
    ...response,
    ui,
    create: { attrs: { children: t('Page:Contracts:Create') } },
    upload: { attrs: { children: t('Page:Contracts:Upload') } },
  }
}
