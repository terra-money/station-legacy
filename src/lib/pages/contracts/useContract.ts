import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ContractUI, Contract } from '../../types'
import useFCD from '../../api/useFCD'
import useFinder from '../../hooks/useFinder'
import renderContract from './renderContract'

export default (param: string): ContractUI | undefined => {
  const { t } = useTranslation()
  const getLink = useFinder()

  /* api */
  const url = `/v1/wasm/contract/${param}`
  const { execute, data, error } = useFCD<Contract>({ url }, false)

  useEffect(() => {
    param && execute()
  }, [param, execute])

  return param && data && !error ? renderContract(data, getLink, t) : undefined
}
