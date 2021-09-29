import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ContractsPage, Contract } from '../../../types'
import useFCD from '../../../api/useFCD'
import useFinder from '../../../hooks/useFinder'
import renderContract from './renderContract'

interface Params {
  owner?: string
  search?: string
}

interface Response {
  contracts: Contract[]
  limit: number
  next: number
}

export default (props: Params): ContractsPage => {
  const { t } = useTranslation()
  const getLink = useFinder()

  /* api */
  const [contracts, setContracts] = useState<Contract[]>([])
  const [next, setNext] = useState<number>()
  const [offset, setOffset] = useState<number>()
  const [done, setDone] = useState(false)

  const url = '/v1/wasm/contracts'
  const params = { ...props, offset }
  const response = useFCD<Response>({ url, params })
  const { data } = response

  useEffect(() => {
    if (data) {
      setContracts((contracts) => [...contracts, ...data.contracts])
      setNext(data.next)
      setDone(data.contracts.length < data.limit)
    }
  }, [data])

  const more = contracts.length && !done ? () => setOffset(next) : undefined

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
